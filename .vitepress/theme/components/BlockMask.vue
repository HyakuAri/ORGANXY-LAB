<template>
  <div ref="maskEl" class="block-mask" aria-hidden="true" />
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const maskEl = ref(null)
let timer = 0

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const tick = () => {
    const el = maskEl.value
    if (el) {
      const block = 8 + Math.random() * 14
      const gap = 2 + Math.random() * 3
      const blur = 3 + Math.random() * 7
      el.style.setProperty('--block', `${block.toFixed(1)}px`)
      el.style.setProperty('--gap', `${gap.toFixed(1)}px`)
      el.style.setProperty('--blur', `${blur.toFixed(1)}px`)
      el.style.opacity = (0.35 + Math.random() * 0.6).toFixed(2)
    }
    timer = window.setTimeout(tick, 220 + Math.random() * 650)
  }

  tick()
})

onBeforeUnmount(() => {
  window.clearTimeout(timer)
})
</script>
