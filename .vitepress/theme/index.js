import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import LayoutSwitch from './components/LayoutSwitch.vue'
import MusicInfo from './components/MusicInfo.vue'
import EventWidget from './components/EventWidget.vue'
import './style.css'
import './home.css'

export default {
  ...DefaultTheme,
  Layout() {
    return h('div', [
      h(DefaultTheme.Layout, null, {
        // 把按钮塞到导航栏右侧
        'nav-bar-content-after': () => h(LayoutSwitch),
        'layout-bottom': () => h(EventWidget)
      })
    ])
  },
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('MusicInfo', MusicInfo)
  }
}
