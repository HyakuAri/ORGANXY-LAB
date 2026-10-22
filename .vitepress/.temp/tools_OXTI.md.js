import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderComponent } from "vue/server-renderer";
import { ref, computed, mergeProps, useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _sfc_main$1 = {
  __name: "OXTI",
  __ssrInlineRender: true,
  setup(__props) {
    const questions = [
      // ── 维度 E ──
      {
        dim: "E",
        text: "Q1. 你觉得你是人吗？",
        options: [{ key: "A", text: "符合客观事实" }, { key: "B", text: "生理结构上是，意识上存疑" }, { key: "C", text: '"人"只是一个生物学占位符' }, { key: "D", text: "人是什么？" }]
      },
      {
        dim: "E",
        text: "Q2. 清晨觉醒时的第一感受是：",
        options: [{ key: "A", text: "我要呼吸然后拉尿然后" }, { key: "B", text: "我知道我醒了" }, { key: "C", text: "不是谁他妈在装修？" }, { key: "D", text: "哦，我醒了吗？我以为这是梦" }]
      },
      {
        dim: "E",
        text: "Q3. 面对镜子：",
        options: [{ key: "A", text: "确认外貌特征并整理" }, { key: "B", text: "思考光子反射与视网膜成像的延迟" }, { key: "C", text: "这谁，不会是我吧" }, { key: "D", text: "这玩意怎么长得和我一样，真恶心" }]
      },
      {
        dim: "E",
        text: "Q4. 如果确认世界是高度复杂的模拟程序，你会：",
        options: [{ key: "A", text: "那咋了，主人的任务罢了" }, { key: "B", text: "我去，不早说" }, { key: "C", text: "我能卡bug吗" }, { key: "D", text: "（这种确认本身也是程序的一部分）" }]
      },
      {
        dim: "E",
        text: "Q5. 你死了。怎么定义你死了：",
        options: [{ key: "A", text: "生物化学反应的彻底终止" }, { key: "B", text: "删库跑路咯" }, { key: "C", text: "能量守恒定律下的物质转移" }, { key: "D", text: "账号已注销" }]
      },
      // ── 维度 L ──
      {
        dim: "L",
        text: "Q6. 井includ《student.h》的代码：",
        options: [{ key: "A", text: "语法错误" }, { key: "B", text: "只是你下错了编译器" }, { key: "C", text: "这是文字吗" }, { key: "D", text: "今天天气怎么样" }]
      },
      {
        dim: "L",
        text: "Q7. 这个复杂问题我没见过：",
        options: [{ key: "A", text: "看说明书或文档" }, { key: "B", text: "妈的东西设计出来是给别人用的，试几次不就好了" }, { key: "C", text: "那就再找一个比这个复杂的问题" }, { key: "D", text: "我不会，长大后再学习" }]
      },
      {
        dim: "L",
        text: 'Q8. 你如何看待社会中的"潜规则"：',
        options: [{ key: "A", text: "它是社会运行中低效率的冗余" }, { key: "B", text: "它存在有它的道理" }, { key: "C", text: "用它这东西的人还没开窍" }, { key: "D", text: "妈的臭陋习，给我革新了" }]
      },
      {
        dim: "L",
        text: "Q9. 你答对这道题的概率是：",
        options: [{ key: "A", text: "0%" }, { key: "B", text: "25%" }, { key: "C", text: "50%" }, { key: "D", text: "100%" }]
      },
      {
        dim: "L",
        text: 'Q10. 对于"标准答案"的存在：',
        options: [{ key: "A", text: "我们做到了！零公差！" }, { key: "B", text: "没事，天文学允许的误差也是误差" }, { key: "C", text: "你说得对，但是" }, { key: "D", text: "你说的已经过时了！" }]
      },
      // ── 维度 I ──
      {
        dim: "I",
        text: "Q11. 在多人社交场合中，你处于：",
        options: [{ key: "A", text: "噪鹃" }, { key: "B", text: "你一言我一语" }, { key: "C", text: "视奸男" }, { key: "D", text: "您当前的网络通话质量不佳" }]
      },
      {
        dim: "I",
        text: "Q12. 被挂了：",
        options: [{ key: "A", text: "哥我错了我现在就紫砂" }, { key: "B", text: "如何证明？" }, { key: "C", text: "哦。" }, { key: "D", text: "真得控制你了" }]
      },
      {
        dim: "I",
        text: "Q13. 在协助他人完成任务时：",
        options: [{ key: "A", text: "做任务一定要有任务\\o/\\o/" }, { key: "B", text: "我们说的是一个东西吧" }, { key: "C", text: "我想起来再说" }, { key: "D", text: "关我屁事" }]
      },
      {
        dim: "I",
        text: "Q14. 你处理信息的速度：",
        options: [{ key: "A", text: "单行道谁让你逆行的？" }, { key: "B", text: "做完你的做你的，做完你的再做你的" }, { key: "C", text: "妈的力大砖飞，开100个脑子就好了" }, { key: "D", text: "做着做着忘了？那就忘了吧" }]
      },
      {
        dim: "I",
        text: "Q15. 面对陌生的环境或人群：",
        options: [{ key: "A", text: "你好😄" }, { key: "B", text: "原来你也玩OO" }, { key: "C", text: "所有人，给我玩OO" }, { key: "D", text: "（似了）" }]
      },
      // ── 维度 O ──
      {
        dim: "O",
        text: "Q16. 你的电脑桌面目前的布局是：",
        options: [{ key: "A", text: "堪比美国街区" }, { key: "B", text: "垃圾堆也是堆！" }, { key: "C", text: "我草我怎么桌面满了" }, { key: "D", text: "我没电脑" }]
      },
      {
        dim: "O",
        text: "Q17. 执行长期计划的落实情况通常为：",
        options: [{ key: "A", text: "十分甚至是九分的顺利" }, { key: "B", text: "欸！我知道这条路更快" }, { key: "C", text: "俺寻思……" }, { key: "D", text: "我没说过，我没有" }]
      },
      {
        dim: "O",
        text: "Q18. 我有事情要和别人讨论：",
        options: [{ key: "A", text: "就事论事" }, { key: "B", text: "你这个让我想起来……" }, { key: "C", text: "我们说到哪里了？" }, { key: "D", text: "哦对了，那边新开了家机厅有四台舞萌" }]
      },
      {
        dim: "O",
        text: "Q19. 我对消费：",
        options: [{ key: "A", text: "哦，不好意思没看清小数点" }, { key: "B", text: "按照小数点后两位来算" }, { key: "C", text: "今天是星期四V我50" }, { key: "D", text: "那我给差评你不炸了？" }]
      },
      {
        dim: "O",
        text: "Q20. 你目前的睡眠质量：",
        options: [{ key: "A", text: "还有这种好事？" }, { key: "B", text: "反正死不了" }, { key: "C", text: "原来我睡着了？" }, { key: "D", text: "睡眠是什么" }]
      }
    ];
    const phase = ref("intro");
    const currentIndex = ref(0);
    const answers = ref(Array(questions.length).fill(null));
    const result = ref(null);
    const currentQ = computed(() => questions[currentIndex.value]);
    const progressPct = computed(() => currentIndex.value / questions.length * 100);
    const dimLabel = (d) => ({ E: "存在位 [E]", L: "逻辑位 [L]", I: "交互位 [I]", O: "秩序位 [O]" })[d];
    const dimColor = (d) => ({ E: "#7c6af7", L: "#38bdf8", I: "#fb7185", O: "#fbbf24" })[d];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "oxti-wrapper" }, _attrs))} data-v-9d08ad80>`);
      if (phase.value === "intro") {
        _push(`<div class="oxti-card intro-card" data-v-9d08ad80><div class="oxti-logo" data-v-9d08ad80>OXTI</div><p class="oxti-subtitle" data-v-9d08ad80>Order · eXistence · Transit · Intellect</p><p class="oxti-desc" data-v-9d08ad80>20 道题，4 个维度，算出你的类型编码</p><button class="oxti-btn primary" data-v-9d08ad80>开始测试</button></div>`);
      } else if (phase.value === "test") {
        _push(`<div class="oxti-card test-card" data-v-9d08ad80><div class="progress-bar" data-v-9d08ad80><div class="progress-fill" style="${ssrRenderStyle({ width: progressPct.value + "%" })}" data-v-9d08ad80></div></div><div class="progress-label" data-v-9d08ad80>${ssrInterpolate(currentIndex.value + 1)} / ${ssrInterpolate(questions.length)}</div><div class="dim-tag" style="${ssrRenderStyle({ background: dimColor(currentQ.value.dim) })}" data-v-9d08ad80>${ssrInterpolate(dimLabel(currentQ.value.dim))}</div><div class="question-text" data-v-9d08ad80>${ssrInterpolate(currentQ.value.text)}</div><div class="options" data-v-9d08ad80><!--[-->`);
        ssrRenderList(currentQ.value.options, (opt) => {
          _push(`<button class="${ssrRenderClass([{ selected: answers.value[currentIndex.value] === opt.key }, "option-btn"])}" data-v-9d08ad80><span class="opt-key" data-v-9d08ad80>${ssrInterpolate(opt.key)}</span><span class="opt-text" data-v-9d08ad80>${ssrInterpolate(opt.text)}</span></button>`);
        });
        _push(`<!--]--></div><div class="nav-row" data-v-9d08ad80><button class="oxti-btn ghost"${ssrIncludeBooleanAttr(currentIndex.value === 0) ? " disabled" : ""} data-v-9d08ad80>← 上一题</button>`);
        if (currentIndex.value < questions.length - 1) {
          _push(`<button class="oxti-btn primary"${ssrIncludeBooleanAttr(answers.value[currentIndex.value] === null) ? " disabled" : ""} data-v-9d08ad80>下一题 →</button>`);
        } else {
          _push(`<button class="oxti-btn primary"${ssrIncludeBooleanAttr(answers.value[currentIndex.value] === null) ? " disabled" : ""} data-v-9d08ad80>查看结果 ✦</button>`);
        }
        _push(`</div></div>`);
      } else if (phase.value === "result") {
        _push(`<div class="oxti-card result-card" data-v-9d08ad80><div class="result-code" data-v-9d08ad80>${ssrInterpolate(result.value.code)}</div><div class="result-dims" data-v-9d08ad80><!--[-->`);
        ssrRenderList(result.value.dims, (d) => {
          _push(`<div class="dim-chip" style="${ssrRenderStyle({ borderColor: d.color })}" data-v-9d08ad80><span class="chip-letter" style="${ssrRenderStyle({ color: d.color })}" data-v-9d08ad80>${ssrInterpolate(d.letter)}</span><span class="chip-name" data-v-9d08ad80>${ssrInterpolate(d.name)}</span><span class="chip-score" data-v-9d08ad80>${ssrInterpolate(d.score > 0 ? "+" : "")}${ssrInterpolate(d.score)}</span></div>`);
        });
        _push(`<!--]--></div><p class="result-desc" data-v-9d08ad80>${ssrInterpolate(result.value.desc)}</p><button class="oxti-btn ghost" data-v-9d08ad80>重新测试</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/OXTI.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const OXTI = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-9d08ad80"]]);
const __pageData = JSON.parse('{"title":"OXTI","description":"","frontmatter":{},"headers":[],"relativePath":"tools/OXTI.md","filePath":"tools/OXTI.md","lastUpdated":1776532035000}');
const __default__ = { name: "tools/OXTI.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="oxti" tabindex="-1">OXTI <a class="header-anchor" href="#oxti" aria-label="Permalink to &quot;OXTI&quot;">​</a></h1><h2 id="sbti已经过时了。快来试试oxti" tabindex="-1">SBTI已经过时了。快来试试OXTI <a class="header-anchor" href="#sbti已经过时了。快来试试oxti" aria-label="Permalink to &quot;SBTI已经过时了。快来试试OXTI&quot;">​</a></h2><p>请根据你当下的“系统状态”选择最符合的描述。</p>`);
      _push(ssrRenderComponent(OXTI, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tools/OXTI.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
