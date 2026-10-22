import * as THREE from 'three'

/* ============================================================
   Screen edge pass.
   The edges of the frame are eaten by a liquid metal surface,
   stretched pixel light and thin glass shards. The centre stays
   clean because the DOM text lives above the canvas.
   ============================================================ */

export const EdgeShader = {
  name: 'EdgeShader',

  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) }
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
    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec2 uPointer;
    varying vec2 vUv;

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
        p = p * 2.03 + vec2(17.1, 9.2);
        a *= 0.5;
      }
      return v;
    }

    mat2 rot(float a) {
      float c = cos(a);
      float s = sin(a);
      return mat2(c, -s, s, c);
    }

    vec3 studio(vec3 r) {
      float az = atan(r.z, r.x);
      float el = r.y;

      vec3 c = mix(
        vec3(0.002, 0.003, 0.006),
        vec3(0.02, 0.034, 0.058),
        smoothstep(-0.6, 0.95, el)
      );

      float sA = smoothstep(0.15, 0.0, abs(az + 0.9)) * smoothstep(-0.4, 0.25, el);
      float sB = smoothstep(0.085, 0.0, abs(az - 0.35)) * smoothstep(0.05, 0.5, el);
      float sC = smoothstep(0.22, 0.0, abs(az - 1.95)) * smoothstep(-0.45, 0.1, el);

      c += vec3(1.0, 0.975, 0.94) * sA * 8.5;
      c += vec3(0.48, 0.74, 1.0) * sB * 3.4;
      c += vec3(1.0, 0.30, 0.08) * sC * 4.6;
      c += vec3(0.025, 0.045, 0.075) * smoothstep(0.15, -0.75, el);

      return c;
    }

    vec3 sampleScene(vec2 uv, float ca) {
      vec3 c;
      c.r = texture2D(tDiffuse, uv + vec2(ca, 0.0)).r;
      c.g = texture2D(tDiffuse, uv).g;
      c.b = texture2D(tDiffuse, uv - vec2(ca, 0.0)).b;
      return c;
    }

    void main() {
      vec2 uv = vUv;
      float aspect = uResolution.x / max(uResolution.y, 1.0);
      vec2 sp = vec2(uv.x * aspect, uv.y);
      float t = uTime;

      // Distance to the nearest frame edge, plus a warped boundary.
      float edge = min(min(sp.x, aspect - sp.x), min(sp.y, 1.0 - sp.y));

      float n1 = fbm(sp * vec2(3.6, 3.9) + vec2(t * 0.021, -t * 0.017));
      float n2 = fbm(sp * vec2(9.0, 11.0) - vec2(t * 0.03, t * 0.024) + 31.7);
      float grain = fbm(sp * vec2(38.0, 44.0) + t * 0.05);

      // Heavier on the right and bottom, lighter on the left.
      float sideBias =
        0.032 * smoothstep(0.0, 1.0, uv.x) +
        0.026 * smoothstep(0.45, 1.0, uv.y) +
        0.012 * smoothstep(1.0, 0.6, uv.y);

      float band = 0.052 + sideBias + 0.055 * n1 + 0.022 * n2;

      // Drips that run down from the top boundary and pull the metal inward.
      float dripField = fbm(vec2(sp.x * 21.0, sp.y * 2.6 + t * 0.12));
      float drip = smoothstep(0.62, 0.92, dripField) * smoothstep(0.22, 0.05, edge);

      float m = 1.0 - smoothstep(band * 0.35, band, edge);
      m = clamp(m + drip * 0.55, 0.0, 1.0);

      // Pointer pushes a soft bulge into the boundary.
      vec2 pointer = uPointer * 0.5 + 0.5;
      vec2 pv = (uv - pointer) * vec2(aspect, 1.0);
      float pd = length(pv);
      m = clamp(m + smoothstep(0.35, 0.0, pd) * 0.12 * smoothstep(0.05, 0.4, edge) * 0.0, 0.0, 1.0);

      // ---------- base frame with a little chromatic breathing ----------
      float caEdge = 0.0008 * smoothstep(0.28, 0.0, edge);
      vec3 scene = sampleScene(uv, caEdge);

      // ---------- pixel stretch ----------
      float column = floor(uv.x * 150.0);
      float columnHash = hash(vec2(column, 7.13));
      vec2 st = uv;
      st.y += (columnHash - 0.5) * 0.30 * m;
      st += (vec2(noise(st * 37.0 + t * 0.4), noise(st * 31.0 - t * 0.35)) - 0.5) * 0.012 * m;

      vec2 grid = vec2(210.0, 118.0);
      vec2 blockUv = (floor(st * grid) + 0.5) / grid;

      float smearLen = 0.018 + 0.028 * hash(vec2(column, 2.3));
      vec3 stretch = vec3(0.0);
      stretch += sampleScene(blockUv, 0.0);
      stretch += sampleScene(blockUv + vec2(0.0, smearLen), 0.0);
      stretch += sampleScene(blockUv + vec2(0.0, smearLen * 2.0), 0.0);
      stretch += sampleScene(blockUv - vec2(0.0, smearLen * 0.7), 0.0);
      stretch *= 0.25;

      float caStretch = (0.002 + 0.006 * n2) * m;
      stretch.r = mix(stretch.r, texture2D(tDiffuse, blockUv + vec2(caStretch, 0.0)).r, 0.85);
      stretch.b = mix(stretch.b, texture2D(tDiffuse, blockUv - vec2(caStretch, 0.0)).b, 0.85);

      vec3 col = mix(scene, stretch, smoothstep(0.0, 0.75, m));

      // ---------- liquid metal ----------
      vec2 mp = sp * vec2(2.35, 2.1) + vec2(0.0, t * 0.035);
      float mw = fbm(mp + fbm(mp * 2.7 - t * 0.024) * 0.9);
      float me = 0.011;
      float mhx = fbm(mp + vec2(me, 0.0) + fbm((mp + vec2(me, 0.0)) * 2.7 - t * 0.024) * 0.9);
      float mhz = fbm(mp + vec2(0.0, me) + fbm((mp + vec2(0.0, me)) * 2.7 - t * 0.024) * 0.9);
      vec3 nMetal = normalize(vec3(
        -(mhx - mw) / me * 0.55,
        1.0,
        -(mhz - mw) / me * 0.55
      ));

      vec3 viewDir = normalize(vec3((uv - 0.5) * vec2(1.7, 1.2), 1.0));
      vec3 reflDir = reflect(-viewDir, nMetal);
      float fres = pow(1.0 - clamp(dot(nMetal, viewDir), 0.0, 1.0), 3.5);

      vec3 metal = studio(reflDir) * (0.42 + 1.15 * fres);
      metal += vec3(0.012, 0.015, 0.02);
      metal += vec3(0.35, 0.56, 0.85) * pow(fres, 1.4) * 0.35;

      vec3 keyDir = normalize(vec3(-0.55, 0.75, 0.6));
      float spec = pow(max(dot(reflect(-keyDir, nMetal), viewDir), 0.0), 140.0);
      metal += vec3(1.0, 0.98, 0.95) * spec * 4.5;

      float mMetal = smoothstep(0.06, 0.42, m + drip * 0.4);
      mMetal = clamp(mMetal + smoothstep(0.75, 1.0, n2) * 0.15, 0.0, 1.0);

      col = mix(col, metal, mMetal);

      // ---------- glass shards ----------
      vec2 gq = rot(0.34) * (sp - vec2(0.045, 0.54));
      float gw = 0.028 + 0.016 * sin(gq.y * 6.2 + t * 0.35) + 0.02 * fbm(sp * 7.0 + 3.0);
      float glassMask = smoothstep(gw, gw * 0.35, abs(gq.x));
      glassMask *= smoothstep(0.0, 0.08, edge) * smoothstep(0.9, 0.35, edge) * smoothstep(0.2, 0.0, gq.x);

      vec2 gr = rot(0.34) * vec2(0.0, 1.0);
      vec2 refractUv = uv + gr * 0.022 + vec2(gq.x * 0.14, 0.0);
      vec3 glass = sampleScene(refractUv, 0.0045 + 0.003 * fbm(sp * 12.0));
      glass = mix(glass, vec3(0.55, 0.78, 1.0) * 0.06, 0.35);
      float glassRim = smoothstep(gw * 0.92, gw * 0.55, abs(gq.x));
      glass += vec3(0.55, 0.8, 1.0) * glassRim * 0.5;

      col = mix(col, glass, glassMask * 0.92);

      // A second, thinner shard on the right side.
      vec2 gq2 = rot(-0.28) * (sp - vec2(aspect - 0.03, 0.44));
      float gw2 = 0.018 + 0.012 * sin(gq2.y * 8.0 - t * 0.28) + 0.014 * fbm(sp * 9.0 - 5.0);
      float glassMask2 = smoothstep(gw2, gw2 * 0.3, abs(gq2.x));
      glassMask2 *= smoothstep(0.0, 0.06, edge) * smoothstep(0.85, 0.3, edge);
      vec3 glass2 = sampleScene(uv + vec2(-gq2.x * 0.12, 0.0), 0.006);
      glass2 += vec3(0.9, 0.55, 0.4) * smoothstep(gw2 * 0.9, gw2 * 0.5, abs(gq2.x)) * 0.35;
      col = mix(col, glass2, glassMask2 * 0.8);

      // ---------- finishing ----------
      float vignette = 1.0 - 0.42 * pow(clamp(length(uv - 0.5) * 1.28, 0.0, 1.0), 2.4);
      col *= vignette;

      float filmGrain = hash(uv * uResolution + fract(t) * 91.7) - 0.5;
      col += filmGrain * 0.018;

      gl_FragColor = vec4(col, 1.0);
    }
  `
}
