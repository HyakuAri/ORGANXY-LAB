import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/assets/hevc.rwK4aWmD.jpeg";
const _imports_1 = "/assets/hevc%201.GaqnUbOj.jpeg";
const _imports_2 = "/assets/IMG_2148.CTOdbsVD.jpeg";
const _imports_3 = "/assets/IMG_2149.CaWMDrRB.jpeg";
const __pageData = JSON.parse('{"title":"环加成反应","description":"","frontmatter":{},"headers":[],"relativePath":"notes/环加成反应 289d22f057fe80ea98f8e505fb9b8579.md","filePath":"notes/环加成反应 289d22f057fe80ea98f8e505fb9b8579.md","lastUpdated":1766848361000}');
const _sfc_main = { name: "notes/环加成反应 289d22f057fe80ea98f8e505fb9b8579.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="环加成反应" tabindex="-1">环加成反应 <a class="header-anchor" href="#环加成反应" aria-label="Permalink to &quot;环加成反应&quot;">​</a></h1><p>中文: 环加成反应 重要程度: ⭐⭐</p><p>环加成指的是对两对共轭体系讨论，如da加成，2+2等等。</p><p>单共轭体系的反应见：</p><p><a href="./电环化反应 289d22f057fe804ebc3ae86f06c0d6f3.html">电环化反应</a></p><p>环加成分为同面-同面加成，同面-异面加成。但是无论如何，反应必需由一个HOMO和一个LUMO组成。（均为基态）如可以是丁二烯的基态HOMO与乙烯的基态LUMO进行同面，同面加成。也可以是丁二烯的基态LUMO与乙烯的基态HOMO进行同面，同面加成。</p><table tabindex="0"><thead><tr><th>pi电子数（两个总和）</th><th>4n+2</th><th>4n</th></tr></thead><tbody><tr><td>同面-同面</td><td>🔺</td><td>hv</td></tr><tr><td>同面-异面</td><td>hv</td><td>🔺</td></tr></tbody></table><p>【2+2】</p><p>两个2表示两个含有2个π电子的反应物，常见形式为两个烯烃环加成形成四元环，其中一个烯烃一般与其他基团共轭。</p><p><img${ssrRenderAttr("src", _imports_0)} alt="hevc.jpeg"></p><p>[2+2]环加成反应属于4n π电子体系，一般情况下，在加热条件下无法反应(烯酮类除外)，需在光照条件下进行，原因如下: 加热时，两个烯烃的HOMO和LUMO不对称，相位相反，无法发生重叠。 光照时，其中一个烯烃的一个电子从π激发到π反键轨道上</p><p><img${ssrRenderAttr("src", _imports_1)} alt="hevc.jpeg"></p><p>[2+2]环加成反应得到的是含有张力的四元环，虽然不太稳定，但无法从产物回到原料，也就是说不可逆。 主要原因为：在光照条件下形成的四元环，π键变成了两个σ键，没有低能的空轨道(π反键轨道)让光把电子带入其中，因此四元环无法吸收光回到两个烯烃的状态。</p><h2 id="机理" tabindex="-1">机理 <a class="header-anchor" href="#机理" aria-label="Permalink to &quot;机理&quot;">​</a></h2><p><img${ssrRenderAttr("src", _imports_2)} alt="IMG_2148.jpeg"></p><div class="info custom-block"><p class="custom-block-title">相关案例</p><p>一般常见于烯酮或者是异氰酸酯</p><p><img${ssrRenderAttr("src", _imports_3)} alt="IMG_2149.jpeg"></p><p>【4+2】</p><p>最常见于da反应。</p><p>自己看吧我不想写了</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("notes/环加成反应 289d22f057fe80ea98f8e505fb9b8579.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ______289d22f057fe80ea98f8e505fb9b8579 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  ______289d22f057fe80ea98f8e505fb9b8579 as default
};
