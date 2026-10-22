import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"26.2.21-第1周","description":"","frontmatter":{},"headers":[],"relativePath":"music/26.2.21-第1周.md","filePath":"music/26.2.21-第1周.md","lastUpdated":1785341330000}');
const _sfc_main = { name: "music/26.2.21-第1周.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_MusicInfo = resolveComponent("MusicInfo");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="_26-2-21-第1周" tabindex="-1">26.2.21-第1周 <a class="header-anchor" href="#_26-2-21-第1周" aria-label="Permalink to &quot;26.2.21-第1周&quot;">​</a></h1><h2 id="本期为样板" tabindex="-1">本期为样板 <a class="header-anchor" href="#本期为样板" aria-label="Permalink to &quot;本期为样板&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_MusicInfo, {
    url: "https://music.163.com/song?id=1899317143&uct2=U2FsdGVkX1+93vvkp6HOfhbuexiJwV0KcW9rWzfkVgM=",
    rank: "1",
    trend: "2",
    playCount: "14",
    desc: "好听，给到夯",
    firstListen: "25.7.25 18:28"
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("music/26.2.21-第1周.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _26_2_21__1_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  _26_2_21__1_ as default
};
