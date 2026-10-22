import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"欢迎来到我的笔记库","description":"","frontmatter":{},"headers":[],"relativePath":"notes/index.md","filePath":"notes/index.md","lastUpdated":1766848361000}');
const _sfc_main = { name: "notes/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="欢迎来到我的笔记库" tabindex="-1">欢迎来到我的笔记库 <a class="header-anchor" href="#欢迎来到我的笔记库" aria-label="Permalink to &quot;欢迎来到我的笔记库&quot;">​</a></h1><p>感谢您访问我的库！</p><p>这里存放了我的所有 Notion 笔记。 请点击左侧侧边栏查看具体内容。</p><p>下面是一些常见格式</p><p>1.简介</p><p>一般包含发现历史，以及介绍反应</p><p>部分可能出现小反应（页面中的页面）</p><p>2.机理</p><p>包含机理图，以及与机理相关的文字介绍</p><p>3.特点</p><p>一般是反应特点</p><p>4.注意事项</p><p>有可能是科学家故事，</p><p>也有可能是真的注意事项，</p><p>也有可能是相关引用</p><p>5.相关案例</p><p>合成案例，部分会标注特殊反应</p><p>6.汇总表</p><p>针对一些反应进行的速查对比表格。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("notes/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
