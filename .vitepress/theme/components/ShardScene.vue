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

/* ------------------------------------------------------------
   Screen-space liquefaction patches.
   These two regions match the CSS mask on the decorative copy:
   bottom-left and right-middle. The star and the background
   are warped here; the DOM copy is warped by the SVG filter.
   ------------------------------------------------------------ */

const LiquidShader = {
  name: 'StageLiquid',
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uStretch: { value: 1 },
    uGrid: { value: 90 }
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uStretch;
    uniform float uGrid;
    varying vec2 vUv;

    float liquidHash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float liquidNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = liquidHash(i);
      float b = liquidHash(i + vec2(1.0, 0.0));
      float c = liquidHash(i + vec2(0.0, 1.0));
      float d = liquidHash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    float liquidFbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * liquidNoise(p);
        p = p * 2.03 + vec2(17.1, 9.2);
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 p = vUv;

      vec2 d1 = (p - vec2(0.10, 0.18)) / vec2(0.13, 0.12);
      vec2 d2 = (p - vec2(0.78, 0.50)) / vec2(0.11, 0.16);
      float m1 = 1.0 - smoothstep(0.55, 1.35, length(d1));
      float m2 = 1.0 - smoothstep(0.55, 1.35, length(d2));
      float m = clamp(m1 + m2, 0.0, 1.0);

      float n1 = liquidFbm(p * 6.0 + vec2(uTime * 0.035, -uTime * 0.02));
      float n2 = liquidFbm(p * 6.0 + vec2(11.0, 4.0) - vec2(uTime * 0.028, uTime * 0.018));
      vec2 uv = p + (vec2(n1, n2) - 0.5) * 0.055 * m;

      float ca = 0.0018 * m;
      vec3 col;
      col.r = texture2D(tDiffuse, uv + vec2(ca, 0.0)).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - vec2(ca, 0.0)).b;

      // Whole-page edge smear: find the nearest edge above, drag its
      // colour downward in one-pixel columns and fade it out.
      vec2 px = vec2(1.0) / uResolution;
      vec3 smear = vec3(0.0);
      float smearWeight = 0.0;

      for (int i = 1; i <= 40; i++) {
        vec2 suv = p + vec2(0.0, float(i) * px.y * 1.6);

        float l = dot(texture2D(tDiffuse, suv - vec2(px.x, 0.0)).rgb, vec3(0.2126, 0.7152, 0.0722));
        float r = dot(texture2D(tDiffuse, suv + vec2(px.x, 0.0)).rgb, vec3(0.2126, 0.7152, 0.0722));
        float u = dot(texture2D(tDiffuse, suv + vec2(0.0, px.y)).rgb, vec3(0.2126, 0.7152, 0.0722));
        float d = dot(texture2D(tDiffuse, suv - vec2(0.0, px.y)).rgb, vec3(0.2126, 0.7152, 0.0722));
        float e = length(vec2(r - l, u - d));

        if (e > 0.07) {
          vec3 c;
          c.r = texture2D(tDiffuse, suv + vec2(0.0015, 0.0)).r;
          c.g = texture2D(tDiffuse, suv).g;
          c.b = texture2D(tDiffuse, suv - vec2(0.0015, 0.0)).b;

          float w = 1.0 - float(i) / 41.0;
          smear += c * w;
          smearWeight += w;
        }
      }

      if (smearWeight > 0.0) {
        vec3 sc = smear / smearWeight;
        float alpha = clamp(smearWeight * 0.055, 0.0, 0.6) * uStretch;
        col = mix(col, sc, alpha);
      }

      // Pixelation is handled by the full-page compositor.

      // Blender compositor: sun beams, mist, vignette, aberration.
      vec2 sunPos = vec2(0.5, 0.53);
      vec2 sunStep = (p - sunPos) * 0.085;
      vec3 beam = vec3(0.0);
      float beamWeight = 0.0;

      for (int i = 0; i < 20; i++) {
        vec3 c = texture2D(tDiffuse, p - sunStep * float(i)).rgb;
        float b = max(max(c.r, c.g), c.b);
        float w = smoothstep(2.0, 5.0, b) * (1.0 - float(i) / 21.0);
        beam += c * w;
        beamWeight += w;
      }

      if (beamWeight > 0.0) {
        beam /= beamWeight;
        col += beam * vec3(1.0, 0.72, 0.46) * 0.18;
      }

      vec3 mist = vec3(0.0);
      for (int i = 0; i < 12; i++) {
        float a = float(i) * 0.5236;
        vec2 off = vec2(cos(a), sin(a)) * 0.012;
        vec3 c = texture2D(tDiffuse, p + off).rgb;
        mist += c * smoothstep(0.8, 2.5, max(max(c.r, c.g), c.b));
      }
      col += mist * 0.035;

      float vignette = 1.0 - 0.667 * pow(clamp(length((p - 0.5) * 1.35), 0.0, 1.0), 2.0 + 0.525 * 2.0);
      col *= vignette;

      float caShift = 0.117 * 0.012;
      vec3 caCol;
      caCol.r = texture2D(tDiffuse, p + vec2(caShift, 0.0)).r;
      caCol.g = texture2D(tDiffuse, p).g;
      caCol.b = texture2D(tDiffuse, p - vec2(caShift, 0.0)).b;
      col = mix(col, caCol, 0.55);

      gl_FragColor = vec4(col, 1.0);
    }
  `
}

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
let rafId = 0
let running = false
let stillMode = false
let reducedMotion = false
let forcedTime = 2.8
let t = 0
let ready = false
let lastFrameTime = 0

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
  glassMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xffffff),
    metalness: 0.0,
    roughness: 0.093,
    transmission: 1.0,
    thickness: 0.9,
    ior: 1.3,
    clearcoat: 0.0,
    envMapIntensity: 1.5,
    dispersion: 0.35,
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
      const scale = 3.55 / maxDim

      model.scale.multiplyScalar(scale)
      model.position.set(-center.x * scale, -center.y * scale, -center.z * scale)

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
        'scale', scale.toFixed(3),
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

function loop() {
  if (!running) return
  rafId = requestAnimationFrame(loop)

  const now = performance.now()
  const dt = Math.min((now - lastFrameTime) / 1000, 0.05)
  lastFrameTime = now
  t += dt

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
  if (composer) composer.setSize(w, h)
  if (liquidPass) {
    const pixelRatio = renderer.getPixelRatio()
    liquidPass.uniforms.uResolution.value.set(w * pixelRatio, h * pixelRatio)
  }
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
    loop()
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

  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvasEl.value,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    })
  } catch (error) {
    console.warn('[shard] WebGL is not available', error)
    return
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
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
    type: THREE.HalfFloatType,
    samples: 4
  })

  composer = new EffectComposer(renderer, renderTarget)
  composer.addPass(new RenderPass(scene, camera))

  liquidPass = new ShaderPass(LiquidShader)
  liquidPass.uniforms.uResolution.value.copy(size)
  composer.addPass(liquidPass)
  composer.addPass(new OutputPass())
  composer.setSize(window.innerWidth, window.innerHeight)

  if (!reducedMotion && !stillMode) {
    stretchTimer = window.setInterval(() => {
      if (liquidPass) {
        liquidPass.uniforms.uStretch.value = 0.7 + Math.random() * 1.0
        liquidPass.uniforms.uGrid.value = 70 + Math.random() * 80
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
    loop()
  }
}

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  dispose()
})
</script>
