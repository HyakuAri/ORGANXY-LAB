<template>
  <canvas ref="canvasEl" class="shard-canvas" aria-hidden="true" />
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { createEnvironment } from '../home/env.js'
import { resolveQuality, PRESETS } from '../home/quality.js'
import { buildLiquidShader } from '../home/liquid-shader.js'

const canvasEl = ref(null)

let disposed = false
let renderer = null
let scene = null
let camera = null
let shardRoot = null
let glassMaterial = null
let chromeMaterial = null
let coreMaterial = null
let coreLight = null
let envTexture = null
let composer = null
let liquidPass = null
let stretchTimer = 0
let spotTimer = 0
let rafId = 0
let running = false
let stillMode = false
let reducedMotion = false
let forcedTime = 2.8
let t = 0
let ready = false
let lastFrameTime = 0

/* Quality */
let preset = PRESETS.high
let baseDpr = 1
let scale = 1
let avgFrame = 16
let tuneBudget = 0
const MIN_SCALE = 0.55

const pointer = new THREE.Vector2(0, 0)
const pointerTarget = new THREE.Vector2(0, 0)
const cameraBase = new THREE.Vector3(0, 1.5, 9.2)
const lookBase = new THREE.Vector3(0.55, 1.05, 0)

/* ------------------------------------------------------------
   Object-space mix mask, mirroring the Blender noise + ring wave
   ------------------------------------------------------------ */

const SHARD_MASK_GLSL = /* glsl */ `
  varying vec3 vShardPos;

  float shardHash(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
  }

  float shardNoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float n000 = shardHash(i);
    float n100 = shardHash(i + vec3(1.0, 0.0, 0.0));
    float n010 = shardHash(i + vec3(0.0, 1.0, 0.0));
    float n110 = shardHash(i + vec3(1.0, 1.0, 0.0));
    float n001 = shardHash(i + vec3(0.0, 0.0, 1.0));
    float n101 = shardHash(i + vec3(1.0, 0.0, 1.0));
    float n011 = shardHash(i + vec3(0.0, 1.0, 1.0));
    float n111 = shardHash(i + vec3(1.0, 1.0, 1.0));

    return mix(
      mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
      mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
      f.z
    );
  }

  float shardFbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * shardNoise(p);
      p = p * 2.07 + vec3(11.1, 7.3, 5.7);
      a *= 0.5;
    }
    return v;
  }

  float shardMask(vec3 p) {
    vec3 q = p * vec3(0.3, 0.6, -0.1);

    float cx = cos(0.4677);
    float sx = sin(0.4677);
    float cy = cos(-0.001745);
    float sy = sin(-0.001745);
    float cz = cos(0.0349);
    float sz = sin(0.0349);

    q = vec3(q.x, cx * q.y - sx * q.z, sx * q.y + cx * q.z);
    q = vec3(cy * q.x + sy * q.z, q.y, -sy * q.x + cy * q.z);
    q = vec3(cz * q.x - sz * q.y, sz * q.x + cz * q.y, q.z);

    float waveNoise = shardFbm(q * 0.35);
    float fine = shardFbm(q * 18.5 + vec3(5.0, 2.0, 7.0));

    float phase = length(q) * 0.05 * 6.28318 * 2.0 + waveNoise * (-42.0) + fine * 4.0 - 4.7;
    float wave = sin(phase);
    float m = 0.5 + 0.5 * wave;
    m += (fine - 0.5) * 0.3;

    return smoothstep(0.3, 0.7, m);
  }
`

function applyShardMask(material, keepAbove) {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader =
      'varying vec3 vShardPos;\n' +
      shader.vertexShader.replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\n\tvShardPos = position;'
      )

    shader.fragmentShader =
      SHARD_MASK_GLSL +
      shader.fragmentShader.replace(
        '#include <clipping_planes_fragment>',
        '#include <clipping_planes_fragment>\n' +
          '\tfloat shardM = shardMask(vShardPos);\n' +
          '\tfloat shardD = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.05;\n' +
          (keepAbove
            ? '\tif (shardM + shardD < 0.5) discard;\n'
            : '\tif (shardM + shardD >= 0.5) discard;\n')
      )
  }

  material.customProgramCacheKey = () => (keepAbove ? 'shard-glass' : 'shard-chrome')
  material.needsUpdate = true
}

