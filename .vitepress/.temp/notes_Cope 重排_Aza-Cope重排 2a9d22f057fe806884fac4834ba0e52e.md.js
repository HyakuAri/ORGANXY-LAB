import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/assets/IMG_2040.BPwxzsHh.jpeg";
const __pageData = JSON.parse('{"title":"Aza-Cope重排","description":"","frontmatter":{},"headers":[],"relativePath":"notes/Cope 重排/Aza-Cope重排 2a9d22f057fe806884fac4834ba0e52e.md","filePath":"notes/Cope 重排/Aza-Cope重排 2a9d22f057fe806884fac4834ba0e52e.md","lastUpdated":1766848361000}');
const _sfc_main = { name: "notes/Cope 重排/Aza-Cope重排 2a9d22f057fe806884fac4834ba0e52e.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="aza-cope重排" tabindex="-1">Aza-Cope重排 <a class="header-anchor" href="#aza-cope重排" aria-label="Permalink to &quot;Aza-Cope重排&quot;">​</a></h1><p>含氮分子也可以发生Cope重排，该类反应叫“aza-Cope重排”</p><p><img${ssrRenderAttr("src", _imports_0)} alt="IMG_2040.jpeg"></p><p>在这个反应中，Ag+作为一个路易斯酸，脱去氰基。接下来发生一个[3,3]-σ-迁移重排，得到一个既含有一个烯醇基团，又含有一个亚胺基团的中间体。烯醇和亚胺相互反应，最后生成一个二元环的氨基酮。（疑似是一种michael？）</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("notes/Cope 重排/Aza-Cope重排 2a9d22f057fe806884fac4834ba0e52e.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AzaCope___2a9d22f057fe806884fac4834ba0e52e = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  AzaCope___2a9d22f057fe806884fac4834ba0e52e as default
};
