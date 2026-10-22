import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderStyle, ssrRenderList, renderToString } from "vue/server-renderer";
import { L as Layout, _ as _sfc_main$3 } from "./VPTeamPageTitle.Do4zKLkT.js";
import { u as useData, i as inBrowser, c as createTitle, m as mergeHead, a as useRoute, p as pathToFile, R as RouterSymbol, b as initData, d as dataSymbol, C as Content, s as siteDataRef, e as createRouter } from "./Content.D9XQyFrY.js";
import { ref, onMounted, mergeProps, useSSRContext, watch, computed, onUnmounted, h, defineComponent, watchEffect, createSSRApp } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
import "@vueuse/core";
const theme = {
  Layout,
  enhanceApp: ({ app }) => {
    app.component("Badge", _sfc_main$3);
  }
};
const _sfc_main$2 = {
  __name: "LayoutSwitch",
  __ssrInlineRender: true,
  setup(__props) {
    const isWide = ref(false);
    onMounted(() => {
      const savedMode = localStorage.getItem("layout-mode");
      if (savedMode === "wide") {
        isWide.value = true;
        document.body.classList.add("wide-mode");
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: "layout-switch-btn",
        title: "切换宽屏模式"
      }, _attrs))} data-v-24e81ab5>`);
      if (isWide.value) {
        _push(`<span data-v-24e81ab5>窄屏</span>`);
      } else {
        _push(`<span data-v-24e81ab5>宽屏</span>`);
      }
      _push(`</button>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/LayoutSwitch.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const LayoutSwitch = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-24e81ab5"]]);
const API_BASE = "https://api.i-meto.com/meting/api";
const _sfc_main$1 = {
  __name: "MusicInfo",
  __ssrInlineRender: true,
  props: {
    url: { type: String, required: true },
    desc: { type: String, default: "" },
    rank: { type: [String, Number], default: null },
    playCount: { type: [String, Number], default: null },
    // 本周循环次数
    trend: { type: [Number, String], default: 0 },
    // 排名浮动
    firstListen: { type: String, default: "" }
    // 第一次听的时间
  },
  setup(__props) {
    const props = __props;
    const loading = ref(false);
    const error = ref(null);
    const songId = ref("");
    const song = ref({ name: "", artist: "", cover: "" });
    function extractSongId(url) {
      if (!url) return null;
      const match = url.match(/(?:song\?id=|song\/|id=)(\d+)/);
      return match ? match[1] : /^\d+$/.test(url) ? url : null;
    }
    function getTrendClass(val) {
      const n = Number(val);
      if (n > 0) return "trend-up";
      if (n < 0) return "trend-down";
      return "trend-steady";
    }
    function getTrendIcon(val) {
      const n = Number(val);
      if (n > 0) return "↑";
      if (n < 0) return "↓";
      return "";
    }
    async function load() {
      const id = extractSongId(props.url);
      if (!id) {
        error.value = "无效的链接";
        return;
      }
      songId.value = id;
      loading.value = true;
      error.value = null;
      try {
        const songRes = await fetch(`${API_BASE}?server=netease&type=song&id=${id}`);
        if (!songRes.ok) throw new Error("API 响应异常");
        const songData = await songRes.json();
        const result = Array.isArray(songData) ? songData[0] : songData;
        if (!result) throw new Error("未找到歌曲数据");
        song.value = {
          name: result.name || result.title || "未知歌曲",
          artist: Array.isArray(result.artist) ? result.artist.join(" / ") : result.artist || result.author || "未知歌手",
          cover: result.pic || result.cover || ""
        };
      } catch (e) {
        error.value = "无法解析信息";
        console.error(e);
      } finally {
        loading.value = false;
      }
    }
    watch(() => props.url, load, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["music-info", { loading: loading.value }]
      }, _attrs))} data-v-308d50c1>`);
      if (__props.rank) {
        _push(`<div class="rank-ribbon" data-v-308d50c1><span class="rank-text" data-v-308d50c1>${ssrInterpolate(__props.rank)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (loading.value) {
        _push(`<div class="loading-placeholder" data-v-308d50c1><div class="spinner" data-v-308d50c1></div></div>`);
      } else if (error.value) {
        _push(`<div class="error-message" data-v-308d50c1><p data-v-308d50c1>⚠️ 解析失败</p><button class="retry-btn" data-v-308d50c1>重试</button></div>`);
      } else {
        _push(`<div class="content" data-v-308d50c1><div class="info" data-v-308d50c1><div class="main-meta" data-v-308d50c1><h3 class="song-name" data-v-308d50c1>${ssrInterpolate(song.value.name)}</h3><p class="artist" data-v-308d50c1>${ssrInterpolate(song.value.artist)}</p><div class="stats-grid" data-v-308d50c1>`);
        if (__props.playCount) {
          _push(`<div class="stat-item" data-v-308d50c1><span class="stat-label" data-v-308d50c1>本周循环</span><span class="stat-value" data-v-308d50c1>${ssrInterpolate(__props.playCount)}<small data-v-308d50c1>次</small></span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.trend !== void 0) {
          _push(`<div class="stat-item" data-v-308d50c1><span class="stat-label" data-v-308d50c1>排名趋势</span><span class="${ssrRenderClass([getTrendClass(__props.trend), "stat-value"])}" data-v-308d50c1>${ssrInterpolate(getTrendIcon(__props.trend))}${ssrInterpolate(Math.abs(__props.trend) || "持平")}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.firstListen) {
          _push(`<div class="stat-item" data-v-308d50c1><span class="stat-label" data-v-308d50c1>第一次听</span><span class="stat-value date" data-v-308d50c1>${ssrInterpolate(__props.firstListen)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (__props.desc) {
          _push(`<div class="custom-desc" data-v-308d50c1><p data-v-308d50c1>${ssrInterpolate(__props.desc)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="footer-actions" data-v-308d50c1><a${ssrRenderAttr("href", `https://music.163.com/#/song?id=${songId.value}`)} target="_blank" class="play-link" data-v-308d50c1><span data-v-308d50c1>在网易云音乐中打开</span><svg viewBox="0 0 24 24" width="14" height="14" data-v-308d50c1><path fill="currentColor" d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" data-v-308d50c1></path></svg></a></div></div><div class="cover" data-v-308d50c1><img${ssrRenderAttr("src", song.value.cover)}${ssrRenderAttr("alt", song.value.name)} loading="lazy" data-v-308d50c1></div></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/MusicInfo.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const MusicInfo = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-308d50c1"]]);
const _sfc_main = {
  __name: "EventWidget",
  __ssrInlineRender: true,
  setup(__props) {
    const { frontmatter } = useData();
    const isHome = computed(() => frontmatter.value.layout === "home");
    const slides = ref([
      { img: "/img/event1.jpg", link: "/tools/osu展示", title: "Rhythm Tool Update" },
      { img: "/pic/img_1.jpg", link: "", title: "这是啥" },
      { img: "/img/event3.jpg", link: "", title: "GitHub Repo" }
    ]);
    const currentIndex = ref(0);
    let timer = null;
    const startAutoPlay = () => {
      timer = setInterval(() => {
        currentIndex.value = (currentIndex.value + 1) % slides.value.length;
      }, 3e3);
    };
    onMounted(() => {
      if (isHome.value) startAutoPlay();
    });
    onUnmounted(() => {
      clearInterval(timer);
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (isHome.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "event-card-container" }, _attrs))} data-v-b45f4d17><div class="carousel-viewport" data-v-b45f4d17><div class="carousel-track" style="${ssrRenderStyle({ transform: `translateX(-${currentIndex.value * 100}%)` })}" data-v-b45f4d17><!--[-->`);
        ssrRenderList(slides.value, (item, index) => {
          _push(`<a${ssrRenderAttr("href", item.link)} class="slide-item" target="_blank" rel="noopener noreferrer" data-v-b45f4d17><img${ssrRenderAttr("src", item.img)}${ssrRenderAttr("alt", item.title)} data-v-b45f4d17><div class="slide-overlay" data-v-b45f4d17><span class="slide-title" data-v-b45f4d17>${ssrInterpolate(item.title)}</span></div></a>`);
        });
        _push(`<!--]--></div></div><div class="carousel-dots" data-v-b45f4d17><!--[-->`);
        ssrRenderList(slides.value, (_, index) => {
          _push(`<span class="${ssrRenderClass({ active: currentIndex.value === index })}" data-v-b45f4d17></span>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/EventWidget.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const EventWidget = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b45f4d17"]]);
const RawTheme = {
  ...theme,
  Layout() {
    return h("div", [
      h(theme.Layout, null, {
        // 把按钮塞到导航栏右侧
        "nav-bar-content-after": () => h(LayoutSwitch),
        "layout-bottom": () => h(EventWidget)
      })
    ]);
  },
  enhanceApp({ app }) {
    app.component("MusicInfo", MusicInfo);
  }
};
const ClientOnly = defineComponent({
  setup(_, { slots }) {
    const show = ref(false);
    onMounted(() => {
      show.value = true;
    });
    return () => show.value && slots.default ? slots.default() : null;
  }
});
function useCodeGroups() {
  if (inBrowser) {
    window.addEventListener("click", (e) => {
      var _a;
      const el = e.target;
      if (el.matches(".vp-code-group input")) {
        const group = (_a = el.parentElement) == null ? void 0 : _a.parentElement;
        if (!group)
          return;
        const i = Array.from(group.querySelectorAll("input")).indexOf(el);
        if (i < 0)
          return;
        const blocks = group.querySelector(".blocks");
        if (!blocks)
          return;
        const current = Array.from(blocks.children).find((child) => child.classList.contains("active"));
        if (!current)
          return;
        const next = blocks.children[i];
        if (!next || current === next)
          return;
        current.classList.remove("active");
        next.classList.add("active");
        const label = group == null ? void 0 : group.querySelector(`label[for="${el.id}"]`);
        label == null ? void 0 : label.scrollIntoView({ block: "nearest" });
      }
    });
  }
}
function useCopyCode() {
  if (inBrowser) {
    const timeoutIdMap = /* @__PURE__ */ new WeakMap();
    window.addEventListener("click", (e) => {
      var _a;
      const el = e.target;
      if (el.matches('div[class*="language-"] > button.copy')) {
        const parent = el.parentElement;
        const sibling = (_a = el.nextElementSibling) == null ? void 0 : _a.nextElementSibling;
        if (!parent || !sibling) {
          return;
        }
        const isShell = /language-(shellscript|shell|bash|sh|zsh)/.test(parent.className);
        const ignoredNodes = [".vp-copy-ignore", ".diff.remove"];
        const clone = sibling.cloneNode(true);
        clone.querySelectorAll(ignoredNodes.join(",")).forEach((node) => node.remove());
        let text = clone.textContent || "";
        if (isShell) {
          text = text.replace(/^ *(\$|>) /gm, "").trim();
        }
        copyToClipboard(text).then(() => {
          el.classList.add("copied");
          clearTimeout(timeoutIdMap.get(el));
          const timeoutId = setTimeout(() => {
            el.classList.remove("copied");
            el.blur();
            timeoutIdMap.delete(el);
          }, 2e3);
          timeoutIdMap.set(el, timeoutId);
        });
      }
    });
  }
}
async function copyToClipboard(text) {
  try {
    return navigator.clipboard.writeText(text);
  } catch {
    const element = document.createElement("textarea");
    const previouslyFocusedElement = document.activeElement;
    element.value = text;
    element.setAttribute("readonly", "");
    element.style.contain = "strict";
    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.style.fontSize = "12pt";
    const selection = document.getSelection();
    const originalRange = selection ? selection.rangeCount > 0 && selection.getRangeAt(0) : null;
    document.body.appendChild(element);
    element.select();
    element.selectionStart = 0;
    element.selectionEnd = text.length;
    document.execCommand("copy");
    document.body.removeChild(element);
    if (originalRange) {
      selection.removeAllRanges();
      selection.addRange(originalRange);
    }
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }
}
function useUpdateHead(route, siteDataByRouteRef) {
  let isFirstUpdate = true;
  let managedHeadElements = [];
  const updateHeadTags = (newTags) => {
    if (isFirstUpdate) {
      isFirstUpdate = false;
      newTags.forEach((tag) => {
        const headEl = createHeadElement(tag);
        for (const el of document.head.children) {
          if (el.isEqualNode(headEl)) {
            managedHeadElements.push(el);
            return;
          }
        }
      });
      return;
    }
    const newElements = newTags.map(createHeadElement);
    managedHeadElements.forEach((oldEl, oldIndex) => {
      const matchedIndex = newElements.findIndex((newEl) => newEl == null ? void 0 : newEl.isEqualNode(oldEl ?? null));
      if (matchedIndex !== -1) {
        delete newElements[matchedIndex];
      } else {
        oldEl == null ? void 0 : oldEl.remove();
        delete managedHeadElements[oldIndex];
      }
    });
    newElements.forEach((el) => el && document.head.appendChild(el));
    managedHeadElements = [...managedHeadElements, ...newElements].filter(Boolean);
  };
  watchEffect(() => {
    const pageData = route.data;
    const siteData = siteDataByRouteRef.value;
    const pageDescription = pageData && pageData.description;
    const frontmatterHead = pageData && pageData.frontmatter.head || [];
    const title = createTitle(siteData, pageData);
    if (title !== document.title) {
      document.title = title;
    }
    const description = pageDescription || siteData.description;
    let metaDescriptionElement = document.querySelector(`meta[name=description]`);
    if (metaDescriptionElement) {
      if (metaDescriptionElement.getAttribute("content") !== description) {
        metaDescriptionElement.setAttribute("content", description);
      }
    } else {
      createHeadElement(["meta", { name: "description", content: description }]);
    }
    updateHeadTags(mergeHead(siteData.head, filterOutHeadDescription(frontmatterHead)));
  });
}
function createHeadElement([tag, attrs, innerHTML]) {
  const el = document.createElement(tag);
  for (const key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
  if (innerHTML) {
    el.innerHTML = innerHTML;
  }
  if (tag === "script" && attrs.async == null) {
    el.async = false;
  }
  return el;
}
function isMetaDescription(headConfig) {
  return headConfig[0] === "meta" && headConfig[1] && headConfig[1].name === "description";
}
function filterOutHeadDescription(head) {
  return head.filter((h2) => !isMetaDescription(h2));
}
const hasFetched = /* @__PURE__ */ new Set();
const createLink = () => document.createElement("link");
const viaDOM = (url) => {
  const link2 = createLink();
  link2.rel = `prefetch`;
  link2.href = url;
  document.head.appendChild(link2);
};
const viaXHR = (url) => {
  const req = new XMLHttpRequest();
  req.open("GET", url, req.withCredentials = true);
  req.send();
};
let link;
const doFetch = inBrowser && (link = createLink()) && link.relList && link.relList.supports && link.relList.supports("prefetch") ? viaDOM : viaXHR;
function usePrefetch() {
  if (!inBrowser) {
    return;
  }
  if (!window.IntersectionObserver) {
    return;
  }
  let conn;
  if ((conn = navigator.connection) && (conn.saveData || /2g/.test(conn.effectiveType))) {
    return;
  }
  const rIC = window.requestIdleCallback || setTimeout;
  let observer = null;
  const observeLinks = () => {
    if (observer) {
      observer.disconnect();
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link2 = entry.target;
          observer.unobserve(link2);
          const { pathname } = link2;
          if (!hasFetched.has(pathname)) {
            hasFetched.add(pathname);
            const pageChunkPath = pathToFile(pathname);
            if (pageChunkPath)
              doFetch(pageChunkPath);
          }
        }
      });
    });
    rIC(() => {
      document.querySelectorAll("#app a").forEach((link2) => {
        const { hostname, pathname } = new URL(link2.href instanceof SVGAnimatedString ? link2.href.animVal : link2.href, link2.baseURI);
        const extMatch = pathname.match(/\.\w+$/);
        if (extMatch && extMatch[0] !== ".html") {
          return;
        }
        if (
          // only prefetch same tab navigation, since a new tab will load
          // the lean js chunk instead.
          link2.target !== "_blank" && // only prefetch inbound links
          hostname === location.hostname
        ) {
          if (pathname !== location.pathname) {
            observer.observe(link2);
          } else {
            hasFetched.add(pathname);
          }
        }
      });
    });
  };
  onMounted(observeLinks);
  const route = useRoute();
  watch(() => route.path, observeLinks);
  onUnmounted(() => {
    observer && observer.disconnect();
  });
}
function resolveThemeExtends(theme2) {
  if (theme2.extends) {
    const base = resolveThemeExtends(theme2.extends);
    return {
      ...base,
      ...theme2,
      async enhanceApp(ctx) {
        if (base.enhanceApp)
          await base.enhanceApp(ctx);
        if (theme2.enhanceApp)
          await theme2.enhanceApp(ctx);
      }
    };
  }
  return theme2;
}
const Theme = resolveThemeExtends(RawTheme);
const VitePressApp = defineComponent({
  name: "VitePressApp",
  setup() {
    const { site, lang, dir } = useData();
    onMounted(() => {
      watchEffect(() => {
        document.documentElement.lang = lang.value;
        document.documentElement.dir = dir.value;
      });
    });
    if (site.value.router.prefetchLinks) {
      usePrefetch();
    }
    useCopyCode();
    useCodeGroups();
    if (Theme.setup)
      Theme.setup();
    return () => h(Theme.Layout);
  }
});
async function createApp() {
  globalThis.__VITEPRESS__ = true;
  const router = newRouter();
  const app = newApp();
  app.provide(RouterSymbol, router);
  const data = initData(router.route);
  app.provide(dataSymbol, data);
  app.component("Content", Content);
  app.component("ClientOnly", ClientOnly);
  Object.defineProperties(app.config.globalProperties, {
    $frontmatter: {
      get() {
        return data.frontmatter.value;
      }
    },
    $params: {
      get() {
        return data.page.value.params;
      }
    }
  });
  if (Theme.enhanceApp) {
    await Theme.enhanceApp({
      app,
      router,
      siteData: siteDataRef
    });
  }
  return { app, router, data };
}
function newApp() {
  return createSSRApp(VitePressApp);
}
function newRouter() {
  let isInitialPageLoad = inBrowser;
  return createRouter((path) => {
    let pageFilePath = pathToFile(path);
    let pageModule = null;
    if (pageFilePath) {
      if (isInitialPageLoad) {
        pageFilePath = pageFilePath.replace(/\.js$/, ".lean.js");
      }
      if (false) ;
      else {
        pageModule = import(
          /*@vite-ignore*/
          pageFilePath
        );
      }
    }
    if (inBrowser) {
      isInitialPageLoad = false;
    }
    return pageModule;
  }, Theme.NotFound);
}
if (inBrowser) {
  createApp().then(({ app, router, data }) => {
    router.go().then(() => {
      useUpdateHead(router.route, data.site);
      app.mount("#app");
    });
  });
}
async function render(path) {
  const { app, router } = await createApp();
  await router.go(path);
  const ctx = { content: "", vpSocialIcons: /* @__PURE__ */ new Set() };
  ctx.content = await renderToString(app, ctx);
  return ctx;
}
export {
  render
};
