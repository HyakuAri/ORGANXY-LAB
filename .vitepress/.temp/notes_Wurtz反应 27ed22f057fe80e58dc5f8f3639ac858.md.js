import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/assets/hevc.aZbaJzfC.png";
const _imports_1 = "/assets/hevc%201.CJ0Ie_mK.png";
const _imports_2 = "/assets/IMG_1980.DtVi9OPI.jpeg";
const _imports_3 = "/assets/IMG_1979.Bt2uaeV_.jpeg";
const __pageData = JSON.parse('{"title":"Wurtz反应","description":"","frontmatter":{},"headers":[],"relativePath":"notes/Wurtz反应 27ed22f057fe80e58dc5f8f3639ac858.md","filePath":"notes/Wurtz反应 27ed22f057fe80e58dc5f8f3639ac858.md","lastUpdated":1766848361000}');
const _sfc_main = { name: "notes/Wurtz反应 27ed22f057fe80e58dc5f8f3639ac858.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="wurtz反应" tabindex="-1">Wurtz反应 <a class="header-anchor" href="#wurtz反应" aria-label="Permalink to &quot;Wurtz反应&quot;">​</a></h1><p>中文: 伍兹反应 重要程度: ⭐⭐</p><h2 id="简介" tabindex="-1">简介 <a class="header-anchor" href="#简介" aria-label="Permalink to &quot;简介&quot;">​</a></h2><p><img${ssrRenderAttr("src", _imports_0)} alt="hevc.png"></p><p>Wurtz偶联使用金属钠和两个卤代烷形成一个新的碳-碳键。首先，金属卤素交换形成碳负离子，然后以SN2方式攻击第二卤代烷。</p><h2 id="机理" tabindex="-1">机理 <a class="header-anchor" href="#机理" aria-label="Permalink to &quot;机理&quot;">​</a></h2><p><img${ssrRenderAttr("src", _imports_1)} alt="hevc.png"></p><div class="tip custom-block"><p class="custom-block-title">特点</p><p>Wurtz反应的改进法是Freund反应，反应如下：</p><p>1,3二卤代烃在Zn或Na的作用下偶联生成环烃</p><p><img${ssrRenderAttr("src", _imports_2)} alt="IMG_1980.jpeg"></p></div><div class="warning custom-block"><p class="custom-block-title">注意事项</p></div><div class="info custom-block"><p class="custom-block-title">相关案例</p><p><img${ssrRenderAttr("src", _imports_3)} alt="IMG_1979.jpeg"></p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("notes/Wurtz反应 27ed22f057fe80e58dc5f8f3639ac858.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Wurtz___27ed22f057fe80e58dc5f8f3639ac858 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  Wurtz___27ed22f057fe80e58dc5f8f3639ac858 as default
};
