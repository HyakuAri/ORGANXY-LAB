import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/assets/hevc.CW3WRCDQ.jpeg";
const _imports_1 = "/assets/hevc.CeJ4wt_G.png";
const _imports_2 = "/assets/hevc%201.DWtnxSRs.png";
const __pageData = JSON.parse('{"title":"Stephen还原","description":"","frontmatter":{},"headers":[],"relativePath":"notes/Stephen还原 27ed22f057fe807c992be38fef079a7a.md","filePath":"notes/Stephen还原 27ed22f057fe807c992be38fef079a7a.md","lastUpdated":1766848361000}');
const _sfc_main = { name: "notes/Stephen还原 27ed22f057fe807c992be38fef079a7a.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="stephen还原" tabindex="-1">Stephen还原 <a class="header-anchor" href="#stephen还原" aria-label="Permalink to &quot;Stephen还原&quot;">​</a></h1><p>中文: 斯蒂芬还原 重要程度: ⭐</p><h2 id="简介" tabindex="-1">简介 <a class="header-anchor" href="#简介" aria-label="Permalink to &quot;简介&quot;">​</a></h2><p><img${ssrRenderAttr("src", _imports_0)} alt="hevc.jpeg"></p><p>腈被氯化亚锡/HCl气体还原，形成Sn-醛亚胺络合物，水解得到醛的反应，被称为<strong>Stephen醛合成反应</strong>。此反应最早由Stephen在1925年首先报道。反应中生成的醛亚胺-氯化锡络合物（RCH=NH·HCl)2SnCl4）在乙醚中不溶，直接过滤洗涤纯化，然后水解得到产物醛。</p><h2 id="机理" tabindex="-1">机理 <a class="header-anchor" href="#机理" aria-label="Permalink to &quot;机理&quot;">​</a></h2><p><img${ssrRenderAttr("src", _imports_1)} alt="hevc.png"></p><div class="tip custom-block"><p class="custom-block-title">特点</p></div><div class="warning custom-block"><p class="custom-block-title">注意事项</p></div><div class="info custom-block"><p class="custom-block-title">相关案例</p><p><img${ssrRenderAttr("src", _imports_2)} alt="hevc.png"></p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("notes/Stephen还原 27ed22f057fe807c992be38fef079a7a.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Stephen___27ed22f057fe807c992be38fef079a7a = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  Stephen___27ed22f057fe807c992be38fef079a7a as default
};
