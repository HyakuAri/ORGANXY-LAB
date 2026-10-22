<template>
  <canvas ref="canvasEl" class="page-compositor" aria-hidden="true" />
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvasEl = ref(null)

let ctx = null
let snapCanvas = null
let lowCanvas = null
let spotCanvas = null
let stageEl = null
let rafId = 0
let disposed = false
let snapReady = false
let lastSnap = 0
let lastSpot = 0
let capturing = false
let html2canvas = null

const SPOT_MS = 1000 / 24
const SNAP_MS = 110

function resize() {
  const c = canvasEl.value
  if (!c) return

  const w = window.innerWidth
  const h = window.innerHeight

  if (c.width !== w || c.height !== h) {
    c.width = w
    c.height = h
  }

  if (!ctx) ctx = c.getContext('2d')

  if (!snapCanvas) {
    snapCanvas = document.createElement('canvas')
    lowCanvas = document.createElement('canvas')
    spotCanvas = document.createElement('canvas')
  }

  if (snapCanvas.width !== w || snapCanvas.height !== h) {
    snapCanvas.width = w
    snapCanvas.height = h
    spotCanvas.width = w
    spotCanvas.height = h
  }
}

function drawSpots() {
  if (!spotCanvas) return

  const sctx = spotCanvas.getContext('2d')
  const w = spotCanvas.width
  const h = spotCanvas.height

  sctx.clearRect(0, 0, w, h)

  const count = 10 + Math.floor(Math.random() * 7)

  for (let i = 0; i < count; i++) {
    const onRight = Math.random() < 0.7
    const x = onRight
      ? w * (0.5 + Math.random() * 0.5)
      : w * Math.random()
    const y = Math.random() * h
    const bw = 10 + Math.random() * 30
    const bh = 10 + Math.random() * 30
    sctx.fillRect(x, y, bw, bh)
  }
}

function paint() {
  if (!ctx || !snapCanvas || !spotCanvas) return

  const w = canvasEl.value.width
  const h = canvasEl.value.height

  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1
  ctx.clearRect(0, 0, w, h)

  if (!snapReady) return

  const lowW = Math.max(2, Math.floor(w / 10))
  const lowH = Math.max(2, Math.floor(h / 10))

  if (lowCanvas.width !== lowW || lowCanvas.height !== lowH) {
    lowCanvas.width = lowW
    lowCanvas.height = lowH
  }

  const lctx = lowCanvas.getContext('2d')
  lctx.imageSmoothingEnabled = true
  lctx.clearRect(0, 0, lowW, lowH)
  lctx.drawImage(snapCanvas, 0, 0, lowW, lowH)

  ctx.imageSmoothingEnabled = false
  ctx.drawImage(lowCanvas, 0, 0, w, h)

  const copies = 6
  for (let i = 1; i <= copies; i++) {
    const dy = i * i * 1.6
    ctx.globalAlpha = 0.5 / i
    ctx.drawImage(lowCanvas, 0, 0, w, h, 0, dy, w, h)
  }

  ctx.globalAlpha = 1

  ctx.globalCompositeOperation = 'destination-in'
  ctx.drawImage(spotCanvas, 0, 0)
  ctx.globalCompositeOperation = 'source-over'
}

async function capture() {
  if (disposed || capturing || !stageEl) return
  capturing = true

  try {
    if (!html2canvas) {
      const mod = await import('html2canvas')
      html2canvas = mod.default
    }

    const shot = await html2canvas(stageEl, {
      backgroundColor: null,
      scale: 1,
      logging: false,
      useCORS: true,
      allowTaint: true,
      ignoreElements: (element) =>
        element.classList?.contains('page-compositor') ||
        element.classList?.contains('stage-filters')
    })

    const sctx = snapCanvas.getContext('2d')
    sctx.clearRect(0, 0, snapCanvas.width, snapCanvas.height)
    sctx.drawImage(shot, 0, 0, snapCanvas.width, snapCanvas.height)
    snapReady = true
  } catch (error) {
    console.warn('[compositor] snapshot failed', error)
  } finally {
    capturing = false
  }
}

function loop(now) {
  if (disposed) return
  rafId = requestAnimationFrame(loop)

  if (now - lastSnap > SNAP_MS) {
    lastSnap = now
    capture()
  }

  if (now - lastSpot > SPOT_MS) {
    lastSpot = now
    drawSpots()
  }

  paint()
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  stageEl = document.querySelector('.stage')
  if (!stageEl) return

  resize()
  window.addEventListener('resize', resize)
  drawSpots()
  rafId = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  disposed = true
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resize)
})
</script>
