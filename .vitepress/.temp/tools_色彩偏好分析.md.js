import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderStyle, ssrRenderClass } from "vue/server-renderer";
import { ref, computed, onMounted, mergeProps, unref, useSSRContext } from "vue";
import { Sliders, Trash2, Upload, Download, PieChart, ThermometerSun, Droplets, RefreshCcw } from "lucide-vue-next";
const _sfc_main$1 = {
  __name: "ColorPreferenceAnalyzer",
  __ssrInlineRender: true,
  setup(__props) {
    const isWarmHue = (h) => {
      return h >= 0 && h < 90 || h >= 270 && h <= 360;
    };
    const images = ref([]);
    const isProcessing = ref(false);
    const isDragging = ref(false);
    const sampleCount = ref(5);
    ref(null);
    const stats = computed(() => {
      const allColors = images.value.flatMap((img) => img.colors);
      const total = allColors.length;
      if (total === 0) return null;
      const q1 = allColors.filter((c) => c.s >= 50 && c.l >= 50).length;
      const q2 = allColors.filter((c) => c.s < 50 && c.l >= 50).length;
      const q3 = allColors.filter((c) => c.s < 50 && c.l < 50).length;
      const q4 = allColors.filter((c) => c.s >= 50 && c.l < 50).length;
      const warm = allColors.filter((c) => isWarmHue(c.h)).length;
      const quadrants = [
        { id: "q1", count: q1, label: "明快·二次元", desc: "高亮·高饱和" },
        { id: "q2", count: q2, label: "淡雅·日系感", desc: "高亮·低饱和" },
        { id: "q3", count: q3, label: "深沉·写实风", desc: "低亮·低饱和" },
        { id: "q4", count: q4, label: "浓郁·复古调", desc: "低亮·高饱和" }
      ];
      const dominant = quadrants.sort((a, b) => b.count - a.count)[0];
      return {
        total,
        quadrants: { q1, q2, q3, q4 },
        warmPct: warm / total * 100,
        dominant
      };
    });
    const pieChartSlices = computed(() => {
      if (!stats.value) return [];
      const { q1, q2, q3, q4 } = stats.value.quadrants;
      const total = stats.value.total;
      const createSlicePath = (startPct, endPct) => {
        const startX = Math.cos(2 * Math.PI * startPct - Math.PI / 2);
        const startY = Math.sin(2 * Math.PI * startPct - Math.PI / 2);
        const endX = Math.cos(2 * Math.PI * endPct - Math.PI / 2);
        const endY = Math.sin(2 * Math.PI * endPct - Math.PI / 2);
        const largeArc = endPct - startPct > 0.5 ? 1 : 0;
        return `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArc} 1 ${endX} ${endY} Z`;
      };
      let accumulated = 0;
      const rawSlices = [
        { count: q1, color: "#f472b6", label: "Q1" },
        { count: q4, color: "#a855f7", label: "Q4" },
        { count: q3, color: "#3b82f6", label: "Q3" },
        { count: q2, color: "#2dd4bf", label: "Q2" }
      ];
      return rawSlices.map((slice) => {
        const pct = slice.count / total;
        if (pct === 0) return null;
        const path = createSlicePath(accumulated, accumulated + pct);
        accumulated += pct;
        return { ...slice, path };
      }).filter(Boolean);
    });
    const scatterPlotData = computed(() => {
      const width = 800;
      const height = 500;
      const padding = 60;
      const xScale = (s) => padding + s / 100 * (width - padding * 2);
      const yScale = (l) => height - padding - l / 100 * (height - padding * 2);
      return images.value.flatMap(
        (img, imgIdx) => img.colors.map((c, cIdx) => ({
          ...c,
          id: `${img.id}-${cIdx}`,
          imgName: img.name,
          cx: xScale(c.s),
          cy: yScale(c.l)
        }))
      );
    });
    onMounted(() => {
      setTimeout(() => {
        document.body.classList.add("tw-scan-trigger");
        requestAnimationFrame(() => {
          document.body.classList.remove("tw-scan-trigger");
        });
      }, 100);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["analyzer-container min-h-[80vh] bg-neutral-900 text-white p-6 font-sans transition-colors duration-200 rounded-xl", { "bg-neutral-800 ring-4 ring-indigo-500/50": isDragging.value }]
      }, _attrs))}><div class="max-w-6xl mx-auto space-y-8 pointer-events-none"><header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pointer-events-auto bg-neutral-800/50 p-6 rounded-2xl border border-neutral-800"><div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto"><div class="flex items-center gap-3 bg-neutral-900 px-4 py-2 rounded-xl border border-neutral-700 w-full md:w-auto">`);
      _push(ssrRenderComponent(unref(Sliders), {
        size: 16,
        class: "text-neutral-400"
      }, null, _parent));
      _push(`<span>提取样本:</span><span class="text-indigo-400 font-bold min-w-[20px] text-center">${ssrInterpolate(sampleCount.value)}</span><input type="range" min="1" max="30"${ssrRenderAttr("value", sampleCount.value)} class="w-32 md:w-40 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition"></div><div class="flex gap-3 w-full md:w-auto"><button${ssrIncludeBooleanAttr(images.value.length === 0) ? " disabled" : ""} class="!px-4 !py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition border border-neutral-700 flex items-center justify-center gap-2">`);
      _push(ssrRenderComponent(unref(Trash2), { size: 16 }, null, _parent));
      _push(` 清空 </button><label class="cursor-pointer px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 flex-1 md:flex-none">`);
      _push(ssrRenderComponent(unref(Upload), { size: 18 }, null, _parent));
      _push(` 导入作品 <input type="file" multiple accept="image/*" class="hidden"${ssrIncludeBooleanAttr(isProcessing.value) ? " disabled" : ""}></label></div></div></header>`);
      if (images.value.length > 0 && stats.value) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pointer-events-auto"><div class="lg:col-span-2 space-y-6"><div class="bg-neutral-800 rounded-2xl border border-neutral-700 p-6"><div class="flex justify-between items-center mb-4"><h2 class="!text-lg font-semibold flex items-center gap-2 text-neutral-200 !border-none !m-0"> S-L 分布散点图 </h2><button class="!text-sm px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(Download), { size: 16 }, null, _parent));
        _push(` 导出 4K 分析图 (无背景) </button></div><div class="relative w-full overflow-x-auto bg-neutral-800 rounded-xl border border-neutral-700 shadow-xl p-4"><div class="absolute top-4 right-6 text-neutral-500 text-xs font-mono text-right pointer-events-none z-10"> Y: L (Lightness)<br> X: S (Saturation) </div><div class="absolute inset-0 pointer-events-none flex flex-col p-[60px]"><div class="flex-1 flex"><div class="flex-1 flex items-start justify-start p-4 text-neutral-700 font-bold text-sm">淡雅 (Q2)</div><div class="flex-1 flex items-start justify-end p-4 text-neutral-700 font-bold text-sm">明快 (Q1)</div></div><div class="flex-1 flex"><div class="flex-1 flex items-end justify-start p-4 text-neutral-700 font-bold text-sm">深沉 (Q3)</div><div class="flex-1 flex items-end justify-end p-4 text-neutral-700 font-bold text-sm">浓郁 (Q4)</div></div></div><svg viewBox="0 0 800 500" class="w-full h-auto min-w-[600px] relative z-0"><line x1="60" y1="250" x2="740" y2="250" stroke="#404040" stroke-dasharray="4"></line><line x1="400" y1="60" x2="400" y2="440" stroke="#404040" stroke-dasharray="4"></line><line x1="60" y1="440" x2="740" y2="440" stroke="#737373" stroke-width="2"></line><line x1="60" y1="60" x2="60" y2="440" stroke="#737373" stroke-width="2"></line><text x="400" y="480" text-anchor="middle" fill="#737373" font-size="14" font-weight="bold">S (Saturation)</text><text x="20" y="250" text-anchor="middle" fill="#737373" font-size="14" font-weight="bold" transform="rotate(-90, 20, 250)">L (Lightness)</text><!--[-->`);
        ssrRenderList(scatterPlotData.value, (p) => {
          _push(`<g class="group cursor-pointer"><circle${ssrRenderAttr("cx", p.cx)}${ssrRenderAttr("cy", p.cy)}${ssrRenderAttr("r", images.value.length > 20 ? 4 : 6)}${ssrRenderAttr("fill", p.hex)} stroke="rgba(0,0,0,0.3)" stroke-width="0.5" class="hover:scale-150 hover:stroke-white hover:stroke-2 transition-transform opacity-90 mix-blend-screen"><title>${ssrInterpolate(p.imgName)} HEX: ${ssrInterpolate(p.hex)} S:${ssrInterpolate(Math.round(p.s))}% L:${ssrInterpolate(Math.round(p.l))}%</title></circle></g>`);
        });
        _push(`<!--]--></svg></div></div></div><div class="space-y-6"><div class="bg-neutral-800 rounded-2xl border border-neutral-700 p-6 flex flex-col items-center"><h3 class="text-neutral-300 font-semibold mb-6 flex items-center gap-2 w-full !text-base !m-0">`);
        _push(ssrRenderComponent(unref(PieChart), { size: 18 }, null, _parent));
        _push(` 风格象限分布 </h3><div class="flex flex-col items-center"><div class="relative w-48 h-48"><svg viewBox="-1.2 -1.2 2.4 2.4" class="w-full h-full transform rotate-0"><!--[-->`);
        ssrRenderList(pieChartSlices.value, (slice, i) => {
          _push(`<path${ssrRenderAttr("d", slice.path)}${ssrRenderAttr("fill", slice.color)} stroke="#262626" stroke-width="0.05" class="hover:opacity-90 transition-opacity"></path>`);
        });
        _push(`<!--]--></svg><div class="absolute inset-0 m-auto w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center border-4 border-neutral-700"><div class="text-center"><div class="text-[10px] text-neutral-400">主要风格</div><div class="text-sm font-bold text-white">${ssrInterpolate(stats.value.dominant.label.split("·")[0])}</div></div></div></div></div><div class="w-full mt-6 space-y-3"><div class="flex justify-between items-center text-sm"><span class="flex items-center gap-2 text-neutral-400"><span class="w-3 h-3 rounded-full bg-pink-400"></span>Q1 明快·二次元</span><span class="font-mono text-white">${ssrInterpolate((stats.value.quadrants.q1 / stats.value.total * 100).toFixed(1))}%</span></div><div class="flex justify-between items-center text-sm"><span class="flex items-center gap-2 text-neutral-400"><span class="w-3 h-3 rounded-full bg-teal-400"></span>Q2 淡雅·日系</span><span class="font-mono text-white">${ssrInterpolate((stats.value.quadrants.q2 / stats.value.total * 100).toFixed(1))}%</span></div><div class="flex justify-between items-center text-sm"><span class="flex items-center gap-2 text-neutral-400"><span class="w-3 h-3 rounded-full bg-blue-500"></span>Q3 深沉·写实</span><span class="font-mono text-white">${ssrInterpolate((stats.value.quadrants.q3 / stats.value.total * 100).toFixed(1))}%</span></div><div class="flex justify-between items-center text-sm"><span class="flex items-center gap-2 text-neutral-400"><span class="w-3 h-3 rounded-full bg-purple-500"></span>Q4 浓郁·复古</span><span class="font-mono text-white">${ssrInterpolate((stats.value.quadrants.q4 / stats.value.total * 100).toFixed(1))}%</span></div></div><div class="mt-6 p-3 bg-neutral-900/50 rounded-lg text-xs text-neutral-400 text-center w-full"> 推测你的习惯：<span class="text-indigo-400 font-bold">${ssrInterpolate(stats.value.dominant.desc)}</span></div></div><div class="bg-neutral-800 rounded-2xl border border-neutral-700 p-6"><h3 class="text-neutral-300 font-semibold mb-4 flex items-center gap-2 !text-base !m-0">`);
        _push(ssrRenderComponent(unref(ThermometerSun), { size: 18 }, null, _parent));
        _push(` 冷暖偏向 </h3><div class="relative h-4 bg-neutral-700 rounded-full overflow-hidden mb-2"><div class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 opacity-50"></div><div class="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-500" style="${ssrRenderStyle({ left: `${stats.value.warmPct}%` })}"></div></div><div class="flex justify-between text-xs font-mono text-neutral-500"><span>COOL</span><span class="text-white">${ssrInterpolate(stats.value.warmPct.toFixed(1))}% 暖色</span><span>WARM</span></div></div></div></div>`);
      } else {
        _push(`<div class="${ssrRenderClass([isDragging.value ? "border-indigo-500 bg-indigo-500/10" : "border-neutral-700 hover:border-indigo-500 hover:bg-neutral-800", "border-2 border-dashed rounded-2xl h-80 flex flex-col items-center justify-center gap-4 bg-neutral-800/50 transition-all cursor-pointer pointer-events-auto group"])}"><div class="p-4 bg-neutral-800 rounded-full group-hover:scale-110 transition-transform">`);
        _push(ssrRenderComponent(unref(Droplets), {
          size: 48,
          class: isDragging.value ? "text-indigo-400" : "text-neutral-600 group-hover:text-neutral-400"
        }, null, _parent));
        _push(`</div><div class="text-center"><p class="text-lg text-neutral-300 !m-0">拖入作品集，生成「S-L 象限分析」</p><p class="text-sm mt-1 text-neutral-500 !m-0">包含象限分布饼图、冷暖占比及 4K 散点图导出</p></div></div>`);
      }
      if (isProcessing.value) {
        _push(`<div class="fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-pulse pointer-events-auto z-50">`);
        _push(ssrRenderComponent(unref(RefreshCcw), {
          class: "animate-spin",
          size: 20
        }, null, _parent));
        _push(` 正在解析色彩基因... </div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/ColorPreferenceAnalyzer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __pageData = JSON.parse('{"title":"色彩偏好分析","description":"","frontmatter":{},"headers":[],"relativePath":"tools/色彩偏好分析.md","filePath":"tools/色彩偏好分析.md","lastUpdated":1766848361000}');
const __default__ = { name: "tools/色彩偏好分析.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="色彩偏好分析" tabindex="-1">色彩偏好分析 <a class="header-anchor" href="#色彩偏好分析" aria-label="Permalink to &quot;色彩偏好分析&quot;">​</a></h1><p>这里是一个完全集成的本地工具，图片处理全部在浏览器完成，不会上传服务器。</p>`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tools/色彩偏好分析.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
