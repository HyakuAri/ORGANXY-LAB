/* ------------------------------------------------------------
   Quality tiers for the home stage.

   Everything expensive on the home page hangs off one preset:
   pixel ratio, MSAA, glass transmission, post-processing loops and
   an FPS cap. The tier is picked once at boot, from the device, and
   can be forced with `?q=high|balanced|low` for A/B comparison.
   ------------------------------------------------------------ */

export const PRESETS = {
  // Desktop with a discrete GPU, or a fast iGPU: full look.
  high: {
    dprMax: 1.75,
    samples: 2,
    halfFloat: true,
    transmission: true,
    dispersion: true,
    smear: 18,
    beam: 10,
    mist: 6,
    spots: 3,
    fps: 0
  },

  // Laptops / integrated graphics / 4K: same look, fewer samples.
  balanced: {
    dprMax: 1.35,
    samples: 0,
    halfFloat: true,
    transmission: true,
    dispersion: false,
    smear: 10,
    beam: 6,
    mist: 4,
    spots: 3,
    fps: 0
  },

  // Phones & tablets: no post-processing haze, no extra transmission
  // pass, half the pixels, and a 30 fps ceiling so the device stays cool.
  low: {
    dprMax: 1,
    samples: 0,
    halfFloat: false,
    transmission: false,
    dispersion: false,
    smear: 0,
    beam: 0,
    mist: 0,
    spots: 2,
    fps: 30
  }
}

export const QUALITY_ORDER = ['low', 'balanced', 'high']

export function resolveQuality() {
  if (typeof window === 'undefined') return 'high'

  const forced = new URLSearchParams(window.location.search).get('q')
  if (forced && PRESETS[forced]) return forced

  const coarse = window.matchMedia('(pointer: coarse)').matches
  const cores = navigator.hardwareConcurrency || 4
  const shortSide = Math.min(window.innerWidth, window.innerHeight)

  // Touch-first device: heat and battery matter more than the last 5%.
  if (coarse && shortSide < 900) return 'low'

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const megapixels = (window.innerWidth * window.innerHeight * dpr * dpr) / 1e6

  if (cores <= 4 || megapixels > 4.5) return 'balanced'

  return 'high'
}

/** Applies the tier as `data-q` on <html> so CSS can react to it too. */
export function applyQualityClass(tier) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.q = tier
}
