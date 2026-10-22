import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/assets/hevc.BvKJFesK.png";
const _imports_1 = "/assets/hevc%201.BcMoJDvF.png";
const _imports_2 = "/assets/image.ChuhCSgQ.png";
const __pageData = JSON.parse('{"title":"非常规Claisen 重排","description":"","frontmatter":{},"headers":[],"relativePath":"notes/Claisen 重排/非常规Claisen 重排 2a9d22f057fe809a94b0c1fe60aa62c0.md","filePath":"notes/Claisen 重排/非常规Claisen 重排 2a9d22f057fe809a94b0c1fe60aa62c0.md","lastUpdated":1766848361000}');
const _sfc_main = { name: "notes/Claisen 重排/非常规Claisen 重排 2a9d22f057fe809a94b0c1fe60aa62c0.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="非常规claisen-重排" tabindex="-1">非常规Claisen 重排 <a class="header-anchor" href="#非常规claisen-重排" aria-label="Permalink to &quot;非常规Claisen 重排&quot;">​</a></h1><p><img${ssrRenderAttr("src", _imports_0)} alt="hevc.png"></p><p>一些Claisen重排反应，进行正常的[3,3]-σ迁移重排后接着有发生了重排得到了β-C连在苯环上的产物。</p><p><img${ssrRenderAttr("src", _imports_1)} alt="hevc.png"></p><p>经过[3,3]-σ迁移后，接着进行Alder烯反应和[1,5]-H原子迁移得到产物。</p><p><img${ssrRenderAttr("src", _imports_2)} alt="image.png"></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("notes/Claisen 重排/非常规Claisen 重排 2a9d22f057fe809a94b0c1fe60aa62c0.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ___Claisen____2a9d22f057fe809a94b0c1fe60aa62c0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  ___Claisen____2a9d22f057fe809a94b0c1fe60aa62c0 as default
};
