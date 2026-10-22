import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/assets/hevc.CVgoQhkI.png";
const _imports_1 = "/assets/hevc%201.B2rc5hF6.png";
const _imports_2 = "/assets/hevc%202.Dpi_XyDm.png";
const _imports_3 = "/assets/hevc.JDsDRDUV.jpeg";
const __pageData = JSON.parse('{"title":"Swern 氧化","description":"","frontmatter":{},"headers":[],"relativePath":"notes/Swern 氧化 2a8d22f057fe8028ad4bc6271428e853.md","filePath":"notes/Swern 氧化 2a8d22f057fe8028ad4bc6271428e853.md","lastUpdated":1766848361000}');
const _sfc_main = { name: "notes/Swern 氧化 2a8d22f057fe8028ad4bc6271428e853.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="swern-氧化" tabindex="-1">Swern 氧化 <a class="header-anchor" href="#swern-氧化" aria-label="Permalink to &quot;Swern 氧化&quot;">​</a></h1><p>重要程度: ⭐</p><h2 id="简介" tabindex="-1">简介 <a class="header-anchor" href="#简介" aria-label="Permalink to &quot;简介&quot;">​</a></h2><p><img${ssrRenderAttr("src", _imports_0)} alt="hevc.png"></p><h2 id="机理" tabindex="-1">机理 <a class="header-anchor" href="#机理" aria-label="Permalink to &quot;机理&quot;">​</a></h2><p>TFAA：</p><p><img${ssrRenderAttr("src", _imports_1)} alt="hevc.png"></p><p>草酰氯</p><p><img${ssrRenderAttr("src", _imports_2)} alt="hevc.png"></p><div class="tip custom-block"><p class="custom-block-title">特点</p><p>1、在没有溶剂存在时，DMSO和TFAA，草酰氯反应非常剧烈，可能会爆炸，因此常加入二氯甲烷作为溶剂，此外THF、乙醚也能使用；</p><p>2、如上面机理所示，TFAA活化时，最初中间体在超过-30℃时不稳定，重排为氯甲基甲硫醚；</p><p>3、而草酰氯作为活化剂时，最初中间体的稳定温度是低于-60℃，因此反应常常在-78℃下反应；</p><p>4、经典的操作步骤：在低温下，先用TFAA或草酰氯活化DMSO，然后缓慢加入醇，再加入三级胺反应后，缓慢升至室温；</p><p>5、加入三级胺，如DIPEA, TEA，可以有效的促进烷氧基硫盐的分解；</p><p>6、反应底物的位阻不会影响氧化的效率；</p><p>7、用TFAA做活化剂时，常常会有醇的三氟乙酸酯副产物，而草酰氯没有；</p><p>8、对于一些含有对酸敏感基团的底物，加入醇后要尽快加入三级胺；</p><p>9、为防止生成的羰基化合物发生α-差向异构或双键迁移，要避免用三乙胺，而用DIPEA或N-甲基吗啡啉等大位阻的碱，在低温下淬灭。</p><p>10、除非有特别要求，一般都是以底物：乙二酰氯：DMSO：三乙胺 = 1:2:3:6的摩尔比作为标准配比来进行反应。</p><p>11、DMSO产生的恶臭气味，全部操作都要在通风橱内，使用后的玻璃仪器用次氯酸水溶液浸泡，能除去恶臭的气味。</p></div><div class="warning custom-block"><p class="custom-block-title">注意事项</p><p>很臭很臭！</p></div><div class="info custom-block"><p class="custom-block-title">相关案例</p><p><img${ssrRenderAttr("src", _imports_3)} alt="hevc.jpeg"></p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("notes/Swern 氧化 2a8d22f057fe8028ad4bc6271428e853.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Swern____2a8d22f057fe8028ad4bc6271428e853 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  Swern____2a8d22f057fe8028ad4bc6271428e853 as default
};
