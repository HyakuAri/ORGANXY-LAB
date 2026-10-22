<template>
  <div class="stage">
    <ShardScene />
    <div class="stage-scrim" aria-hidden="true" />

    <svg ref="filterSvg" class="stage-filters" aria-hidden="true" width="0" height="0">
      <defs>
        <filter id="lq-liquid" x="-45%" y="-60%" width="190%" height="220%" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.0042 0.0095" numOctaves="2" seed="23" result="noise">
            <animate
              attributeName="baseFrequency"
              dur="19s"
              values="0.0038 0.008; 0.0056 0.012; 0.0031 0.0068; 0.0038 0.008"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="38"
            xChannelSelector="R"
            yChannelSelector="G"
            result="warp"
          />
          <feGaussianBlur in="warp" stdDeviation="0.5" />
        </filter>

        <filter id="page-fx" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="red"
          />
          <feOffset in="red" dx="3.5" dy="0" result="redShift" />

          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="green"
          />

          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="blue"
          />
          <feOffset in="blue" dx="-3.5" dy="0" result="blueShift" />

          <feBlend in="redShift" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blueShift" mode="screen" />
        </filter>

        <clipPath id="stage-holes" clipPathUnits="objectBoundingBox" clip-rule="evenodd">
          <path d="M0 0 H1 V1 H0 Z" clip-rule="evenodd" />
          <ellipse cx="0.10" cy="0.82" rx="0.13" ry="0.12" clip-rule="evenodd" />
          <ellipse cx="0.78" cy="0.50" rx="0.11" ry="0.16" clip-rule="evenodd" />
        </clipPath>
      </defs>
    </svg>

    <div class="stage-base">
      <StageContent />
    </div>

    <div class="stage-liquid" aria-hidden="true">
      <StageContent decorative />
    </div>

    <PageCompositor />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import ShardScene from './ShardScene.vue'
import StageContent from './StageContent.vue'
import PageCompositor from './PageCompositor.vue'

const filterSvg = ref(null)

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && filterSvg.value) {
    filterSvg.value.pauseAnimations()
  }
})
</script>
