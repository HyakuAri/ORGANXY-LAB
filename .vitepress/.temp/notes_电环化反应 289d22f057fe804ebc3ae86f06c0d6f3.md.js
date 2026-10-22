import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/assets/hevc.DXdsrsBp.jpeg";
const _imports_1 = "/assets/hevc%201.BdiuhQSv.jpeg";
const _imports_2 = "/assets/hevc%202.BIj7MB-V.jpeg";
const __pageData = JSON.parse('{"title":"电环化反应","description":"","frontmatter":{},"headers":[],"relativePath":"notes/电环化反应 289d22f057fe804ebc3ae86f06c0d6f3.md","filePath":"notes/电环化反应 289d22f057fe804ebc3ae86f06c0d6f3.md","lastUpdated":1766848361000}');
const _sfc_main = { name: "notes/电环化反应 289d22f057fe804ebc3ae86f06c0d6f3.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="电环化反应" tabindex="-1">电环化反应 <a class="header-anchor" href="#电环化反应" aria-label="Permalink to &quot;电环化反应&quot;">​</a></h1><p>中文: 电环化反应 重要程度: ⭐⭐</p><p><img${ssrRenderAttr("src", _imports_0)} alt="hevc.jpeg"></p><p>请注意，电环化指的是仅一个共轭体系内发生的如开环，关环等的反应。</p><p>环加成请看这：</p><p><a href="./环加成反应 289d22f057fe80ea98f8e505fb9b8579.html">环加成反应</a></p><p>相关的原理如下：</p><p>Homo态需要光照激发，但对于是否为顺旋，对旋，需要通过画能图解决。</p><p>（一般4n+2的与4n的结果相反，因此记住一个即可推全部）</p><table tabindex="0"><thead><tr><th>pi电子数</th><th>4n+2</th><th>4n</th></tr></thead><tbody><tr><td>顺旋</td><td>hv</td><td>🔺</td></tr><tr><td>对旋</td><td>🔺</td><td>hv</td></tr></tbody></table><p>eg，加热情况下4电子只能顺旋</p><p><img${ssrRenderAttr("src", _imports_1)} alt="hevc.jpeg"></p><p>加热下6电子只能对旋</p><p><img${ssrRenderAttr("src", _imports_2)} alt="hevc.jpeg"></p><p>详细见Nazarov 反应</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("notes/电环化反应 289d22f057fe804ebc3ae86f06c0d6f3.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ______289d22f057fe804ebc3ae86f06c0d6f3 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  ______289d22f057fe804ebc3ae86f06c0d6f3 as default
};