/* ------------------------------------------------------------
   Environment
   ------------------------------------------------------------ */

function loadHdri() {
  const loader = new EXRLoader()

  loader.load(
    '/env/studio.exr',
    (texture) => {
      if (disposed) {
        texture.dispose()
        return
      }

      texture.mapping = THREE.EquirectangularReflectionMapping
      const pmrem = new THREE.PMREMGenerator(renderer)
      const target = pmrem.fromEquirectangular(texture)
      pmrem.dispose()
      texture.dispose()

      if (envTexture) envTexture.dispose()
      envTexture = target.texture

      scene.environment = envTexture
      scene.environmentIntensity = 1.15
      scene.background = new THREE.Color(0x05060a)

      console.log('[shard] HDRI studio environment loaded')
      renderStillFrame()
    },
    undefined,
    (error) => {
      console.warn('[shard] HDRI failed, falling back to procedural env', error)
      if (disposed) return
      envTexture = createEnvironment(renderer)
      scene.environment = envTexture
      scene.environmentIntensity = 1.0
      scene.background = new THREE.Color(0x05060a)
      renderStillFrame()
    }
  )
}

function addLights() {
  const key = new THREE.DirectionalLight(0xfff2e4, 3.2)
  key.position.set(-4.5, 7.5, 5.5)
  scene.add(key)

  const rim = new THREE.DirectionalLight(0xbfd8ff, 1.4)
  rim.position.set(6.0, 2.2, -5.0)
  scene.add(rim)

  const fill = new THREE.DirectionalLight(0xe8eef8, 0.5)
  fill.position.set(3.0, -1.5, 3.5)
  scene.add(fill)

  // HDRI key light is on the left, so add a fill light on the right
  // front, on the crystal side, to lift that half of the frame.
  const halo = new THREE.PointLight(0xff8a50, 55, 24, 2)
  halo.position.set(7.0, 3.6, 3.5)
  scene.add(halo)

  const coolFill = new THREE.PointLight(0x9db8e0, 26, 26, 2)
  coolFill.position.set(7.5, 1.0, -1.0)
  scene.add(coolFill)
}

/* A large dark chrome sphere around the scene: it picks up the studio
   HDRI as a soft metallic reflection instead of a flat black void. */
function addBackdrop() {
  const material = new THREE.MeshStandardMaterial({
    color: 0x222222,
    metalness: 0.5,
    roughness: 0.05,
    envMapIntensity: 1,
    side: THREE.BackSide
  })
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(34, 64, 32), material)
  mesh.name = 'stage-backdrop'
  scene.add(mesh)
}

/* ------------------------------------------------------------
   Materials
   ------------------------------------------------------------ */

function buildMaterials() {
  // A real transmission pass means three.js renders the whole scene a
  // second time into a back buffer. Desktops can afford it; phones get
  // a refractive-looking blend instead, which is visually close at this
  // size and costs a fraction.
  glassMaterial = preset.transmission
    ? new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xffffff),
        metalness: 0.0,
        roughness: 0.093,
        transmission: 1.0,
        thickness: 0.9,
        ior: 1.3,
        clearcoat: 0.0,
        envMapIntensity: 1.5,
        dispersion: preset.dispersion ? 0.35 : 0.0,
        side: THREE.FrontSide
      })
    : new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xdfe8f2),
        metalness: 0.15,
        roughness: 0.08,
        ior: 1.3,
        clearcoat: 0.6,
        clearcoatRoughness: 0.1,
        envMapIntensity: 2.0,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        side: THREE.FrontSide
      })
  applyShardMask(glassMaterial, true)

  chromeMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xffffff),
    metalness: 1.0,
    roughness: 0.015,
    clearcoat: 0.241,
    clearcoatRoughness: 0.162,
    ior: 1.8,
    envMapIntensity: 2.2,
    side: THREE.FrontSide
  })
  applyShardMask(chromeMaterial, false)

  coreMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x8a8a8a),
    metalness: 1.0,
    roughness: 0.02,
    emissive: new THREE.Color(0xff6a2a),
    emissiveIntensity: 200.0,
    ior: 1.8,
    envMapIntensity: 1.0
  })
}

