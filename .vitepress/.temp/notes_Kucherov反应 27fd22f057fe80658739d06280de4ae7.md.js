import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/assets/hevc.DpmHR4Mz.png";
const _imports_1 = "/assets/hevc.DRtq0qJv.jpeg";
const __pageData = JSON.parse('{"title":"Kucherov反应","description":"","frontmatter":{},"headers":[],"relativePath":"notes/Kucherov反应 27fd22f057fe80658739d06280de4ae7.md","filePath":"notes/Kucherov反应 27fd22f057fe80658739d06280de4ae7.md","lastUpdated":1766848361000}');
const _sfc_main = { name: "notes/Kucherov反应 27fd22f057fe80658739d06280de4ae7.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="kucherov反应" tabindex="-1">Kucherov反应 <a class="header-anchor" href="#kucherov反应" aria-label="Permalink to &quot;Kucherov反应&quot;">​</a></h1><p>中文: 库切洛夫反应 重要程度: ⭐⭐ 别称: 炔烃与水的加成</p><h2 id="简介" tabindex="-1">简介 <a class="header-anchor" href="#简介" aria-label="Permalink to &quot;简介&quot;">​</a></h2><p>HgSO4-H2SO4 催化下与水发生亲核加成反应最终生成醛或酮的反应，称为Kucherov 反应。</p><p><img${ssrRenderAttr("src", _imports_0)} alt="hevc.png"></p><h2 id="机理" tabindex="-1">机理 <a class="header-anchor" href="#机理" aria-label="Permalink to &quot;机理&quot;">​</a></h2><p>该反应采用氧化加汞还原脱汞反应机理</p><p>醋酸汞对烯烃进行顺式选择性加成反应，接着用硼氢化钠还原脱汞，得到马氏加成的醇。不需要强酸性条件，反应能在温和环境下进行。</p><p><img${ssrRenderAttr("src", _imports_1)} alt="hevc.jpeg"></p><div class="tip custom-block"><p class="custom-block-title">特点</p></div><div class="warning custom-block"><p class="custom-block-title">注意事项</p></div><div class="info custom-block"><p class="custom-block-title">相关案例</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("notes/Kucherov反应 27fd22f057fe80658739d06280de4ae7.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Kucherov___27fd22f057fe80658739d06280de4ae7 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  Kucherov___27fd22f057fe80658739d06280de4ae7 as default
};
