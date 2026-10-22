import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/assets/hevc.DyMIob9V.png";
const _imports_1 = "/assets/hevc.DwpNyBU-.jpeg";
const _imports_2 = "/assets/hevc%201.DwjBYFQo.jpeg";
const __pageData = JSON.parse('{"title":"Eschenmoser-Claisen 重排","description":"","frontmatter":{},"headers":[],"relativePath":"notes/Claisen 重排/Eschenmoser-Claisen 重排 2a9d22f057fe803fb222fb3f6980a64b.md","filePath":"notes/Claisen 重排/Eschenmoser-Claisen 重排 2a9d22f057fe803fb222fb3f6980a64b.md","lastUpdated":1766848361000}');
const _sfc_main = { name: "notes/Claisen 重排/Eschenmoser-Claisen 重排 2a9d22f057fe803fb222fb3f6980a64b.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="eschenmoser-claisen-重排" tabindex="-1">Eschenmoser-Claisen 重排 <a class="header-anchor" href="#eschenmoser-claisen-重排" aria-label="Permalink to &quot;Eschenmoser-Claisen 重排&quot;">​</a></h1><p><img${ssrRenderAttr("src", _imports_0)} alt="hevc.png"></p><p>烯丙醇类化合物和N,N-二甲基乙酰胺二缩酮在加热条件下重排得到γ,δ-不饱和酰胺的反应。由于Eschenmoser是基于Meerwein对于酰胺交换的研究而发现此反应，此反应也被称为Meerwein–Eschenmoser–Claisen重排。</p><p>通过形成N,O-乙烯酮缩酮中间体，进行[3,3]-单电子重排得到γ,δ-不饱和酰胺。</p><p><img${ssrRenderAttr("src", _imports_1)} alt="hevc.jpeg"></p><p>eg</p><p><img${ssrRenderAttr("src", _imports_2)} alt="hevc.jpeg"></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("notes/Claisen 重排/Eschenmoser-Claisen 重排 2a9d22f057fe803fb222fb3f6980a64b.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const EschenmoserClaisen____2a9d22f057fe803fb222fb3f6980a64b = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  EschenmoserClaisen____2a9d22f057fe803fb222fb3f6980a64b as default
};
