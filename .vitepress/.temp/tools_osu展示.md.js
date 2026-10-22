import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderComponent } from "vue/server-renderer";
import { ref, mergeProps, useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _sfc_main$1 = {
  __name: "ChartViewer",
  __ssrInlineRender: true,
  setup(__props) {
    const isDragging = ref(false);
    const isProcessing = ref(false);
    const status = ref("");
    const errorMsg = ref("");
    const resultDataUrl = ref(null);
    const chartList = ref([]);
    ref(null);
    const showPicker = ref(false);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["cv-root", { "cv-dragging": isDragging.value }]
      }, _attrs))} data-v-22781549>`);
      if (!resultDataUrl.value && !showPicker.value && !isProcessing.value) {
        _push(`<div class="cv-dropzone" data-v-22781549><div class="cv-drop-icon" data-v-22781549>🎵</div><p class="cv-drop-title" data-v-22781549>${ssrInterpolate(isDragging.value ? "松开以导入谱面" : "点击或拖入谱面文件")}</p><p class="cv-drop-sub" data-v-22781549>.osu  ·  .osz  ·  .mc  ·  .mcz  ·  .zip</p><input type="file" accept=".osu,.osz,.mc,.mcz,.zip,.json" hidden data-v-22781549></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showPicker.value) {
        _push(`<div class="cv-picker" data-v-22781549><p class="cv-picker-title" data-v-22781549>检测到多个谱面，请选择：</p><!--[-->`);
        ssrRenderList(chartList.value, (c, i) => {
          _push(`<div class="cv-chart-item" data-v-22781549><span class="cv-chart-ver" data-v-22781549>${ssrInterpolate(c.version)}</span><span class="cv-chart-creator" data-v-22781549>${ssrInterpolate(c.creator)}</span><span class="cv-chart-path" data-v-22781549>${ssrInterpolate(c.path)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isProcessing.value) {
        _push(`<div class="cv-processing" data-v-22781549><span class="cv-spinner" data-v-22781549></span><span data-v-22781549>${ssrInterpolate(status.value)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (errorMsg.value && !isProcessing.value) {
        _push(`<div class="cv-error" data-v-22781549> ❌ ${ssrInterpolate(errorMsg.value)} <button class="cv-btn-small" data-v-22781549>重试</button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (resultDataUrl.value) {
        _push(`<div class="cv-result" data-v-22781549><div class="cv-toolbar" data-v-22781549><button class="cv-btn-primary" data-v-22781549>⬇ 下载 PNG</button><button class="cv-btn-ghost" data-v-22781549>重新上传</button><span class="cv-status" data-v-22781549>${ssrInterpolate(status.value)}</span></div><div class="cv-canvas-wrap" data-v-22781549><img${ssrRenderAttr("src", resultDataUrl.value)} class="cv-result-img" alt="chart" data-v-22781549></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/ChartViewer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ChartViewer = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-22781549"]]);
const __pageData = JSON.parse('{"title":"4k谱面查询器","description":"","frontmatter":{},"headers":[],"relativePath":"tools/osu展示.md","filePath":"tools/osu展示.md","lastUpdated":1776263799000}');
const __default__ = { name: "tools/osu展示.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="_4k谱面查询器" tabindex="-1">4k谱面查询器 <a class="header-anchor" href="#_4k谱面查询器" aria-label="Permalink to &quot;4k谱面查询器&quot;">​</a></h1><p>这里是一个完全集成的本地工具，图片处理全部在浏览器完成，不会上传服务器。</p>`);
      _push(ssrRenderComponent(ChartViewer, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tools/osu展示.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
