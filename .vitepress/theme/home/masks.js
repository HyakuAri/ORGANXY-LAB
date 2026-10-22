import * as THREE from 'three'

/* ============================================================
   SHARD masks
   Blender used object-space noise + ring waves to mix a glass
   lobe and a chrome lobe. glTF cannot carry that graph, so the
   same idea is baked into three textures that drive
   transmissionMap / metalnessMap / roughnessMap.
   ============================================================ */

function hash2(x, y) {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}

function smooth(t) {
  return t * t * (3 - 2 * t)
}

function noise2(x, y) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = smooth(xf)
  const v = smooth(yf)
  const a = hash2(xi, yi)
  const b = hash2(xi + 1, yi)
  const c = hash2(xi, yi + 1)
  const d = hash2(xi + 1, yi + 1)

  return (
    a * (1 - u) * (1 - v) +
    b * u * (1 - v) +
    c * (1 - u) * v +
    d * u * v
  )
}

function fbm(x, y, octaves = 4, lacunarity = 2.07, gain = 0.52) {
  let amp = 0.5
  let freq = 1
  let sum = 0
  let norm = 0

  for (let i = 0; i < octaves; i++) {
    sum += amp * noise2(x * freq, y * freq)
    norm += amp
    amp *= gain
    freq *= lacunarity
  }

  return sum / norm
}

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

function smoothstep(a, b, x) {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

function makeTexture(canvas) {
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.NoColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = 4
  tex.needsUpdate = true
  return tex
}

export function createShardMaps(size = 1024) {
  const transmissionCanvas = document.createElement('canvas')
  const metalnessCanvas = document.createElement('canvas')
  const roughnessCanvas = document.createElement('canvas')

  for (const c of [transmissionCanvas, metalnessCanvas, roughnessCanvas]) {
    c.width = size
    c.height = size
  }

  const tctx = transmissionCanvas.getContext('2d')
  const mctx = metalnessCanvas.getContext('2d')
  const rctx = roughnessCanvas.getContext('2d')

  const tdata = tctx.createImageData(size, size)
  const mdata = mctx.createImageData(size, size)
  const rdata = rctx.createImageData(size, size)

  for (let y = 0; y < size; y++) {
    const v = y / size

    for (let x = 0; x < size; x++) {
      const u = x / size

      // Large ring structure, warped by fbm. Blender: wave rings with
      // distortion + noise 18.5 + ramps.
      const warp = fbm(u * 5.1 + 3.7, v * 5.1 - 1.9, 4)
      const radius = Math.hypot(u - 0.5, v - 0.5)
      const ringA = Math.sin(radius * 74.0 + warp * 12.0 - 4.7)
      const ringB = Math.sin(radius * 31.0 - warp * 7.2 + 1.3)
      const grain = fbm(u * 18.5 + 0.4, v * 18.5 - 2.1, 5)
      const grain2 = fbm(u * 41.0 - 7.0, v * 41.0 + 5.0, 3)

      let field =
        0.5 +
        0.17 * ringA +
        0.12 * ringB +
        0.34 * (grain - 0.5) +
        0.2 * (grain2 - 0.5)

      // Organic threshold. Chrome-dominant mix, glass veins.
      const glass = smoothstep(0.45, 0.63, field)
      const chrome = 1 - glass

      const rough = 0.012 + 0.078 * glass + 0.02 * (grain2 - 0.5)
      const roughByte = Math.round(clamp01(rough) * 255)
      const glassByte = Math.round(clamp01(glass) * 255)
      const chromeByte = Math.round(clamp01(chrome) * 255)

      const i = (y * size + x) * 4

      tdata.data[i] = glassByte
      tdata.data[i + 1] = glassByte
      tdata.data[i + 2] = glassByte
      tdata.data[i + 3] = 255

      mdata.data[i] = chromeByte
      mdata.data[i + 1] = chromeByte
      mdata.data[i + 2] = chromeByte
      mdata.data[i + 3] = 255

      rdata.data[i] = roughByte
      rdata.data[i + 1] = roughByte
      rdata.data[i + 2] = roughByte
      rdata.data[i + 3] = 255
    }
  }

  tctx.putImageData(tdata, 0, 0)
  mctx.putImageData(mdata, 0, 0)
  rctx.putImageData(rdata, 0, 0)

  return {
    transmission: makeTexture(transmissionCanvas),
    metalness: makeTexture(metalnessCanvas),
    roughness: makeTexture(roughnessCanvas)
  }
}
