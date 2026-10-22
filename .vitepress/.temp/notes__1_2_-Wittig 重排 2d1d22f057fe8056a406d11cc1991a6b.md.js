import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/assets/hevc.B3z1sVqn.png";
const _imports_1 = "/assets/hevc%201.DLAd8uWc.png";
const _imports_2 = "/assets/hevc%202.1Ts0sSOj.png";
const _imports_3 = "/assets/hevc%203.D47nQZXA.png";
const _imports_4 = "/assets/hevc%204.D6YUJW0z.png";
const _imports_5 = "/assets/hevc%205.B3QoqeA_.png";
const _imports_6 = "/assets/hevc%206.BnvkAvCK.png";
const __pageData = JSON.parse('{"title":"[1,2]-Wittig 重排","description":"","frontmatter":{},"headers":[],"relativePath":"notes/[1,2]-Wittig 重排 2d1d22f057fe8056a406d11cc1991a6b.md","filePath":"notes/[1,2]-Wittig 重排 2d1d22f057fe8056a406d11cc1991a6b.md","lastUpdated":1766848361000}');
const _sfc_main = { name: "notes/[1,2]-Wittig 重排 2d1d22f057fe8056a406d11cc1991a6b.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="_1-2-wittig-重排" tabindex="-1">[1,2]-Wittig 重排 <a class="header-anchor" href="#_1-2-wittig-重排" aria-label="Permalink to &quot;[1,2]-Wittig 重排&quot;">​</a></h1><h2 id="简介" tabindex="-1">简介 <a class="header-anchor" href="#简介" aria-label="Permalink to &quot;简介&quot;">​</a></h2><p><img${ssrRenderAttr("src", _imports_0)} alt="hevc.png"></p><p>强碱处理醚重排得到醇的反应。常用的强碱有烷基锂或LDA等。烷基锂会拔掉醚的α位酸性相对较强的取代基的亚甲基上的氢。</p><h2 id="机理" tabindex="-1">机理 <a class="header-anchor" href="#机理" aria-label="Permalink to &quot;机理&quot;">​</a></h2><p>可能的机理有两种可能，一种是[1,2]-单电子转移重排，另一种可能的机理是自由基重排。</p><p>单电子转移：</p><p>首先烷基锂拔掉醚的其中一个取代基的α位酸性相对较强的亚甲基上的氢，然后进行[1,2]-单电子转移重排得到醇。</p><p><img${ssrRenderAttr("src", _imports_1)} alt="hevc.png"></p><p>自由基机理</p><p><img${ssrRenderAttr("src", _imports_2)} alt="hevc.png"></p><div class="tip custom-block"><p class="custom-block-title">特点</p></div><div class="warning custom-block"><p class="custom-block-title">注意事项</p></div><div class="info custom-block"><p class="custom-block-title">相关案例</p><p>氮杂</p><p><img${ssrRenderAttr("src", _imports_3)} alt="hevc.png"></p><p><img${ssrRenderAttr("src", _imports_4)} alt="hevc.png"></p><p><img${ssrRenderAttr("src", _imports_5)} alt="hevc.png"></p><p>注意，还有1，4wittig重排的副反应发生</p><p><img${ssrRenderAttr("src", _imports_6)} alt="hevc.png"></p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("notes/[1,2]-Wittig 重排 2d1d22f057fe8056a406d11cc1991a6b.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _1_2_Wittig____2d1d22f057fe8056a406d11cc1991a6b = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  _1_2_Wittig____2d1d22f057fe8056a406d11cc1991a6b as default
};
