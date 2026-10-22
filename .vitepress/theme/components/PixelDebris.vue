<template>
  <canvas ref="canvasEl" class="pixel-debris" aria-hidden="true" />
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvasEl = ref(null)

let paintTimer = 0
let clearTimer = 0
let ctx = null

const SELECTOR = [
  '.stage-hero-text .stage-title',
  '.stage-hero-text .stage-sub',
  '.stage-hero-text .stage-tag',
  '.stage-hero-text .stage-eyebrow',
  '.stage-actions .stage-primary',
  '.stage-actions .stage-secondary',
  '.stage-index .stage-index-item',
  '.stage-meta span'
].join(', ')

function resize() {
  const canvas = canvasEl.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false
}

function leftTextNodes() {
  return Array.from(document.querySelectorAll(SELECTOR)).filter((el) => {
    const rect = el.getBoundingClientRect()
    return (
      rect.width > 24 &&
      rect.height > 8 &&
      rect.left < window.innerWidth * 0.62
    )
  })
}

function drawPixelCopy(el) {
  if (!ctx) return

  const rect = el.getBoundingClientRect()
  const style = getComputedStyle(el)
  const factor = 0.1 + Math.random() * 0.13
  const width = Math.max(2, Math.floor(rect.width * factor))
  const height = Math.max(2, Math.floor(rect.height * factor))

  const off = document.createElement('canvas')
  off.width = width
  off.height = height
  const octx = off.getContext('2d')
  octx.scale(factor, factor)
  octx.fillStyle = `rgba(238, 243, 247, ${0.6 + Math.random() * 0.4})`
  octx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  octx.textBaseline = 'top'

  const lines = (el.innerText || '').trim().split('\n')
  const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2
  lines.forEach((line, index) => {
    octx.fillText(line, 0, index * lineHeight)
  })

  ctx.imageSmoothingEnabled = false
  ctx.globalAlpha = 0.5 + Math.random() * 0.45
  ctx.drawImage(off, rect.left, rect.top, rect.width, rect.height)
  ctx.globalAlpha = 1
}

function tick() {
  const nodes = leftTextNodes()

  if (nodes.length && ctx) {
    const count = Math.random() > 0.65 ? 2 : 1
    for (let i = 0; i < count; i++) {
      drawPixelCopy(nodes[Math.floor(Math.random() * nodes.length)])
    }

    clearTimer = window.setTimeout(() => {
      if (ctx) ctx.clearRect(0, 0, canvasEl.value.width, canvasEl.value.height)
    }, 60 + Math.random() * 160)
  }

  paintTimer = window.setTimeout(tick, 240 + Math.random() * 620)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  resize()
  window.addEventListener('resize', resize)
  tick()
})

onBeforeUnmount(() => {
  window.clearTimeout(paintTimer)
  window.clearTimeout(clearTimer)
  window.removeEventListener('resize', resize)
})
</script>
