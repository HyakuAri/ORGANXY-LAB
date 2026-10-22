import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderStyle, ssrRenderClass } from "vue/server-renderer";
import { ref, computed, onMounted, mergeProps, unref, useSSRContext } from "vue";
import { Sliders, Trash2, Upload, Palette, Download, Image as Image$1, X, Edit2, Plus, RefreshCcw } from "lucide-vue-next";
const _sfc_main$1 = {
  __name: "AnnualColorReview",
  __ssrInlineRender: true,
  setup(__props) {
    const images = ref([]);
    const isProcessing = ref(false);
    const sampleCount = ref(5);
    const isDragging = ref(false);
    ref(null);
    const globalPalette = computed(() => {
      const allColors = images.value.flatMap((img) => img.colors);
      return allColors.sort((a, b) => a.hsl[0] - b.hsl[0]);
    });
    onMounted(() => {
      localStorage.getItem("layout-mode");
      setTimeout(() => {
        document.body.classList.add("tw-scan-trigger");
        requestAnimationFrame(() => {
          document.body.classList.remove("tw-scan-trigger");
        });
      }, 50);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["color-review-container min-h-[80vh] bg-neutral-900 text-white p-6 font-sans transition-colors duration-200 rounded-xl", { "bg-neutral-800 ring-4 ring-indigo-500/50": isDragging.value }]
      }, _attrs))}><div class="max-w-6xl mx-auto space-y-8 pointer-events-none"><header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-neutral-800/50 p-6 rounded-2xl border border-neutral-800 pointer-events-auto"><div class="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto"><div class="flex items-center gap-4 bg-neutral-900 px-4 py-2 rounded-xl border border-neutral-700 w-full md:w-auto"><div class="flex items-center gap-2 text-sm font-medium text-neutral-300">`);
      _push(ssrRenderComponent(unref(Sliders), { size: 16 }, null, _parent));
      _push(`<span>提取样本:</span><span class="text-indigo-400 font-bold min-w-[20px] text-center">${ssrInterpolate(sampleCount.value)}</span></div><input type="range" min="1" max="30"${ssrRenderAttr("value", sampleCount.value)} class="w-32 md:w-40 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition"></div><div class="flex gap-3 w-full md:w-auto"><button${ssrIncludeBooleanAttr(images.value.length === 0) ? " disabled" : ""} class="!px-4 !py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-50 transition flex items-center justify-center gap-2 text-sm border border-neutral-700 whitespace-nowrap flex-1 md:flex-none">`);
      _push(ssrRenderComponent(unref(Trash2), { size: 16 }, null, _parent));
      _push(` 清空 </button><label class="cursor-pointer px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 whitespace-nowrap flex-1 md:flex-none">`);
      _push(ssrRenderComponent(unref(Upload), { size: 18 }, null, _parent));
      _push(` ${ssrInterpolate(isProcessing.value ? "处理中..." : "导入作品")} <input type="file" multiple accept="image/*" class="hidden"${ssrIncludeBooleanAttr(isProcessing.value) ? " disabled" : ""}></label></div></div></header>`);
      if (images.value.length > 0) {
        _push(`<section class="bg-neutral-800 rounded-2xl p-6 shadow-xl border border-neutral-700 pointer-events-auto"><div class="flex justify-between items-end mb-4"><div><h2 class="!text-xl !m-0 font-semibold flex items-center gap-2 !border-none">`);
        _push(ssrRenderComponent(unref(Palette), {
          class: "text-pink-500",
          size: 20
        }, null, _parent));
        _push(` 年度光谱 </h2><p class="text-sm text-neutral-400 !m-0"> 共 ${ssrInterpolate(images.value.length)} 张作品，${ssrInterpolate(globalPalette.value.length)} 个色彩切片 (4K导出) </p></div><button class="!text-sm !px-4 !py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition flex items-center gap-2 font-medium">`);
        _push(ssrRenderComponent(unref(Download), { size: 16 }, null, _parent));
        _push(` 保存高清大图 </button></div><div class="h-32 w-full rounded-lg overflow-hidden flex relative group cursor-crosshair ring-1 ring-white/10"><!--[-->`);
        ssrRenderList(globalPalette.value, (color, idx) => {
          _push(`<div style="${ssrRenderStyle({ backgroundColor: color.hex, width: `${100 / globalPalette.value.length}%` })}" class="h-full hover:scale-y-110 transition-transform origin-bottom"${ssrRenderAttr("title", color.hex)}></div>`);
        });
        _push(`<!--]--></div><div class="mt-4 flex gap-4 justify-center text-xs text-neutral-500 font-mono"><span>提示：拖动上方滑块可重新提取颜色（会覆盖手动修改）</span></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (images.value.length === 0 && !isProcessing.value) {
        _push(`<div class="${ssrRenderClass([isDragging.value ? "border-indigo-500 bg-indigo-500/10" : "border-neutral-700 hover:border-indigo-500 hover:bg-neutral-800", "border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center gap-4 bg-neutral-800/50 transition-all cursor-pointer pointer-events-auto group"])}"><div class="p-4 bg-neutral-800 rounded-full group-hover:scale-110 transition-transform">`);
        _push(ssrRenderComponent(unref(Image$1), {
          size: 48,
          class: isDragging.value ? "text-indigo-400" : "text-neutral-600 group-hover:text-neutral-400"
        }, null, _parent));
        _push(`</div><div class="text-center"><p class="${ssrRenderClass([isDragging.value ? "text-indigo-300" : "text-neutral-300 group-hover:text-white", "text-lg transition-colors !m-0"])}">${ssrInterpolate(isDragging.value ? "松开鼠标导入文件" : "点击或拖入你的作品集")}</p><p class="text-sm mt-1 text-neutral-500 !m-0">支持批量选择 (JPG, PNG)</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pointer-events-auto"><!--[-->`);
      ssrRenderList(images.value, (img) => {
        _push(`<div class="group bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700 hover:border-neutral-500 transition shadow-lg flex flex-col"><div class="relative aspect-square overflow-hidden bg-neutral-900"><img${ssrRenderAttr("src", img.src)}${ssrRenderAttr("alt", img.name)} class="w-full h-full object-cover transition duration-500 group-hover:scale-105"><button class="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 transition backdrop-blur-sm" title="移除图片">`);
        _push(ssrRenderComponent(unref(X), { size: 14 }, null, _parent));
        _push(`</button></div><div class="p-3 flex-1 flex flex-col justify-between"><div><div class="flex flex-wrap gap-1 mb-2"><!--[-->`);
        ssrRenderList(img.colors, (c, i) => {
          _push(`<label class="relative w-8 h-8 rounded-full cursor-pointer ring-1 ring-white/10 hover:ring-2 hover:ring-white transition group/color overflow-hidden" style="${ssrRenderStyle({ backgroundColor: c.hex })}" title="左键修改 / 右键删除"><input type="color" class="absolute opacity-0 w-full h-full cursor-pointer top-0 left-0"${ssrRenderAttr("value", c.hex)}><div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover/color:opacity-100 bg-black/20 pointer-events-none">`);
          _push(ssrRenderComponent(unref(Edit2), {
            size: 10,
            class: "text-white drop-shadow-md"
          }, null, _parent));
          _push(`</div></label>`);
        });
        _push(`<!--]--><label class="w-8 h-8 rounded-full border border-dashed border-neutral-600 flex items-center justify-center cursor-pointer hover:bg-neutral-700 hover:border-neutral-500 transition text-neutral-500 hover:text-white" title="添加自定义颜色">`);
        _push(ssrRenderComponent(unref(Plus), { size: 14 }, null, _parent));
        _push(`<input type="color" class="absolute opacity-0 w-0 h-0" value="#ffffff"></label></div></div><div class="flex justify-between items-center mt-2 border-t border-neutral-700 pt-2"><p class="text-xs text-neutral-400 truncate max-w-[70%] !m-0">${ssrInterpolate(img.name)}</p><p class="text-[10px] text-neutral-600 font-mono !m-0">ID:${ssrInterpolate(img.id.slice(0, 4))}</p></div></div></div>`);
      });
      _push(`<!--]--></div>`);
      if (isProcessing.value) {
        _push(`<div class="fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-pulse z-50 pointer-events-auto">`);
        _push(ssrRenderComponent(unref(RefreshCcw), {
          class: "animate-spin",
          size: 20
        }, null, _parent));
        _push(` 正在重绘色彩 DNA... </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/AnnualColorReview.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __pageData = JSON.parse('{"title":"年度色彩回顾工具","description":"","frontmatter":{},"headers":[],"relativePath":"tools/年度色彩回顾工具.md","filePath":"tools/年度色彩回顾工具.md","lastUpdated":1766848361000}');
const __default__ = { name: "tools/年度色彩回顾工具.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="年度色彩回顾工具" tabindex="-1">年度色彩回顾工具 <a class="header-anchor" href="#年度色彩回顾工具" aria-label="Permalink to &quot;年度色彩回顾工具&quot;">​</a></h1><p>这里是一个完全集成的本地工具，图片处理全部在浏览器完成，不会上传服务器。</p>`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tools/年度色彩回顾工具.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
