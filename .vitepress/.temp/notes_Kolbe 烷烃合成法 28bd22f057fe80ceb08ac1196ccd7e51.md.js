import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/assets/hevc.E9FX-pgc.png";
const _imports_1 = "/assets/hevc.n3Zyy6IU.jpeg";
const __pageData = JSON.parse('{"title":"Kolbe 烷烃合成法","description":"","frontmatter":{},"headers":[],"relativePath":"notes/Kolbe 烷烃合成法 28bd22f057fe80ceb08ac1196ccd7e51.md","filePath":"notes/Kolbe 烷烃合成法 28bd22f057fe80ceb08ac1196ccd7e51.md","lastUpdated":1766848361000}');
const _sfc_main = { name: "notes/Kolbe 烷烃合成法 28bd22f057fe80ceb08ac1196ccd7e51.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="kolbe-烷烃合成法" tabindex="-1">Kolbe 烷烃合成法 <a class="header-anchor" href="#kolbe-烷烃合成法" aria-label="Permalink to &quot;Kolbe 烷烃合成法&quot;">​</a></h1><p>中文: 科尔贝烷烃和成法 重要程度: ⭐</p><h2 id="简介" tabindex="-1">简介 <a class="header-anchor" href="#简介" aria-label="Permalink to &quot;简介&quot;">​</a></h2><p><img${ssrRenderAttr("src", _imports_0)} alt="hevc.png"></p><p>本质上还是脱羧反应的一种，采用的是电解法</p><p>通过自由基机理完成</p><h2 id="机理" tabindex="-1">机理 <a class="header-anchor" href="#机理" aria-label="Permalink to &quot;机理&quot;">​</a></h2><p><img${ssrRenderAttr("src", _imports_1)} alt="hevc.jpeg"></p><div class="tip custom-block"><p class="custom-block-title">特点</p></div><div class="warning custom-block"><p class="custom-block-title">注意事项</p><p><a href="./脱羧反应 28bd22f057fe800ab3e0ed5dc713eb4b.html">脱羧反应</a></p></div><div class="info custom-block"><p class="custom-block-title">相关案例</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("notes/Kolbe 烷烃合成法 28bd22f057fe80ceb08ac1196ccd7e51.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Kolbe_______28bd22f057fe80ceb08ac1196ccd7e51 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  Kolbe_______28bd22f057fe80ceb08ac1196ccd7e51 as default
};
