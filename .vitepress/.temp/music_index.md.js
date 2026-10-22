import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"ORGANXY Lab每周听歌榜单：","description":"","frontmatter":{},"headers":[],"relativePath":"music/index.md","filePath":"music/index.md","lastUpdated":1785341330000}');
const _sfc_main = { name: "music/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_MusicInfo = resolveComponent("MusicInfo");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="organxy-lab每周听歌榜单" tabindex="-1">ORGANXY Lab每周听歌榜单： <a class="header-anchor" href="#organxy-lab每周听歌榜单" aria-label="Permalink to &quot;ORGANXY Lab每周听歌榜单：&quot;">​</a></h1>`);
  _push(ssrRenderComponent(_component_MusicInfo, {
    url: "https://music.163.com/song?id=2149794626&uct2=U2FsdGVkX19Y+2YdDf7qUpJDZPp0i4w/kt1AX+sj8Pk=",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("music/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
