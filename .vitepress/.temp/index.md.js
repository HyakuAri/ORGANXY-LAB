import { ssrRenderAttrs, ssrRenderVNode, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { ref, onMounted, onBeforeUnmount, mergeProps, useSSRContext, createVNode, resolveDynamicComponent, withCtx, createTextVNode, createBlock, createCommentVNode, toDisplayString, openBlock } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
function createEnvironment(renderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(131846);
  const plane = new THREE.PlaneGeometry(1, 1);
  const meshes = [];
  function addStrip({ width, height, color, intensity, x, y, z }) {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color).multiplyScalar(intensity),
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(plane, material);
    mesh.scale.set(width, height, 1);
    mesh.position.set(x, y, z);
    mesh.lookAt(0, 0, 0);
    scene.add(mesh);
    meshes.push(mesh);
  }
  addStrip({ width: 1.1, height: 11, color: 15267071, intensity: 7.5, x: -4.6, y: 2.4, z: 3.2 });
  addStrip({ width: 0.32, height: 8, color: 9425663, intensity: 5, x: -2.6, y: 1.2, z: 5.4 });
  addStrip({ width: 0.9, height: 7, color: 16734751, intensity: 5.5, x: 4.8, y: 1.6, z: -3.6 });
  addStrip({ width: 6.5, height: 0.9, color: 13624575, intensity: 3.2, x: 0.4, y: 7.5, z: 1.2 });
  addStrip({ width: 7, height: 7, color: 1517112, intensity: 0.5, x: 0, y: -5.5, z: 0 });
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(scene, 0.035);
  pmrem.dispose();
  plane.dispose();
  for (const mesh of meshes) {
    mesh.material.dispose();
  }
  scene.clear();
  return target.texture;
}
const SHARD_MASK_GLSL = (
  /* glsl */
  `
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
);
const _sfc_main$4 = {
  __name: "ShardScene",
  __ssrInlineRender: true,
  setup(__props) {
    const LiquidShader = {
      name: "StageLiquid",
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uStretch: { value: 1 },
        uGrid: { value: 90 }
      },
      vertexShader: (
        /* glsl */
        `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
      ),
      fragmentShader: (
        /* glsl */
        `
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
      )
    };
    const canvasEl = ref(null);
    let disposed = false;
    let renderer = null;
    let scene = null;
    let camera = null;
    let shardRoot = null;
    let glassMaterial = null;
    let chromeMaterial = null;
    let coreMaterial = null;
    let coreLight = null;
    let envTexture = null;
    let composer = null;
    let liquidPass = null;
    let stretchTimer = 0;
    let rafId = 0;
    let running = false;
    let stillMode = false;
    let reducedMotion = false;
    let forcedTime = 2.8;
    let t = 0;
    let ready = false;
    let lastFrameTime = 0;
    const pointer = new THREE.Vector2(0, 0);
    const pointerTarget = new THREE.Vector2(0, 0);
    const cameraBase = new THREE.Vector3(0, 1.5, 9.2);
    const lookBase = new THREE.Vector3(0.55, 1.05, 0);
    function applyShardMask(material, keepAbove) {
      material.onBeforeCompile = (shader) => {
        shader.vertexShader = "varying vec3 vShardPos;\n" + shader.vertexShader.replace(
          "#include <begin_vertex>",
          "#include <begin_vertex>\n	vShardPos = position;"
        );
        shader.fragmentShader = SHARD_MASK_GLSL + shader.fragmentShader.replace(
          "#include <clipping_planes_fragment>",
          "#include <clipping_planes_fragment>\n	float shardM = shardMask(vShardPos);\n	float shardD = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.05;\n" + (keepAbove ? "	if (shardM + shardD < 0.5) discard;\n" : "	if (shardM + shardD >= 0.5) discard;\n")
        );
      };
      material.customProgramCacheKey = () => keepAbove ? "shard-glass" : "shard-chrome";
      material.needsUpdate = true;
    }
    function loadHdri() {
      const loader = new EXRLoader();
      loader.load(
        "/env/studio.exr",
        (texture) => {
          if (disposed) {
            texture.dispose();
            return;
          }
          texture.mapping = THREE.EquirectangularReflectionMapping;
          const pmrem = new THREE.PMREMGenerator(renderer);
          const target = pmrem.fromEquirectangular(texture);
          pmrem.dispose();
          texture.dispose();
          if (envTexture) envTexture.dispose();
          envTexture = target.texture;
          scene.environment = envTexture;
          scene.environmentIntensity = 1.15;
          scene.background = new THREE.Color(329226);
          console.log("[shard] HDRI studio environment loaded");
          renderStillFrame();
        },
        void 0,
        (error) => {
          console.warn("[shard] HDRI failed, falling back to procedural env", error);
          if (disposed) return;
          envTexture = createEnvironment(renderer);
          scene.environment = envTexture;
          scene.environmentIntensity = 1;
          scene.background = new THREE.Color(329226);
          renderStillFrame();
        }
      );
    }
    function addLights() {
      const key = new THREE.DirectionalLight(16773860, 3.2);
      key.position.set(-4.5, 7.5, 5.5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(12572927, 1.4);
      rim.position.set(6, 2.2, -5);
      scene.add(rim);
      const fill = new THREE.DirectionalLight(15265528, 0.5);
      fill.position.set(3, -1.5, 3.5);
      scene.add(fill);
    }
    function buildMaterials() {
      glassMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(16777215),
        metalness: 0,
        roughness: 0.093,
        transmission: 1,
        thickness: 0.9,
        ior: 1.3,
        clearcoat: 0,
        envMapIntensity: 1.5,
        dispersion: 0.35,
        side: THREE.FrontSide
      });
      applyShardMask(glassMaterial, true);
      chromeMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(16777215),
        metalness: 1,
        roughness: 0.015,
        clearcoat: 0.241,
        clearcoatRoughness: 0.162,
        ior: 1.8,
        envMapIntensity: 2.2,
        side: THREE.FrontSide
      });
      applyShardMask(chromeMaterial, false);
      coreMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(9079434),
        metalness: 1,
        roughness: 0.02,
        emissive: new THREE.Color(16738858),
        emissiveIntensity: 200,
        ior: 1.8,
        envMapIntensity: 1
      });
    }
    function loadShard() {
      const loader = new GLTFLoader();
      loader.load(
        "/3d/SHARD.glb",
        (gltf) => {
          if (disposed) return;
          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const scale = 3.55 / maxDim;
          model.scale.multiplyScalar(scale);
          model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
          const shells = [];
          let core = null;
          model.traverse((child) => {
            if (!child.isMesh) return;
            const original = Array.isArray(child.material) ? child.material[0] : child.material;
            const emissive = original && original.emissive ? original.emissive : null;
            const isCore = !!emissive && emissive.r + emissive.g + emissive.b > 0.05;
            if (isCore) {
              child.material = coreMaterial;
              core = child;
            } else {
              shells.push(child);
            }
            child.frustumCulled = false;
          });
          for (const shell of shells) {
            shell.material = chromeMaterial;
            shell.renderOrder = 1;
            const glass = new THREE.Mesh(shell.geometry, glassMaterial);
            glass.position.copy(shell.position);
            glass.quaternion.copy(shell.quaternion);
            glass.scale.copy(shell.scale);
            glass.renderOrder = 2;
            glass.frustumCulled = false;
            shell.parent.add(glass);
          }
          shardRoot = new THREE.Group();
          shardRoot.add(model);
          shardRoot.position.set(2.3, 1.35, 0);
          shardRoot.rotation.set(0.08, 0.62, 0.03);
          scene.add(shardRoot);
          coreLight = new THREE.PointLight(16738858, 300, 12, 2);
          coreLight.position.set(0, 0, 0);
          shardRoot.add(coreLight);
          layoutScene(window.innerWidth);
          console.log(
            "[shard] loaded",
            "size",
            size.toArray().map((v) => v.toFixed(2)).join(" "),
            "scale",
            scale.toFixed(3),
            "shells",
            shells.length,
            "core",
            !!core
          );
          if (!stillMode && !reducedMotion) {
            markReady();
          }
          renderStillFrame();
        },
        void 0,
        (error) => {
          console.warn("[shard] failed to load /3d/SHARD.glb", error);
          markReady();
          renderStillFrame();
        }
      );
    }
    function layoutScene(w, h) {
      const mobile = w < 820;
      if (mobile) {
        cameraBase.set(0, 2.25, 10.6);
        lookBase.set(0, 1.95, 0);
        if (shardRoot) shardRoot.position.set(0, 2.5, 0);
      } else {
        cameraBase.set(0, 1.5, 9.2);
        lookBase.set(0.55, 1.05, 0);
        if (shardRoot) shardRoot.position.set(2.3, 1.35, 0);
      }
      camera.position.copy(cameraBase);
      camera.lookAt(lookBase);
    }
    function updateScene(dt) {
      const smooth = 1 - Math.pow(8e-4, Math.max(dt, 0.016));
      pointer.lerp(pointerTarget, smooth);
      const px = pointer.x;
      const py = pointer.y;
      if (shardRoot) {
        shardRoot.rotation.y = 0.62 + t * 0.11 + px * 0.26;
        shardRoot.rotation.x = 0.07 + py * 0.13 + Math.sin(t * 0.21) * 0.025;
        shardRoot.rotation.z = 0.03 + Math.sin(t * 0.17) * 0.02;
      }
      if (coreMaterial) {
        coreMaterial.emissiveIntensity = 200 + Math.sin(t * 1.05) * 40;
      }
      if (coreLight) {
        coreLight.intensity = 280 + Math.sin(t * 1.05) * 60;
      }
      camera.position.set(
        cameraBase.x + px * 0.34,
        cameraBase.y + py * 0.2,
        cameraBase.z
      );
      camera.lookAt(lookBase.x + px * 0.06, lookBase.y + py * 0.04, lookBase.z);
    }
    function renderFrame() {
      if (!composer) return;
      if (liquidPass) liquidPass.uniforms.uTime.value = t;
      composer.render();
    }
    function renderStillFrame() {
      if (!(stillMode || reducedMotion) || !renderer) return;
      t = forcedTime;
      updateScene(0);
      renderFrame();
      markReady();
    }
    function loop() {
      if (!running) return;
      rafId = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min((now - lastFrameTime) / 1e3, 0.05);
      lastFrameTime = now;
      t += dt;
      updateScene(dt);
      renderFrame();
    }
    function markReady() {
      if (ready || !canvasEl.value) return;
      ready = true;
      canvasEl.value.classList.add("is-ready");
    }
    function onResize() {
      if (disposed) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      if (composer) composer.setSize(w, h);
      if (liquidPass) {
        const pixelRatio = renderer.getPixelRatio();
        liquidPass.uniforms.uResolution.value.set(w * pixelRatio, h * pixelRatio);
      }
      layoutScene(w);
      if (stillMode || reducedMotion) {
        updateScene(0);
        renderFrame();
      }
    }
    function onPointerMove(event) {
      pointerTarget.set(
        event.clientX / window.innerWidth * 2 - 1,
        -(event.clientY / window.innerHeight * 2 - 1)
      );
    }
    function onVisibilityChange() {
      if (stillMode || reducedMotion) return;
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!running) {
        running = true;
        lastFrameTime = performance.now();
        loop();
      }
    }
    function dispose() {
      disposed = true;
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.clearInterval(stretchTimer);
      if (scene) {
        const geometries = /* @__PURE__ */ new Set();
        const materials = /* @__PURE__ */ new Set();
        const textures = /* @__PURE__ */ new Set();
        scene.traverse((child) => {
          if (child.geometry) geometries.add(child.geometry);
          if (child.material) {
            const list = Array.isArray(child.material) ? child.material : [child.material];
            for (const material of list) {
              materials.add(material);
              for (const key of Object.keys(material)) {
                const value = material[key];
                if (value && value.isTexture) textures.add(value);
              }
            }
          }
        });
        for (const geometry of geometries) geometry.dispose();
        for (const material of materials) material.dispose();
        for (const texture of textures) texture.dispose();
      }
      if (envTexture) envTexture.dispose();
      if (composer) composer.dispose();
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
    }
    function init() {
      const params = new URLSearchParams(window.location.search);
      if (params.get("gl") === "off") return;
      stillMode = params.get("still") === "1";
      reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      forcedTime = Number(params.get("t") || (stillMode ? 2.8 : 2.2));
      try {
        renderer = new THREE.WebGLRenderer({
          canvas: canvasEl.value,
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true
        });
      } catch (error) {
        console.warn("[shard] WebGL is not available", error);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.setClearColor(329226, 1);
      scene = new THREE.Scene();
      scene.background = new THREE.Color(329226);
      camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.1, 180);
      camera.position.copy(cameraBase);
      camera.lookAt(lookBase);
      loadHdri();
      addLights();
      buildMaterials();
      loadShard();
      const size = renderer.getDrawingBufferSize(new THREE.Vector2());
      const renderTarget = new THREE.WebGLRenderTarget(size.x, size.y, {
        type: THREE.HalfFloatType,
        samples: 4
      });
      composer = new EffectComposer(renderer, renderTarget);
      composer.addPass(new RenderPass(scene, camera));
      liquidPass = new ShaderPass(LiquidShader);
      liquidPass.uniforms.uResolution.value.copy(size);
      composer.addPass(liquidPass);
      composer.addPass(new OutputPass());
      composer.setSize(window.innerWidth, window.innerHeight);
      if (!reducedMotion && !stillMode) {
        stretchTimer = window.setInterval(() => {
          if (liquidPass) {
            liquidPass.uniforms.uStretch.value = 0.7 + Math.random() * 1;
            liquidPass.uniforms.uGrid.value = 70 + Math.random() * 80;
          }
        }, 200);
      }
      window.addEventListener("resize", onResize);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("visibilitychange", onVisibilityChange);
      layoutScene(window.innerWidth);
      if (stillMode || reducedMotion) {
        renderStillFrame();
      } else {
        running = true;
        lastFrameTime = performance.now();
        loop();
      }
    }
    onMounted(() => {
      init();
    });
    onBeforeUnmount(() => {
      dispose();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<canvas${ssrRenderAttrs(mergeProps({
        ref_key: "canvasEl",
        ref: canvasEl,
        class: "shard-canvas",
        "aria-hidden": "true"
      }, _attrs))}></canvas>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/ShardScene.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
  __name: "StageContent",
  __ssrInlineRender: true,
  props: {
    decorative: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const index = [
      {
        title: "有机反应表",
        desc: "收录了目前简单的绝大部分有机反应喵。",
        href: "/notes/"
      },
      {
        title: "工具箱",
        desc: "有用吗？我不知道喵。",
        href: "/tools/"
      },
      {
        title: "音乐推荐",
        desc: "",
        href: "/music/"
      },
      {
        title: "某个bot的文档",
        desc: "感觉随时会挂",
        href: "/bots/"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "stage-inner" }, _attrs))}><header class="stage-hero"><div class="stage-hero-text"><p class="stage-eyebrow">ORGANXY LAB</p>`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.decorative ? "span" : "h1"), { class: "stage-title" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`OrganxyLab`);
          } else {
            return [
              createTextVNode("OrganxyLab")
            ];
          }
        }),
        _: 1
      }), _parent);
      _push(`<p class="stage-sub">说点什么呗喵</p><p class="stage-tag">Navigate Thy Veritas.</p></div><div class="stage-actions">`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.decorative ? "span" : "a"), {
        class: "stage-primary",
        href: __props.decorative ? void 0 : "/notes/"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` 进入笔记库 `);
          } else {
            return [
              createTextVNode(" 进入笔记库 ")
            ];
          }
        }),
        _: 1
      }), _parent);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.decorative ? "span" : "a"), {
        class: "stage-secondary",
        href: __props.decorative ? void 0 : "/about/"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` 你在点什么呢喵？ `);
          } else {
            return [
              createTextVNode(" 你在点什么呢喵？ ")
            ];
          }
        }),
        _: 1
      }), _parent);
      _push(`</div></header><nav class="stage-index"${ssrRenderAttr("aria-label", __props.decorative ? void 0 : "站点索引")}><!--[-->`);
      ssrRenderList(index, (item) => {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.decorative ? "span" : "a"), {
          key: item.href,
          class: "stage-index-item",
          href: __props.decorative ? void 0 : item.href
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="stage-index-title"${_scopeId}>${ssrInterpolate(item.title)}</span>`);
              if (item.desc) {
                _push2(`<span class="stage-index-desc"${_scopeId}>${ssrInterpolate(item.desc)}</span>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode("span", { class: "stage-index-title" }, toDisplayString(item.title), 1),
                item.desc ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "stage-index-desc"
                }, toDisplayString(item.desc), 1)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }), _parent);
      });
      _push(`<!--]--></nav><footer class="stage-meta"><span>© 2026 OrganxyLab. All rights reserved.</span><span>基于 MIT 许可发布。</span><span class="stage-legal">`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.decorative ? "span" : "a"), {
        href: __props.decorative ? void 0 : "/user_agreement"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` 用户协议 `);
          } else {
            return [
              createTextVNode(" 用户协议 ")
            ];
          }
        }),
        _: 1
      }), _parent);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.decorative ? "span" : "a"), {
        href: __props.decorative ? void 0 : "/privacy_policy"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` 隐私政策 `);
          } else {
            return [
              createTextVNode(" 隐私政策 ")
            ];
          }
        }),
        _: 1
      }), _parent);
      _push(`</span></footer></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/StageContent.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const SPOT_MS = 1e3 / 24;
const SNAP_MS = 110;
const _sfc_main$2 = {
  __name: "PageCompositor",
  __ssrInlineRender: true,
  setup(__props) {
    const canvasEl = ref(null);
    let ctx = null;
    let snapCanvas = null;
    let lowCanvas = null;
    let spotCanvas = null;
    let stageEl = null;
    let rafId = 0;
    let disposed = false;
    let snapReady = false;
    let lastSnap = 0;
    let lastSpot = 0;
    let capturing = false;
    let html2canvas = null;
    function resize() {
      const c = canvasEl.value;
      if (!c) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
      }
      if (!ctx) ctx = c.getContext("2d");
      if (!snapCanvas) {
        snapCanvas = document.createElement("canvas");
        lowCanvas = document.createElement("canvas");
        spotCanvas = document.createElement("canvas");
      }
      if (snapCanvas.width !== w || snapCanvas.height !== h) {
        snapCanvas.width = w;
        snapCanvas.height = h;
        lowCanvas.width = w;
        lowCanvas.height = h;
        spotCanvas.width = w;
        spotCanvas.height = h;
      }
    }
    function drawSpots() {
      if (!spotCanvas) return;
      const sctx = spotCanvas.getContext("2d");
      const w = spotCanvas.width;
      const h = spotCanvas.height;
      sctx.clearRect(0, 0, w, h);
      const cell = 18 + Math.random() * 34;
      for (let y = 0; y < h; y += cell) {
        for (let x = 0; x < w; x += cell) {
          const t = x / w;
          const chance = 0.92 + (0.2 - 0.92) * t;
          if (Math.random() > chance) continue;
          const bw = cell * (0.5 + Math.random() * 0.5);
          const bh = cell * (0.5 + Math.random() * 0.5);
          sctx.fillRect(x, y, bw, bh);
        }
      }
    }
    function paint() {
      if (!ctx || !snapCanvas || !spotCanvas) return;
      if (!snapReady) {
        ctx.clearRect(0, 0, canvasEl.value.width, canvasEl.value.height);
        return;
      }
      const w = canvasEl.value.width;
      const h = canvasEl.value.height;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = false;
      const lowW = Math.max(2, Math.floor(w / 13));
      const lowH = Math.max(2, Math.floor(h / 13));
      if (lowCanvas.width !== lowW || lowCanvas.height !== lowH) {
        lowCanvas.width = lowW;
        lowCanvas.height = lowH;
      }
      const lctx = lowCanvas.getContext("2d");
      lctx.imageSmoothingEnabled = true;
      lctx.clearRect(0, 0, lowW, lowH);
      lctx.drawImage(snapCanvas, 0, 0, lowW, lowH);
      ctx.drawImage(lowCanvas, 0, 0, w, h);
      const copies = 6;
      for (let i = 1; i <= copies; i++) {
        const dy = i * i * 1.6;
        ctx.globalAlpha = 0.5 / i;
        ctx.drawImage(lowCanvas, 0, 0, w, h, 0, dy, w, h);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(spotCanvas, 0, 0);
      ctx.globalCompositeOperation = "source-over";
    }
    async function capture() {
      if (disposed || capturing || !stageEl) return;
      capturing = true;
      try {
        if (!html2canvas) {
          const mod = await import("html2canvas");
          html2canvas = mod.default;
        }
        const shot = await html2canvas(stageEl, {
          backgroundColor: null,
          scale: 1,
          logging: false,
          useCORS: true,
          allowTaint: true,
          ignoreElements: (element) => {
            var _a, _b;
            return ((_a = element.classList) == null ? void 0 : _a.contains("page-compositor")) || ((_b = element.classList) == null ? void 0 : _b.contains("stage-filters"));
          }
        });
        const sctx = snapCanvas.getContext("2d");
        sctx.clearRect(0, 0, snapCanvas.width, snapCanvas.height);
        sctx.drawImage(shot, 0, 0, snapCanvas.width, snapCanvas.height);
        snapReady = true;
      } catch (error) {
        console.warn("[compositor] snapshot failed", error);
      } finally {
        capturing = false;
      }
    }
    function loop(now) {
      if (disposed) return;
      rafId = requestAnimationFrame(loop);
      if (now - lastSnap > SNAP_MS) {
        lastSnap = now;
        capture();
      }
      if (now - lastSpot > SPOT_MS) {
        lastSpot = now;
        drawSpots();
      }
      paint();
    }
    onMounted(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      stageEl = document.querySelector(".stage");
      if (!stageEl) return;
      resize();
      window.addEventListener("resize", resize);
      drawSpots();
      rafId = requestAnimationFrame(loop);
    });
    onBeforeUnmount(() => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<canvas${ssrRenderAttrs(mergeProps({
        ref_key: "canvasEl",
        ref: canvasEl,
        class: "page-compositor",
        "aria-hidden": "true"
      }, _attrs))}></canvas>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/PageCompositor.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "HomeStage",
  __ssrInlineRender: true,
  setup(__props) {
    const filterSvg = ref(null);
    let timer = 0;
    onMounted(() => {
      const svg = filterSvg.value;
      if (!svg) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        svg.pauseAnimations();
        return;
      }
      const red = svg.querySelector("#ca-red");
      const blue = svg.querySelector("#ca-blue");
      const tick = () => {
        const dx = 1.2 + Math.random() * 0.9;
        if (red) red.setAttribute("dx", dx.toFixed(2));
        if (blue) blue.setAttribute("dx", (-dx).toFixed(2));
        timer = window.setTimeout(tick, 1e3 / 24);
      };
      tick();
    });
    onBeforeUnmount(() => {
      window.clearTimeout(timer);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "stage" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$4, null, null, _parent));
      _push(`<div class="stage-scrim" aria-hidden="true"></div><svg class="stage-filters" aria-hidden="true" width="0" height="0"><defs><filter id="lq-liquid" x="-45%" y="-60%" width="190%" height="220%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.0042 0.0095" numOctaves="2" seed="23" result="noise"><animate attributeName="baseFrequency" dur="19s" values="0.0038 0.008; 0.0056 0.012; 0.0031 0.0068; 0.0038 0.008" repeatCount="indefinite"></animate></feTurbulence><feDisplacementMap in="SourceGraphic" in2="noise" scale="38" xChannelSelector="R" yChannelSelector="G" result="warp"></feDisplacementMap><feGaussianBlur in="warp" stdDeviation="0.5"></feGaussianBlur></filter><filter id="page-fx" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB"><feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"></feColorMatrix><feOffset id="ca-red" in="red" dx="1.5" dy="0" result="redShift"></feOffset><feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"></feColorMatrix><feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"></feColorMatrix><feOffset id="ca-blue" in="blue" dx="-1.5" dy="0" result="blueShift"></feOffset><feBlend in="redShift" in2="green" mode="screen" result="rg"></feBlend><feBlend in="rg" in2="blueShift" mode="screen"></feBlend></filter><clipPath id="stage-holes" clipPathUnits="objectBoundingBox" clip-rule="evenodd"><path d="M0 0 H1 V1 H0 Z" clip-rule="evenodd"></path><ellipse cx="0.10" cy="0.82" rx="0.13" ry="0.12" clip-rule="evenodd"></ellipse><ellipse cx="0.78" cy="0.50" rx="0.11" ry="0.16" clip-rule="evenodd"></ellipse></clipPath></defs></svg><div class="stage-base">`);
      _push(ssrRenderComponent(_sfc_main$3, null, null, _parent));
      _push(`</div><div class="stage-liquid" aria-hidden="true">`);
      _push(ssrRenderComponent(_sfc_main$3, { decorative: "" }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/HomeStage.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{"layout":"page","pageClass":"home-stage","footer":false,"sidebar":false,"aside":false},"headers":[],"relativePath":"index.md","filePath":"index.md","lastUpdated":1785341330000}');
const __default__ = { name: "index.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
