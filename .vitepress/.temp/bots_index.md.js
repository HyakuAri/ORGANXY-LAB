import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"这是群里面583的bot安装的插件操作手册","description":"","frontmatter":{},"headers":[],"relativePath":"bots/index.md","filePath":"bots/index.md","lastUpdated":1768646279000}');
const _sfc_main = { name: "bots/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="这是群里面583的bot安装的插件操作手册" tabindex="-1">这是群里面583的bot安装的插件操作手册 <a class="header-anchor" href="#这是群里面583的bot安装的插件操作手册" aria-label="Permalink to &quot;这是群里面583的bot安装的插件操作手册&quot;">​</a></h1><p>哈哈哈哈哈哈哈哈哈哈哈哈哈</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bots/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
