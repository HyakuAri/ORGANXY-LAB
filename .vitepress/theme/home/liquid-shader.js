import * as THREE from 'three'

/* ------------------------------------------------------------
   The full-screen post pass of the home stage.

   One pass owns everything that used to be three separate systems:
   - screen-space liquefaction over the two CSS-mask regions
   - glitch patches (blocky pixels stretching downwards)
   - the edge smear, sun beams, mist, vignette and chromatic split

   The loop counts are baked in as #defines per quality tier, so the
   driver can fully unroll or skip the expensive parts instead of
   branching on a uniform at runtime.
   ------------------------------------------------------------ */

export function buildLiquidShader(preset) {
  const spotCount = Math.max(1, preset.spots)
  const smearSteps = Math.max(0, preset.smear)
  const beamSteps = Math.max(0, preset.beam)
  const mistSteps = Math.max(0, preset.mist)

  return {
    name: 'StageLiquid',
    uniforms: {
      tDiffuse: { value: null },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uStretch: { value: 1 },
      uGrid: { value: 70 },
      uAspect: { value: 1 },
      uSpotMix: { value: 0 },
      uSpots: { value: Array.from({ length: spotCount }, () => new THREE.Vector4()) }
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
      uniform float uAspect;
      uniform float uSpotMix;
      uniform vec4 uSpots[${spotCount}];
      varying vec2 vUv;

      #define SMEAR_STEPS ${smearSteps}
      #define BEAM_STEPS ${beamSteps}
      #define MIST_STEPS ${mistSteps}
      #define SPOT_COUNT ${spotCount}

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

      float liquidLuma(vec3 c) {
        return dot(c, vec3(0.2126, 0.7152, 0.0722));
      }

      float spotField(vec2 p) {
        float m = 0.0;
        for (int i = 0; i < SPOT_COUNT; i++) {
          vec4 s = uSpots[i];
          if (s.z <= 0.0) continue;
          vec2 d = abs(p - s.xy) / s.zw;
          m = max(m, 1.0 - smoothstep(0.72, 1.0, max(d.x, d.y)));
        }
        return m;
      }

      void main() {
        vec2 p = vUv;

        vec2 d1 = (p - vec2(0.10, 0.18)) / vec2(0.13, 0.12);
        vec2 d2 = (p - vec2(0.78, 0.50)) / vec2(0.11, 0.16);
        float m1 = 1.0 - smoothstep(0.55, 1.35, length(d1));
        float m2 = 1.0 - smoothstep(0.55, 1.35, length(d2));
        float m = clamp(m1 + m2, 0.0, 1.0);

        vec2 uv = p;
        if (m > 0.001) {
          float n1 = liquidFbm(p * 6.0 + vec2(uTime * 0.035, -uTime * 0.02));
          float n2 = liquidFbm(p * 6.0 + vec2(11.0, 4.0) - vec2(uTime * 0.028, uTime * 0.018));
          uv = p + (vec2(n1, n2) - 0.5) * 0.055 * m;
        }

        float ca = 0.0018 * m;
        vec3 col;
        col.r = texture2D(tDiffuse, uv + vec2(ca, 0.0)).r;
        col.g = texture2D(tDiffuse, uv).g;
        col.b = texture2D(tDiffuse, uv - vec2(ca, 0.0)).b;

        // Glitch patches: blocky pixels that smear downwards.
        if (uSpotMix > 0.001) {
          float sm = spotField(p) * uSpotMix;
          if (sm > 0.002) {
            vec2 cells = vec2(max(uGrid, 8.0), max(uGrid, 8.0) * uAspect);
            vec3 glitch = vec3(0.0);
            float wsum = 0.0;
            for (int i = 0; i < 4; i++) {
              vec2 bp = p - vec2(0.0, float(i) * 0.014);
              vec2 bq = (floor(bp * cells) + 0.5) / cells;
              float w = 0.5 / float(i + 1);
              glitch += texture2D(tDiffuse, bq).rgb * w;
              wsum += w;
            }
            col = mix(col, glitch / wsum, sm);
          }
        }

        #if SMEAR_STEPS > 0
        // Whole-page edge smear: find the nearest edge above, drag its
        // colour downward in one-pixel columns and fade it out.
        vec2 px = vec2(1.0) / uResolution;
        vec3 smear = vec3(0.0);
        float smearWeight = 0.0;

        for (int i = 1; i <= SMEAR_STEPS; i++) {
          vec2 suv = p + vec2(0.0, float(i) * px.y * 1.6);

          vec3 c0 = texture2D(tDiffuse, suv).rgb;
          vec3 c1 = texture2D(tDiffuse, suv + vec2(0.0, px.y)).rgb;
          vec3 c2 = texture2D(tDiffuse, suv + vec2(px.x, 0.0)).rgb;

          float e = length(vec2(liquidLuma(c2) - liquidLuma(c0), liquidLuma(c1) - liquidLuma(c0)));

          if (e > 0.07) {
            float w = 1.0 - float(i) / float(SMEAR_STEPS + 1);
            smear += c0 * w;
            smearWeight += w;
          }
        }

        if (smearWeight > 0.0) {
          vec3 sc = smear / smearWeight;
          float alpha = clamp(smearWeight * 0.055 * (40.0 / float(SMEAR_STEPS + 1)), 0.0, 0.6) * uStretch;
          col = mix(col, sc, alpha);
        }
        #endif

        #if BEAM_STEPS > 0
        // Blender compositor: sun beams.
        vec2 sunPos = vec2(0.5, 0.53);
        vec2 sunStep = (p - sunPos) * 0.085;
        vec3 beam = vec3(0.0);
        float beamWeight = 0.0;

        for (int i = 0; i < BEAM_STEPS; i++) {
          vec3 c = texture2D(tDiffuse, p - sunStep * float(i)).rgb;
          float b = max(max(c.r, c.g), c.b);
          float w = smoothstep(2.0, 5.0, b) * (1.0 - float(i) / float(BEAM_STEPS + 1));
          beam += c * w;
          beamWeight += w;
        }

        if (beamWeight > 0.0) {
          beam /= beamWeight;
          col += beam * vec3(1.0, 0.72, 0.46) * 0.18;
        }
        #endif

        #if MIST_STEPS > 0
        vec3 mist = vec3(0.0);
        for (int i = 0; i < MIST_STEPS; i++) {
          float a = float(i) * 0.5236;
          vec2 off = vec2(cos(a), sin(a)) * 0.012;
          vec3 c = texture2D(tDiffuse, p + off).rgb;
          mist += c * smoothstep(0.8, 2.5, max(max(c.r, c.g), c.b));
        }
        col += mist * (0.035 * (12.0 / float(MIST_STEPS)));
        #endif

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
}