/* ------------------------------------------------------------
   Shard
   ------------------------------------------------------------ */

function loadShard() {
  const loader = new GLTFLoader()

  loader.load(
    '/3d/SHARD.glb',
    (gltf) => {
      if (disposed) return

      const model = gltf.scene
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z) || 1
      const fit = 3.55 / maxDim

      model.scale.multiplyScalar(fit)
      model.position.set(-center.x * fit, -center.y * fit, -center.z * fit)

      const shells = []
      let core = null

      model.traverse((child) => {
        if (!child.isMesh) return

        const original = Array.isArray(child.material) ? child.material[0] : child.material
        const emissive = original && original.emissive ? original.emissive : null
        const isCore = !!emissive && emissive.r + emissive.g + emissive.b > 0.05

        if (isCore) {
          child.material = coreMaterial
          core = child
        } else {
          shells.push(child)
        }
        child.frustumCulled = false
      })

      for (const shell of shells) {
        shell.material = chromeMaterial
        shell.renderOrder = 1

        const glass = new THREE.Mesh(shell.geometry, glassMaterial)
        glass.position.copy(shell.position)
        glass.quaternion.copy(shell.quaternion)
        glass.scale.copy(shell.scale)
        glass.renderOrder = 2
        glass.frustumCulled = false
        shell.parent.add(glass)
      }

      shardRoot = new THREE.Group()
      shardRoot.add(model)
      shardRoot.position.set(2.3, 1.35, 0)
      shardRoot.rotation.set(0.08, 0.62, 0.03)
      scene.add(shardRoot)

      coreLight = new THREE.PointLight(0xff6a2a, 300, 12, 2)
      coreLight.position.set(0, 0, 0)
      shardRoot.add(coreLight)

      layoutScene(window.innerWidth, window.innerHeight)

      console.log(
        '[shard] loaded',
        'size', size.toArray().map((v) => v.toFixed(2)).join(' '),
        'scale', fit.toFixed(3),
        'shells', shells.length,
        'core', !!core
      )

      if (!stillMode && !reducedMotion) {
        markReady()
      }
      renderStillFrame()
    },
    undefined,
    (error) => {
      console.warn('[shard] failed to load /3d/SHARD.glb', error)
      markReady()
      renderStillFrame()
    }
  )
}

/* ------------------------------------------------------------
   Layout, animation
   ------------------------------------------------------------ */

function layoutScene(w, h) {
  const mobile = w < 820

  if (mobile) {
    cameraBase.set(0, 2.25, 10.6)
    lookBase.set(0, 1.95, 0)
    if (shardRoot) shardRoot.position.set(0, 2.5, 0)
  } else {
    cameraBase.set(0, 1.5, 9.2)
    lookBase.set(0.55, 1.05, 0)
    if (shardRoot) shardRoot.position.set(2.3, 1.35, 0)
  }

  camera.position.copy(cameraBase)
  camera.lookAt(lookBase)
}

function updateScene(dt) {
  const smooth = 1 - Math.pow(0.0008, Math.max(dt, 0.016))
  pointer.lerp(pointerTarget, smooth)

  const px = pointer.x
  const py = pointer.y

  if (shardRoot) {
    shardRoot.rotation.y = 0.62 + t * 0.11 + px * 0.26
    shardRoot.rotation.x = 0.07 + py * 0.13 + Math.sin(t * 0.21) * 0.025
    shardRoot.rotation.z = 0.03 + Math.sin(t * 0.17) * 0.02
  }

  if (coreMaterial) {
    coreMaterial.emissiveIntensity = 200.0 + Math.sin(t * 1.05) * 40.0
  }

  if (coreLight) {
    coreLight.intensity = 280 + Math.sin(t * 1.05) * 60
  }

  camera.position.set(
    cameraBase.x + px * 0.34,
    cameraBase.y + py * 0.2,
    cameraBase.z
  )
  camera.lookAt(lookBase.x + px * 0.06, lookBase.y + py * 0.04, lookBase.z)
}

function renderFrame() {
  if (!composer) return
  if (liquidPass) liquidPass.uniforms.uTime.value = t
  composer.render()
}

