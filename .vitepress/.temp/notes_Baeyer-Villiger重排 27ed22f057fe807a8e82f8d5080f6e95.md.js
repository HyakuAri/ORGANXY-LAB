import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/assets/hevc.6XxNKN9K.png";
const __pageData = JSON.parse('{"title":"Baeyer-Villiger重排","description":"","frontmatter":{},"headers":[],"relativePath":"notes/Baeyer-Villiger重排 27ed22f057fe807a8e82f8d5080f6e95.md","filePath":"notes/Baeyer-Villiger重排 27ed22f057fe807a8e82f8d5080f6e95.md","lastUpdated":1766848361000}');
const _sfc_main = { name: "notes/Baeyer-Villiger重排 27ed22f057fe807a8e82f8d5080f6e95.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="baeyer-villiger重排" tabindex="-1">Baeyer-Villiger重排 <a class="header-anchor" href="#baeyer-villiger重排" aria-label="Permalink to &quot;Baeyer-Villiger重排&quot;">​</a></h1><p>中文: 拜尔-魏利格重排 重要程度: ⭐⭐</p><p>拜耳-魏立格重排是一种对醛／酮的氧化为酯的反应</p><p>由于使用的为过氧化物氧化，因此反应的选择性（反应的位点）由大多数富电子（取代基较多的碳）的基团优先迁移，顺序如下</p><p>叔碳</p><p>环己基</p><p>仲碳</p><p>苄基</p><p>苯基</p><p>伯碳</p><p>甲基</p><p>对于芳取代基：</p><p>p-meo-ar</p><p>p-me-ar</p><p>p-cl-ar</p><p>p-br-ar</p><p>p-o2N-Ar</p><p><img${ssrRenderAttr("src", _imports_0)} alt="hevc.png"></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("notes/Baeyer-Villiger重排 27ed22f057fe807a8e82f8d5080f6e95.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BaeyerVilliger___27ed22f057fe807a8e82f8d5080f6e95 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  BaeyerVilliger___27ed22f057fe807a8e82f8d5080f6e95 as default
};
