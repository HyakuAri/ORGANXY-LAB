import { useSSRContext, unref, withCtx, createTextVNode, createVNode } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { V as VPTeamPage, a as VPTeamPageTitle, b as VPTeamPageSection, c as VPTeamMembers } from "./VPTeamPageTitle.Do4zKLkT.js";
import "./Content.D9XQyFrY.js";
import "./plugin-vue_export-helper.1tPrXgE0.js";
import "@vueuse/core";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{"layout":"page"},"headers":[],"relativePath":"about/index.md","filePath":"about/index.md","lastUpdated":1778944336000}');
const __default__ = { name: "about/index.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    const group1 = [
      {
        avatar: "/members/Cedrene.png",
        name: "C̸e҉d̴r̸e҉n̴e҉",
        desc: "“”"
      },
      {
        avatar: "/members/Patchoulene.png",
        name: "Patchoulene",
        desc: "“神金”"
      },
      {
        avatar: "/members/Paclitaxel.png",
        name: "Paclitaxel",
        desc: "“你说句话啊”"
      },
      {
        avatar: "/members/Curcumol.png",
        name: "Curcumol",
        desc: "“唐”"
      },
      {
        avatar: "/members/Guaiol.png",
        name: "Guaiol",
        desc: "“懒虫”"
      },
      {
        avatar: "/members/Apalutamide.png",
        name: "Apalutamide",
        desc: "“科技哥”"
      },
      {
        avatar: "/members/Milnaclpran.png",
        name: "Levomilnaclpran",
        desc: "“急急急急急”"
      }
    ];
    const group2 = [
      {
        avatar: "/members/Eplerenone.png",
        name: "Eplerenone",
        desc: "“可爱捏”"
      },
      {
        avatar: "/members/Quinine.png",
        name: "Quinine",
        desc: "“傲娇是吧”"
      }
    ];
    const group3 = [
      {
        avatar: "/members/Ritonavir.png",
        name: "Ritonavir",
        desc: "“你舅宠他爸”"
      },
      {
        avatar: "/members/Oseltamivir.png",
        name: "Oseltamivir",
        desc: "“你真的不懂吗？”"
      },
      {
        avatar: "/members/Anisodamine.png",
        name: "Anisodamine",
        desc: "“臭猫！”"
      },
      {
        avatar: "/members/Aminopterin.png",
        name: "Aminopterin",
        desc: "“人呢？”"
      }
    ];
    const group4 = [
      {
        avatar: "/members/Mezerein.png",
        name: "Mezerein",
        desc: "“玩游戏玩的”"
      },
      {
        avatar: "/members/Delphinine.png",
        name: "Delphinine",
        desc: "“休息一下吧”"
      },
      {
        avatar: "/members/Spiramine A.png",
        name: "Spiramine A",
        desc: "“这个时钟是干嘛的？”"
      },
      {
        avatar: "/members/Homoharringtonine.png",
        name: "Homoharringtonine",
        desc: "“不是，兄弟？”"
      }
    ];
    const group5 = [
      {
        avatar: "/members/Indocyanine Green.png",
        name: "Indocyanine Green",
        desc: "“这个算闷骚吗”"
      },
      {
        avatar: "/members/Bromothymol Blue.png",
        name: "Bromothymol Blue",
        desc: "“头脑过于简单”"
      },
      {
        avatar: "/members/Nomilin.png",
        name: "Nomilin",
        desc: "“别种花了”"
      }
    ];
    const group6 = [
      {
        avatar: "/members/Suberogorgin.png",
        name: "Suberogorgin",
        desc: "“什么老头环”"
      },
      {
        avatar: "/members/Gadoteridol.png",
        name: "Gadoteridol",
        desc: "“真的光环吗？能吃吗！”"
      },
      {
        avatar: "/members/Isorosmanol.png",
        name: "Isorosmanol",
        desc: "“嘿！前面不只是向日葵”"
      }
    ];
    const group7 = [
      {
        avatar: "/members/Vincristine.png",
        name: "Vincristine",
        desc: "“ctrl键在哪来着...”"
      },
      {
        avatar: "/members/Ryanodine.png",
        name: "Ryanodine",
        desc: "“卡了”"
      },
      {
        avatar: "/members/Zoanthamine.png",
        name: "Zoanthamine",
        desc: "“耶~，，欸？”"
      },
      {
        avatar: "/members/Ginkgolide B.png",
        name: "Ginkgolide B",
        desc: "“你能别这样看我吗？”"
      }
    ];
    const group8 = [
      {
        avatar: "/members/Brevetoxin B.png",
        name: "Brevetoxin B",
        desc: "“你那边网络是不是不太好。。？”"
      },
      {
        avatar: "/members/Verbenalin.png",
        name: "Verbenalin",
        desc: "“主播耳朵那么长不麻烦吗？”"
      },
      {
        avatar: "/members/Xylenol Orange.png",
        name: "Xylenol Orange",
        desc: "“也没非得让你随身带个板子啊。。。”"
      },
      {
        avatar: "/members/Kaempferol.png",
        name: "Kaempferol",
        desc: "“我*有角，莫非你就是龙B？！”"
      },
      {
        avatar: "/members/Toosendanin.png",
        name: "Toosendanin",
        desc: "“你打过架？什么？逃了？”"
      },
      {
        avatar: "/members/Cimicifugoside.png",
        name: "Cimicifugoside",
        desc: "“为什么你戴眼镜就好凶”"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(unref(VPTeamPage), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(VPTeamPageTitle), null, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` 点进来干什么喵！？ `);
                } else {
                  return [
                    createTextVNode(" 点进来干什么喵！？ ")
                  ];
                }
              }),
              lead: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` 想开合我们喵？！ `);
                } else {
                  return [
                    createTextVNode(" 想开合我们喵？！ ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(VPTeamPageSection), null, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`a`);
                } else {
                  return [
                    createTextVNode("a")
                  ];
                }
              }),
              members: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(VPTeamMembers), {
                    size: "medium",
                    members: group1
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(VPTeamMembers), {
                      size: "medium",
                      members: group1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(VPTeamPageSection), null, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`b`);
                } else {
                  return [
                    createTextVNode("b")
                  ];
                }
              }),
              members: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(VPTeamMembers), {
                    size: "medium",
                    members: group2
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(VPTeamMembers), {
                      size: "medium",
                      members: group2
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(VPTeamPageSection), null, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`c`);
                } else {
                  return [
                    createTextVNode("c")
                  ];
                }
              }),
              members: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(VPTeamMembers), {
                    size: "medium",
                    members: group3
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(VPTeamMembers), {
                      size: "medium",
                      members: group3
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(VPTeamPageSection), null, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`d`);
                } else {
                  return [
                    createTextVNode("d")
                  ];
                }
              }),
              members: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(VPTeamMembers), {
                    size: "medium",
                    members: group4
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(VPTeamMembers), {
                      size: "medium",
                      members: group4
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(VPTeamPageSection), null, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`e`);
                } else {
                  return [
                    createTextVNode("e")
                  ];
                }
              }),
              members: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(VPTeamMembers), {
                    size: "medium",
                    members: group5
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(VPTeamMembers), {
                      size: "medium",
                      members: group5
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(VPTeamPageSection), null, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`f`);
                } else {
                  return [
                    createTextVNode("f")
                  ];
                }
              }),
              members: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(VPTeamMembers), {
                    size: "medium",
                    members: group6
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(VPTeamMembers), {
                      size: "medium",
                      members: group6
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(VPTeamPageSection), null, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`g`);
                } else {
                  return [
                    createTextVNode("g")
                  ];
                }
              }),
              members: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(VPTeamMembers), {
                    size: "medium",
                    members: group7
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(VPTeamMembers), {
                      size: "medium",
                      members: group7
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(VPTeamPageSection), null, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`h`);
                } else {
                  return [
                    createTextVNode("h")
                  ];
                }
              }),
              members: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(VPTeamMembers), {
                    size: "medium",
                    members: group8
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(VPTeamMembers), {
                      size: "medium",
                      members: group8
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(VPTeamPageTitle), null, {
                title: withCtx(() => [
                  createTextVNode(" 点进来干什么喵！？ ")
                ]),
                lead: withCtx(() => [
                  createTextVNode(" 想开合我们喵？！ ")
                ]),
                _: 1
              }),
              createVNode(unref(VPTeamPageSection), null, {
                title: withCtx(() => [
                  createTextVNode("a")
                ]),
                members: withCtx(() => [
                  createVNode(unref(VPTeamMembers), {
                    size: "medium",
                    members: group1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(VPTeamPageSection), null, {
                title: withCtx(() => [
                  createTextVNode("b")
                ]),
                members: withCtx(() => [
                  createVNode(unref(VPTeamMembers), {
                    size: "medium",
                    members: group2
                  })
                ]),
                _: 1
              }),
              createVNode(unref(VPTeamPageSection), null, {
                title: withCtx(() => [
                  createTextVNode("c")
                ]),
                members: withCtx(() => [
                  createVNode(unref(VPTeamMembers), {
                    size: "medium",
                    members: group3
                  })
                ]),
                _: 1
              }),
              createVNode(unref(VPTeamPageSection), null, {
                title: withCtx(() => [
                  createTextVNode("d")
                ]),
                members: withCtx(() => [
                  createVNode(unref(VPTeamMembers), {
                    size: "medium",
                    members: group4
                  })
                ]),
                _: 1
              }),
              createVNode(unref(VPTeamPageSection), null, {
                title: withCtx(() => [
                  createTextVNode("e")
                ]),
                members: withCtx(() => [
                  createVNode(unref(VPTeamMembers), {
                    size: "medium",
                    members: group5
                  })
                ]),
                _: 1
              }),
              createVNode(unref(VPTeamPageSection), null, {
                title: withCtx(() => [
                  createTextVNode("f")
                ]),
                members: withCtx(() => [
                  createVNode(unref(VPTeamMembers), {
                    size: "medium",
                    members: group6
                  })
                ]),
                _: 1
              }),
              createVNode(unref(VPTeamPageSection), null, {
                title: withCtx(() => [
                  createTextVNode("g")
                ]),
                members: withCtx(() => [
                  createVNode(unref(VPTeamMembers), {
                    size: "medium",
                    members: group7
                  })
                ]),
                _: 1
              }),
              createVNode(unref(VPTeamPageSection), null, {
                title: withCtx(() => [
                  createTextVNode("h")
                ]),
                members: withCtx(() => [
                  createVNode(unref(VPTeamMembers), {
                    size: "medium",
                    members: group8
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("about/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