function renderStillFrame() {
  if (!(stillMode || reducedMotion) || !renderer) return
  t = forcedTime
  updateScene(0)
  renderFrame()
  markReady()
}

/* ------------------------------------------------------------
   Resolution scaling: keep the frame rate, spend pixels on it.

   Instead of a fixed devicePixelRatio we watch the frame time and
   trade resolution for smoothness, then give the pixels back when
   the GPU has headroom again.
   ------------------------------------------------------------ */

function syncResolution(w, h) {
  if (!liquidPass || !renderer) return
  const size = renderer.getDrawingBufferSize(new THREE.Vector2())
  liquidPass.uniforms.uResolution.value.copy(size)
  liquidPass.uniforms.uAspect.value = h / Math.max(w, 1)
}

function applyPixelRatio() {
  if (!renderer) return

  const w = window.innerWidth
  const h = window.innerHeight

  renderer.setPixelRatio(baseDpr * scale)

  if (composer) {
    composer.setPixelRatio(renderer.getPixelRatio())
    composer.setSize(w, h)
  }

  syncResolution(w, h)
}

function tuneResolution(ms) {
  if (preset.fps || stillMode || reducedMotion) return

  avgFrame = avgFrame * 0.92 + ms * 0.08
  if (performance.now() < tuneBudget) return

  let next = scale
  if (avgFrame > 24) next = Math.max(MIN_SCALE, scale - 0.12)
  else if (avgFrame < 13 && scale < 1) next = Math.min(1, scale + 0.08)

  if (Math.abs(next - scale) > 0.05) {
    scale = next
    applyPixelRatio()
    tuneBudget = performance.now() + 1200
  }
}

/* ------------------------------------------------------------
   Glitch patches
   ------------------------------------------------------------ */

function randomizeSpots() {
  if (!liquidPass) return

  const spots = liquidPass.uniforms.uSpots.value
  const count = Math.min(spots.length, preset.spots)
  const w = Math.max(window.innerWidth, 1)
  const h = Math.max(window.innerHeight, 1)

  for (let i = 0; i < spots.length; i++) {
    const s = spots[i]
    if (i >= count) {
      s.set(0, 0, 0, 0)
      continue
    }

    const onRight = Math.random() < 0.7
    const cx = onRight ? Math.random() * 0.5 : Math.random() * 0.5 - 0.25
    const cy = Math.random() - 0.5
    const hw = (12 + Math.random() * 30) / w
    const hh = (12 + Math.random() * 34) / h

    s.set(0.5 + cx, 0.5 + cy, Math.max(hw, 0.01), Math.max(hh, 0.01))
  }

  liquidPass.uniforms.uGrid.value = 48 + Math.random() * 42
  liquidPass.uniforms.uSpotMix.value = 0.75 + Math.random() * 0.25
}

/* ------------------------------------------------------------
   Loop
   ------------------------------------------------------------ */

function loop(now) {
  if (!running) return
  rafId = requestAnimationFrame(loop)

  if (preset.fps && now - lastFrameTime < 1000 / preset.fps - 1) return

  const dt = Math.min((now - lastFrameTime) / 1000, 0.05)
  lastFrameTime = now
  t += dt

  tuneResolution(dt * 1000)
  updateScene(dt)
  renderFrame()
}

function markReady() {
  if (ready || !canvasEl.value) return
  ready = true
  canvasEl.value.classList.add('is-ready')
}

/* ------------------------------------------------------------
   Events
   ------------------------------------------------------------ */

function onResize() {
  if (disposed) return

  const w = window.innerWidth
  const h = window.innerHeight

  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h, false)
  applyPixelRatio()
  layoutScene(w, h)

  if (stillMode || reducedMotion) {
    updateScene(0)
    renderFrame()
  }
}

function onPointerMove(event) {
  pointerTarget.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -((event.clientY / window.innerHeight) * 2 - 1)
  )
}

function onVisibilityChange() {
  if (stillMode || reducedMotion) return

  if (document.hidden) {
    running = false
    cancelAnimationFrame(rafId)
  } else if (!running) {
    running = true
    lastFrameTime = performance.now()
    loop(performance.now())
  }
}

