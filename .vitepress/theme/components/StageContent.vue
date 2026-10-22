<template>
  <div class="stage-inner">
    <header class="stage-hero">
      <div class="stage-hero-text">
        <p class="stage-eyebrow">ORGANXY LAB</p>
        <component :is="decorative ? 'span' : 'h1'" class="stage-title">OrganxyLab</component>
        <p class="stage-sub">说点什么呗喵</p>
        <p class="stage-tag">Navigate Thy Veritas.</p>
      </div>

      <div class="stage-actions">
        <component
          :is="decorative ? 'span' : 'a'"
          class="stage-primary"
          :href="decorative ? undefined : '/notes/'"
        >
          进入笔记库
        </component>
        <component
          :is="decorative ? 'span' : 'a'"
          class="stage-secondary"
          :href="decorative ? undefined : '/about/'"
        >
          你在点什么呢喵？
        </component>
      </div>
    </header>

    <nav class="stage-index" :aria-label="decorative ? undefined : '站点索引'">
      <component
        :is="decorative ? 'span' : 'a'"
        v-for="item in index"
        :key="item.href"
        class="stage-index-item"
        :href="decorative ? undefined : item.href"
      >
        <span class="stage-index-title">{{ item.title }}</span>
        <span v-if="item.desc" class="stage-index-desc">{{ item.desc }}</span>
      </component>
    </nav>

    <footer class="stage-meta">
      <span>© 2026 OrganxyLab. All rights reserved.</span>
      <span>基于 MIT 许可发布。</span>
      <span class="stage-legal">
        <component
          :is="decorative ? 'span' : 'a'"
          :href="decorative ? undefined : '/user_agreement'"
        >
          用户协议
        </component>
        <component
          :is="decorative ? 'span' : 'a'"
          :href="decorative ? undefined : '/privacy_policy'"
        >
          隐私政策
        </component>
      </span>
    </footer>
  </div>
</template>

<script setup>
defineProps({
  decorative: {
    type: Boolean,
    default: false
  }
})

const index = [
  {
    title: '有机反应表',
    desc: '收录了目前简单的绝大部分有机反应喵。',
    href: '/notes/'
  },
  {
    title: '工具箱',
    desc: '有用吗？我不知道喵。',
    href: '/tools/'
  },
  {
    title: '音乐推荐',
    desc: '',
    href: '/music/'
  },
  {
    title: '某个bot的文档',
    desc: '感觉随时会挂',
    href: '/bots/'
  }
]
</script>
