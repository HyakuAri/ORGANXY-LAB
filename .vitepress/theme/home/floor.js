import * as THREE from 'three'
import { Reflector } from 'three/addons/objects/Reflector.js'

/* ============================================================
   Liquid metal floor.
   A real planar reflection (Reflector) is distorted by a moving
   ripple field and tinted with dispersion. The orange core of
   the shard bleeds into the surface.
   ============================================================ */

const LiquidFloorShader = {
  name: 'LiquidFloorShader',

  uniforms: {
    color: { value: null },
    tDiffuse: { value: null },
    textureMatrix: { value: null },
    uTime: { value: 0 },
    uCameraPos: { value: new THREE.Vector3() },
    uCore: { value: new THREE.Vector3() },
    uCoreColor: { value: new THREE.Color(0xff5a1f) },
    uDeep: { value: new THREE.Color(0x04060a) }
  },

  vertexShader: /* glsl */ `
    uniform mat4 textureMatrix;
    varying vec4 vUv;
    varying vec3 vWorld;

    void main() {
      vec4 world = modelMatrix * vec4(position, 1.0);
      vWorld = world.xyz;
      vUv = textureMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * viewMatrix * world;
    }
  `,

  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec3 color;
    uniform float uTime;
    uniform vec3 uCameraPos;
    uniform vec3 uCore;
    uniform vec3 uCoreColor;
    uniform vec3 uDeep;

    varying vec4 vUv;
    varying vec3 vWorld;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = p * 2.03 + vec2(11.7, 4.3);
        a *= 0.5;
      }
      return v;
    }

    void main() {
      float t = uTime;
      vec2 p = vWorld.xz;

      // Large slow warp, then a finer ripple.
      vec2 q = p * 0.22;
      float w1 = fbm(q + vec2(t * 0.028, -t * 0.019));
      float w2 = fbm(q * 1.7 - vec2(t * 0.022, t * 0.015) + 13.1);
      vec2 warp = vec2(w1, w2) - 0.5;

      float h = fbm(p * 0.38 + warp * 1.9 + vec2(t * 0.04, -t * 0.031));
      float e = 0.16;
      float hx = fbm((p + vec2(e, 0.0)) * 0.38 + warp * 1.9 + vec2(t * 0.04, -t * 0.031));
      float hz = fbm((p + vec2(0.0, e)) * 0.38 + warp * 1.9 + vec2(t * 0.04, -t * 0.031));

      vec3 n = normalize(vec3(
        -(hx - h) / e * 1.35,
        1.0,
        -(hz - h) / e * 1.35
      ));

      vec3 V = normalize(uCameraPos - vWorld);
      float fres = pow(1.0 - clamp(dot(n, V), 0.0, 1.0), 4.2);

      vec2 uv = vUv.xy / max(vUv.w, 0.0001);
      uv += n.xz * 0.052;

      float ca = 0.0012 + 0.0038 * fres;
      vec3 refl;
      refl.r = texture2D(tDiffuse, uv + vec2(ca, 0.0)).r;
      refl.g = texture2D(tDiffuse, uv).g;
      refl.b = texture2D(tDiffuse, uv - vec2(ca, 0.0)).b;

      // Liquid smear along the reflection.
      refl += texture2D(tDiffuse, uv + vec2(0.0, 0.022)).rgb * 0.34;
      refl += texture2D(tDiffuse, uv - vec2(0.0, 0.014)).rgb * 0.2;
      refl /= 1.54;

      vec3 col = uDeep + refl * (0.62 + 0.62 * fres) * color;
      col += refl * refl * 0.08;

      float glow = exp(-length(p - uCore.xz) * 0.5);
      col += uCoreColor * glow * (0.38 + 0.18 * fres);

      // Point-light looking caustic near the core.
      float caustic = pow(max(0.0, 1.0 - abs(h - 0.5) * 3.2), 6.0) * glow;
      col += vec3(1.0, 0.55, 0.25) * caustic * 0.5;

      float d = length(p);
      col *= smoothstep(48.0, 8.0, d);

      gl_FragColor = vec4(col, 1.0);
    }
  `
}

export function createFloor({ y = -1.15, size = 280, textureSize = 1024 } = {}) {
  const geometry = new THREE.PlaneGeometry(size, size)
  const floor = new Reflector(geometry, {
    shader: LiquidFloorShader,
    textureWidth: textureSize,
    textureHeight: textureSize,
    clipBias: 0.003,
    multisample: 4,
    color: 0x9aa8b6
  })

  floor.rotation.x = -Math.PI / 2
  floor.position.y = y

  return floor
}