function dispose() {
  disposed = true
  running = false
  cancelAnimationFrame(rafId)

  window.removeEventListener('resize', onResize)
  window.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  window.clearInterval(stretchTimer)
  window.clearInterval(spotTimer)

  if (scene) {
    const geometries = new Set()
    const materials = new Set()
    const textures = new Set()

    scene.traverse((child) => {
      if (child.geometry) geometries.add(child.geometry)
      if (child.material) {
        const list = Array.isArray(child.material) ? child.material : [child.material]
        for (const material of list) {
          materials.add(material)
          for (const key of Object.keys(material)) {
            const value = material[key]
            if (value && value.isTexture) textures.add(value)
          }
        }
      }
    })

    for (const geometry of geometries) geometry.dispose()
    for (const material of materials) material.dispose()
    for (const texture of textures) texture.dispose()
  }

  if (envTexture) envTexture.dispose()

  if (composer) composer.dispose()

  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
  }
}

/* ------------------------------------------------------------
   Boot
   ------------------------------------------------------------ */

function init() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('gl') === 'off') return

  stillMode = params.get('still') === '1'
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  forcedTime = Number(params.get('t') || (stillMode ? 2.8 : 2.2))

  preset = PRESETS[resolveQuality()] || PRESETS.balanced
  baseDpr = Math.max(0.75, Math.min(window.devicePixelRatio || 1, preset.dprMax))

  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvasEl.value,
      // The composer resolves into its own target, so canvas MSAA buys
      // nothing; antialiasing comes from the composer samples instead.
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
      stencil: false
    })
  } catch (error) {
    console.warn('[shard] WebGL is not available', error)
    return
  }

  renderer.setPixelRatio(baseDpr)
  renderer.setSize(window.innerWidth, window.innerHeight, false)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.setClearColor(0x05060a, 1)

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x05060a)

  camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.1, 180)
  camera.position.copy(cameraBase)
  camera.lookAt(lookBase)

  loadHdri()
  addLights()
  addBackdrop()
  buildMaterials()
  loadShard()

  const size = renderer.getDrawingBufferSize(new THREE.Vector2())
  const renderTarget = new THREE.WebGLRenderTarget(size.x, size.y, {
    type: preset.halfFloat ? THREE.HalfFloatType : THREE.UnsignedByteType,
    samples: preset.samples
  })

  composer = new EffectComposer(renderer, renderTarget)
  composer.setPixelRatio(renderer.getPixelRatio())
  composer.addPass(new RenderPass(scene, camera))

  liquidPass = new ShaderPass(buildLiquidShader(preset))
  liquidPass.uniforms.uResolution.value.copy(size)
  liquidPass.uniforms.uAspect.value = window.innerHeight / Math.max(window.innerWidth, 1)
  composer.addPass(liquidPass)
  composer.addPass(new OutputPass())
  composer.setSize(window.innerWidth, window.innerHeight)

  if (!reducedMotion && !stillMode) {
    randomizeSpots()

    // Two timers, both cheap: one re-rolls the glitch patches, one
    // nudges how hard the edge smear is pushed.
    spotTimer = window.setInterval(randomizeSpots, 620)

    stretchTimer = window.setInterval(() => {
      if (liquidPass) {
        liquidPass.uniforms.uStretch.value = 0.7 + Math.random() * 1.0
      }
    }, 200)
  }

  window.addEventListener('resize', onResize)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('visibilitychange', onVisibilityChange)

  layoutScene(window.innerWidth, window.innerHeight)

  if (stillMode || reducedMotion) {
    renderStillFrame()
  } else {
    running = true
    lastFrameTime = performance.now()
    tuneBudget = lastFrameTime + 3000
    loop(lastFrameTime)
  }

  if (params.get('perf') === '1') startPerfLog()
}

function startPerfLog() {
  let frames = 0
  let last = performance.now()

  window.setInterval(() => {
    const now = performance.now()
    const fps = (frames * 1000) / (now - last)
    console.log(
      `[perf] fps ${fps.toFixed(1)} · scale ${scale.toFixed(2)} · dpr ${(baseDpr * scale).toFixed(2)}`
    )
    frames = 0
    last = now
  }, 2000)

  const count = () => {
    frames++
    requestAnimationFrame(count)
  }
  requestAnimationFrame(count)
}

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  dispose()
})
</script>
