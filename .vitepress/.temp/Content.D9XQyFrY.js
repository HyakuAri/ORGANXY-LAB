import { usePreferredDark, useDark } from "@vueuse/core";
import { shallowRef, inject, computed, ref, watch, onUnmounted, reactive, markRaw, readonly, nextTick, defineComponent, h } from "vue";
function deserializeFunctions(r) {
  return Array.isArray(r) ? r.map(deserializeFunctions) : typeof r == "object" && r !== null ? Object.keys(r).reduce((t, n) => (t[n] = deserializeFunctions(r[n]), t), {}) : typeof r == "string" && r.startsWith("_vp-fn_") ? new Function(`return ${r.slice(7)}`)() : r;
}
const siteData = deserializeFunctions(JSON.parse('{"lang":"en-US","dir":"ltr","title":"OrganxyLab","description":"Navigate Thy Veritas.","base":"/","head":[],"router":{"prefetchLinks":true},"appearance":true,"themeConfig":{"nav":[{"text":"首页","link":"/"},{"text":"进入笔记库","link":"/notes/index"},{"text":"音乐推荐","link":"/music/index"},{"text":"进入工具库","link":"/tools/index"}],"sidebar":{"/notes/":[{"text":"1,3 偶极环加成反应","link":"/notes/1,3 偶极环加成反应 293d22f057fe80d49931fe3e1dc17044"},{"text":"Aldol缩合","link":"/notes/Aldol缩合 27dd22f057fe80a3a6d0fe50e4753e76"},{"text":"Appel 反应","link":"/notes/Appel 反应 2a8d22f057fe80aa9a49e166bd3dfae7"},{"text":"Arbuzov-Michaelis 膦酸酯合成","items":[{"text":"Perkow 磷酸烯基酯合成","link":"/notes/Arbuzov-Michaelis 膦酸酯合成/Perkow 磷酸烯基酯合成 2a9d22f057fe80fa9350fcf4f5c0b227"}],"collapsed":true},{"text":"Arbuzov-Michaelis 膦酸酯合成","link":"/notes/Arbuzov-Michaelis 膦酸酯合成 2a9d22f057fe80cfbbfec5058ef145a1"},{"text":"Arndt-Eistert 同系化反应","link":"/notes/Arndt-Eistert 同系化反应 28cd22f057fe80fda10ec358295a2cc4"},{"text":"Azo Coupling 反应","link":"/notes/Azo Coupling 反应 2a0d22f057fe802d9e1efdc385583ada"},{"text":"Baeyer-Villiger重排","link":"/notes/Baeyer-Villiger重排 27ed22f057fe807a8e82f8d5080f6e95"},{"text":"Balz-Schiemann 反应","link":"/notes/Balz-Schiemann 反应 29dd22f057fe80bf8099cfe3fe5eed92"},{"text":"Beckmann重排","link":"/notes/Beckmann重排 27ed22f057fe801a9968fea5b52592d2"},{"text":"Benzilic acid重排","link":"/notes/Benzilic acid重排 289d22f057fe806f9fd1dfc6ca0982ed"},{"text":"Benzoin 缩合","link":"/notes/Benzoin 缩合 292d22f057fe80bbbd17ca604e705964"},{"text":"Benzynes 制备","link":"/notes/Benzynes 制备 2b1d22f057fe80168e59cc49b4251a8b"},{"text":"Birch 还原","link":"/notes/Birch 还原 2a0d22f057fe8084a30ff72ff0a670a9"},{"text":"Bischler-Napieralski 反应","link":"/notes/Bischler-Napieralski 反应 2b1d22f057fe80f0b64ad8ea937b5568"},{"text":"Boekelheide 反应","link":"/notes/Boekelheide 反应 2b0d22f057fe800c9d99e8a118172a6d"},{"text":"Boulton-Katritzky 重排","link":"/notes/Boulton-Katritzky 重排 2aed22f057fe8019b5c6fdbcaba72f82"},{"text":"Brown 硼氢化氧化","link":"/notes/Brown 硼氢化氧化 27fd22f057fe8022916cdff24ab8d2bf"},{"text":"Bucherer 反应","link":"/notes/Bucherer 反应 2a0d22f057fe80f391aedc24212a04cb"},{"text":"Béchamp 还原","link":"/notes/Béchamp 还原 2a0d22f057fe80eab875c49d01e5a52a"},{"text":"Cannizzaro反应","link":"/notes/Cannizzaro反应 27ed22f057fe80c5a38eebfcf4f44330"},{"text":"Carroll 重排","link":"/notes/Carroll 重排 2a8d22f057fe8097ae92e836fb90f9c2"},{"text":"Chichibabin 反应","link":"/notes/Chichibabin 反应 2a7d22f057fe804c94cce81de26c459e"},{"text":"Chichibabin 吡啶合成","link":"/notes/Chichibabin 吡啶合成 2b0d22f057fe80b4a6e4f21ec9e01125"},{"text":"Chugaev 反应","link":"/notes/Chugaev 反应 293d22f057fe80ebb697f916ee92124e"},{"text":"Ciamician-Dennstedt 重排","link":"/notes/Ciamician-Dennstedt 重排 2b0d22f057fe80518482c9f43e6242da"},{"text":"Claisen 酯缩合反应","link":"/notes/Claisen 酯缩合反应 28bd22f057fe805cbfdef1af8088e567"},{"text":"Claisen 重排","items":[{"text":"Belluš–Claisen  重排","link":"/notes/Claisen 重排/Belluš–Claisen 重排 2a9d22f057fe80bf8f16e845806b92b6"},{"text":"Eschenmoser-Claisen 重排","link":"/notes/Claisen 重排/Eschenmoser-Claisen 重排 2a9d22f057fe803fb222fb3f6980a64b"},{"text":"Ireland-Claisen 重排","link":"/notes/Claisen 重排/Ireland-Claisen 重排 2a9d22f057fe80c687f5ec7daf9ca2be"},{"text":"Johnson–Claisen 重排","link":"/notes/Claisen 重排/Johnson–Claisen 重排 2a9d22f057fe8014bb19ccedbe5a3fc1"},{"text":"芳基对位Claisen 重排","link":"/notes/Claisen 重排/芳基对位Claisen 重排 2a9d22f057fe8023802ede4c61e3bf29"},{"text":"非常规Claisen 重排","link":"/notes/Claisen 重排/非常规Claisen 重排 2a9d22f057fe809a94b0c1fe60aa62c0"}],"collapsed":true},{"text":"Claisen 重排","link":"/notes/Claisen 重排 2a8d22f057fe80f6b2d7f9959df08081"},{"text":"Claisen-Schmidt反应","link":"/notes/Claisen-Schmidt反应 27ed22f057fe80f284d6ce9adf7e8399"},{"text":"Clemmensen还原","link":"/notes/Clemmensen还原 27ed22f057fe80e38de5d92f332de2de"},{"text":"Cope 消除","link":"/notes/Cope 消除 293d22f057fe80659dafcc769b373ada"},{"text":"Cope 重排","items":[{"text":"(Anionic) Oxy-Cope 重排","link":"/notes/Cope 重排/(Anionic) Oxy-Cope 重排 2a9d22f057fe80508e3af660725c4e81"},{"text":"Aza-Cope重排","link":"/notes/Cope 重排/Aza-Cope重排 2a9d22f057fe806884fac4834ba0e52e"},{"text":"Siloxy-Cope 重排","link":"/notes/Cope 重排/Siloxy-Cope 重排 2a9d22f057fe80328750e9cd747ac549"}],"collapsed":true},{"text":"Cope 重排","link":"/notes/Cope 重排 2a8d22f057fe8057a959e14d6ec2edc6"},{"text":"Corey-Chaykovsky 反应","link":"/notes/Corey-Chaykovsky 反应 292d22f057fe808a9de9d1a120c8c32b"},{"text":"Criegee 烯烃臭氧化","link":"/notes/Criegee 烯烃臭氧化 27fd22f057fe80edb433c1b9f4c8e189"},{"text":"Curtius 重排","link":"/notes/Curtius 重排 2a0d22f057fe801890bbc42069b1b67a"},{"text":"Dakin 反应","link":"/notes/Dakin 反应 2a0d22f057fe8098ab68d8c8f9f0262b"},{"text":"Darzens 反应","link":"/notes/Darzens 反应 292d22f057fe80a1850bfcbbeb80a6ee"},{"text":"Darzens-Nenitzescu烯烃酰基化反应","link":"/notes/Darzens-Nenitzescu烯烃酰基化反应 27ed22f057fe80daa7a3e0db1404e4d8"},{"text":"Dieckmann 酯缩合反应","link":"/notes/Dieckmann 酯缩合反应 28bd22f057fe8088b88eca513b71fc58"},{"text":"Diels-Alder反应","link":"/notes/Diels-Alder反应 28ed22f057fe80e7b119f1f6bd8f620c"},{"text":"Favorski重排","link":"/notes/Favorski重排 27ed22f057fe80bab4d8eaa0028a6256"},{"text":"Friedel-Crafts反应","items":[{"text":"Friedel-Crafts 烷基化反应","link":"/notes/Friedel-Crafts反应/Friedel-Crafts 烷基化反应 2aad22f057fe806ab6e6f92b71a1b730"},{"text":"Friedel-Crafts 酰基化反应","link":"/notes/Friedel-Crafts反应/Friedel-Crafts 酰基化反应 2aad22f057fe8098bb35eb67c3235860"},{"text":"Zincke-Suhl 环己二烯酮合成","link":"/notes/Friedel-Crafts反应/Zincke-Suhl 环己二烯酮合成 2aad22f057fe809c94c7c57ae45c0406"}],"collapsed":true},{"text":"Friedel-Crafts反应","link":"/notes/Friedel-Crafts反应 287d22f057fe80e7a40bc4868ebd0891"},{"text":"Fries 重排","items":[{"text":"阴离子邻位Fries 重排","link":"/notes/Fries 重排/阴离子邻位Fries 重排 2aad22f057fe804d9b12f359aa89b1f5"}],"collapsed":true},{"text":"Fries 重排","link":"/notes/Fries 重排 2aad22f057fe80b58a3acbf617b28dda"},{"text":"Gabriel 合成","link":"/notes/Gabriel 合成 299d22f057fe8016a672fab377beb81b"},{"text":"Gattermann-Koch 反应","link":"/notes/Gattermann-Koch 反应 28ed22f057fe804c9a4cf1cf7693468c"},{"text":"Glaser偶联","link":"/notes/Glaser偶联 27fd22f057fe80b0937bce63e5ee6309"},{"text":"Gomberg-Bachmann 反应","link":"/notes/Gomberg-Bachmann 反应 2a0d22f057fe80cbbc02f3059d03c6e4"},{"text":"Hantzsch 吡咯合成","link":"/notes/Hantzsch 吡咯合成 2b0d22f057fe808b9e92ea5d29166163"},{"text":"Heck 偶联反应","link":"/notes/Heck 偶联反应 28dd22f057fe80a3a81bc6bac9955c23"},{"text":"Hell-Volhard-Zelinsky 反应","link":"/notes/Hell-Volhard-Zelinsky 反应 28bd22f057fe803dadfacf5681e05edf"},{"text":"Hinsberg 反应","link":"/notes/Hinsberg 反应 299d22f057fe806da0d4efd225ea26a4"},{"text":"Hinsberg 吡咯噻吩合成","link":"/notes/Hinsberg 吡咯噻吩合成 2b0d22f057fe8025aa0cf9703ff21d8f"},{"text":"Hock 重排","link":"/notes/Hock 重排 2a0d22f057fe8059978fc2d6ebdef260"},{"text":"Hofmann 消除","link":"/notes/Hofmann 消除 293d22f057fe80b3b2cdff8c9aaac950"},{"text":"Hofmann 重排","link":"/notes/Hofmann 重排 28bd22f057fe800e895dd0793ddf7576"},{"text":"Horner–Wadsworth–Emmons 反应","link":"/notes/Horner–Wadsworth–Emmons 反应 292d22f057fe802499ffcad175d64e75"},{"text":"Houben-Hoesch 反应","link":"/notes/Houben-Hoesch 反应 2a0d22f057fe809e85fbdfdaaea047ab"},{"text":"Hunsdiecker 反应","link":"/notes/Hunsdiecker 反应 28bd22f057fe80009025ff5985564df7"},{"text":"Knoevenagel 反应","link":"/notes/Knoevenagel 反应 292d22f057fe808694f3f1fd687d8adc"},{"text":"Knorr 吡咯合成","link":"/notes/Knorr 吡咯合成 2b0d22f057fe8091921bf67b085ca9f9"},{"text":"Kochi 反应","link":"/notes/Kochi 反应 28bd22f057fe8050aec6dc40db675138"},{"text":"Kolbe 烷烃合成法","link":"/notes/Kolbe 烷烃合成法 28bd22f057fe80ceb08ac1196ccd7e51"},{"text":"kolbe-Schmitt 反应","link":"/notes/kolbe-Schmitt 反应 28bd22f057fe80cfa882fa0a156f41ce"},{"text":"Kucherov反应","link":"/notes/Kucherov反应 27fd22f057fe80658739d06280de4ae7"},{"text":"Lossen 重排","link":"/notes/Lossen 重排 2a0d22f057fe8089adddc8e574eaae03"},{"text":"Mannich反应","link":"/notes/Mannich反应 287d22f057fe806a8268cd9305b62d17"},{"text":"Meerwein 芳基化反应","link":"/notes/Meerwein 芳基化反应 2a0d22f057fe808f8cffe8ca771d6e94"},{"text":"Meerwein–Ponndorf–Verley还原","link":"/notes/Meerwein–Ponndorf–Verley还原 27ed22f057fe808abd55cd5834535010"},{"text":"Michael加成","link":"/notes/Michael加成 27dd22f057fe80d4b3cdec96e836b874"},{"text":"Mitsunobu 反应","link":"/notes/Mitsunobu 反应 2a8d22f057fe8063a539e38b3ce0876b"},{"text":"Morita-Bayliss-Hillman 反应","link":"/notes/Morita-Bayliss-Hillman 反应 2a9d22f057fe8006bccbf3da0b63a7a7"},{"text":"Mukaiyama Aldol 反应","link":"/notes/Mukaiyama Aldol 反应 28cd22f057fe80f4bebff6fb0b283f3b"},{"text":"Negishi 偶联反应","link":"/notes/Negishi 偶联反应 28dd22f057fe80dcb7b2f429ce3a9342"},{"text":"Oppenauer氧化","link":"/notes/Oppenauer氧化 27ed22f057fe8029b6a9dcfe2fe5c917"},{"text":"Paal 噻吩合成","link":"/notes/Paal 噻吩合成 2b0d22f057fe801cb52dfe234f542cbf"},{"text":"Perkin 反应","link":"/notes/Perkin 反应 292d22f057fe805595bdcdda9d431edc"},{"text":"Pfitzner-Moffatt氧化","link":"/notes/Pfitzner-Moffatt氧化 27ed22f057fe807d9706dfd9c7400874"},{"text":"Pinacol重排","link":"/notes/Pinacol重排 27ed22f057fe80b8b039daa8389a0a64"},{"text":"Polonovski-Potier 反应","link":"/notes/Polonovski-Potier 反应 2a9d22f057fe805cadc9eb9945520a7c"},{"text":"Prévost反位双羟化反应","link":"/notes/Prévost反位双羟化反应 28ed22f057fe80beb8e9f8375512b90a"},{"text":"Reformatsky 反应","link":"/notes/Reformatsky 反应 292d22f057fe8083b189d9ba29459b0d"},{"text":"Reimer-Tiemann 反应","link":"/notes/Reimer-Tiemann 反应 2a0d22f057fe80088f1fccc8721785c7"},{"text":"Ritter 反应","link":"/notes/Ritter 反应 2a7d22f057fe803da131c0881ebb68db"},{"text":"Robinson 关环反应","link":"/notes/Robinson 关环反应 292d22f057fe80ce9e8dd41167cf21ba"},{"text":"Rosenmund还原","link":"/notes/Rosenmund还原 27ed22f057fe80d491c4d1ef2bbd6184"},{"text":"Sandmeyer 反应","link":"/notes/Sandmeyer 反应 29dd22f057fe80d99a0bc9de8dca36e2"},{"text":"Schmidt 重排","link":"/notes/Schmidt 重排 2a0d22f057fe801b831aee5e0b157b2f"},{"text":"Sharpless 不对称环氧化反应","link":"/notes/Sharpless 不对称环氧化反应 2aad22f057fe80dc83f9e23981810c05"},{"text":"sigma-H 迁移","link":"/notes/sigma-H 迁移 2d1d22f057fe80ee8b5ec34e58e8c232"},{"text":"Simmons-Smith 环丙烷化反应","link":"/notes/Simmons-Smith 环丙烷化反应 2aad22f057fe80f28477cdde918c1bc8"},{"text":"Skraup 喹啉合成反应","items":[{"text":"Doebner-von Miller反应","link":"/notes/Skraup 喹啉合成反应/Doebner-von Miller反应 2aed22f057fe8049a686ea0a6af00d6b"}],"collapsed":true},{"text":"Skraup 喹啉合成反应","link":"/notes/Skraup 喹啉合成反应 2aed22f057fe80e2bd42cf2d24101191"},{"text":"Staudinger 烯酮环加成反应","link":"/notes/Staudinger 烯酮环加成反应 28ed22f057fe801fb75ce0a87f95a21f"},{"text":"Stephen还原","link":"/notes/Stephen还原 27ed22f057fe807c992be38fef079a7a"},{"text":"Stetter 反应","link":"/notes/Stetter 反应 297d22f057fe8051a308e9e3f1f0761f"},{"text":"Stobbe 缩合","link":"/notes/Stobbe 缩合 28dd22f057fe807fa82df388dfa23721"},{"text":"Suzuki-Miyaura 偶联反应","link":"/notes/Suzuki-Miyaura 偶联反应 28cd22f057fe80f888f5fc99779132d0"},{"text":"Swern 氧化","link":"/notes/Swern 氧化 2a8d22f057fe8028ad4bc6271428e853"},{"text":"Tiffeneau-Demjanov 重排","link":"/notes/Tiffeneau-Demjanov 重排 29dd22f057fe80adb887d4598bec7d10"},{"text":"Vilsmeier-Haack 甲酰化反应","link":"/notes/Vilsmeier-Haack 甲酰化反应 2a0d22f057fe8012940dd34dc95f81f5"},{"text":"Wagner-Meerwein重排","link":"/notes/Wagner-Meerwein重排 27ed22f057fe80c6bebdfcf41c30e7d9"},{"text":"Williamson合成法","link":"/notes/Williamson合成法 27ed22f057fe80fd8c77d79185a83def"},{"text":"Wittig 反应","link":"/notes/Wittig 反应 292d22f057fe803da80af85a7aa21e05"},{"text":"Wolff 重排","link":"/notes/Wolff 重排 28ed22f057fe800fb9c5cee05b7b6f04"},{"text":"Wolff-Kishner-Huang Minlon还原","link":"/notes/Wolff-Kishner-Huang Minlon还原 27ed22f057fe80c4bccbeafc5843c224"},{"text":"Woodward顺位双羟化反应","link":"/notes/Woodward顺位双羟化反应 28ed22f057fe80f6929de01634a5a06a"},{"text":"Wurtz反应","link":"/notes/Wurtz反应 27ed22f057fe80e58dc5f8f3639ac858"},{"text":"Zazarov 环化反应","link":"/notes/Zazarov 环化反应 2d1d22f057fe80b3a103f45283f462e8"},{"text":"Zincke 反应","link":"/notes/Zincke 反应 2a0d22f057fe8013b3caf1caae5e46be"},{"text":"Zinin 联苯胺重排反应","link":"/notes/Zinin 联苯胺重排反应 2a0d22f057fe80a4a63ffd50ef8bf2b8"},{"text":"Zinin 还原","link":"/notes/Zinin 还原 2a0d22f057fe809ca09eef1d821beb49"},{"text":"[1,2]-Wittig 重排","link":"/notes/[1,2]-Wittig 重排 2d1d22f057fe8056a406d11cc1991a6b"},{"text":"[2,3]-Wittig 重排","link":"/notes/[2,3]-Wittig 重排 2d1d22f057fe802ab8e5e298d8773709"},{"text":"α,β-不饱和醛酮加成","link":"/notes/α,β-不饱和醛酮加成 27dd22f057fe8080af05df0f90265c7b"},{"text":"α-H的烷基化","link":"/notes/α-H的烷基化 292d22f057fe80869199eef3cd18e268"},{"text":"α-H的酰基化","link":"/notes/α-H的酰基化 292d22f057fe8095a03cee3bd7bb2894"},{"text":"三叔丁氧基氢化铝锂还原","link":"/notes/三叔丁氧基氢化铝锂还原 27ed22f057fe8019b072df8fe8ebf758"},{"text":"不饱和卤代烃的催化氢化","link":"/notes/不饱和卤代烃的催化氢化 27ed22f057fe8078bb56f4e9c040e012"},{"text":"二卤卡宾与烯烃反应","link":"/notes/二卤卡宾与烯烃反应 27fd22f057fe801f8e35c2e99835b932"},{"text":"五元芳杂环的反应","link":"/notes/五元芳杂环的反应 2aed22f057fe806e853ee874a01b55ba"},{"text":"六元芳杂环的反应","link":"/notes/六元芳杂环的反应 2afd22f057fe800182aace2b1ae0ec88"},{"text":"卤代烃与金属反应","link":"/notes/卤代烃与金属反应 27ed22f057fe8021864eff92030ba3a0"},{"text":"卤代烃的偶联反应","link":"/notes/卤代烃的偶联反应 27ed22f057fe80c184b2f77d4a9f1dc0"},{"text":"卤代烃的催化氢化","link":"/notes/卤代烃的催化氢化 27ed22f057fe80dfb1bcf70eb7cfe02f"},{"text":"卤代烃的还原","link":"/notes/卤代烃的还原 27ed22f057fe802081d6c687c21f47d3"},{"text":"卤代烷的β-消除反应","link":"/notes/卤代烷的β-消除反应 27ed22f057fe802e8ad2e1144ffd0145"},{"text":"卤仿反应","link":"/notes/卤仿反应 27ed22f057fe80cfa066dd8398f31096"},{"text":"小环烷烃的开环","link":"/notes/小环烷烃的开环 27ed22f057fe80299946e0a8603563f3"},{"text":"末端炔烃与醛酮反应","link":"/notes/末端炔烃与醛酮反应 27fd22f057fe80e5b132dcde4e3298ba"},{"text":"末端炔烃的卤化","link":"/notes/末端炔烃的卤化 27fd22f057fe80f5bc94fa248ff604f6"},{"text":"末端炔烃的酸性","link":"/notes/末端炔烃的酸性 27fd22f057fe800c9b3de5d5bfd0c84c"},{"text":"杂环的电子","link":"/notes/杂环的电子 2aed22f057fe809daeeedd52ef202079"},{"text":"炔烃的一般氧化","link":"/notes/炔烃的一般氧化 27fd22f057fe802f9b36d3b5e94c6a36"},{"text":"炔烃的亲核加成","link":"/notes/炔烃的亲核加成 27fd22f057fe8075b641d0ddd7eeec43"},{"text":"炔烃的硼氢化氧化","link":"/notes/炔烃的硼氢化氧化 27fd22f057fe80d3a7f5f4f1a9ac6525"},{"text":"炔烃的硼氢化还原","link":"/notes/炔烃的硼氢化还原 27fd22f057fe805c9c2cde4c8d828ebc"},{"text":"炔烃的碱金属液氨还原","link":"/notes/炔烃的碱金属液氨还原 27fd22f057fe807281c1ef958329b824"},{"text":"炔烃的金属氢还原","link":"/notes/炔烃的金属氢还原 27fd22f057fe805fa94ef81bfb2387d8"},{"text":"炔烃臭氧化","link":"/notes/炔烃臭氧化 27fd22f057fe80449466c9ef982c5028"},{"text":"烯炔的亲电加成","link":"/notes/烯炔的亲电加成 27fd22f057fe80dab99ff4366cbf4138"},{"text":"烯炔的催化氢化","link":"/notes/烯炔的催化氢化 27fd22f057fe8094b0fcc8e9e67cbbba"},{"text":"烯炔的聚合","link":"/notes/烯炔的聚合 27fd22f057fe80a0b1d3c8578c567ccf"},{"text":"烯炔自由基加成反应","link":"/notes/烯炔自由基加成反应 27fd22f057fe80fbb928f84525596dd4"},{"text":"烯烃α-H卤化","link":"/notes/烯烃α-H卤化 27fd22f057fe80228f96c4c712394b06"},{"text":"烯烃与三线态卡宾反应","link":"/notes/烯烃与三线态卡宾反应 27fd22f057fe804f992ac93654656a93"},{"text":"烯烃与单线态卡宾反应","link":"/notes/烯烃与单线态卡宾反应 27fd22f057fe803db244fbfdca1bd159"},{"text":"烯烃与卤素加成","link":"/notes/烯烃与卤素加成 27fd22f057fe8001a8b0c3f000aaa77e"},{"text":"烯烃与次卤酸加成","link":"/notes/烯烃与次卤酸加成 27fd22f057fe806cbd44f160c525e073"},{"text":"烯烃与醇酚羧羟基加成","link":"/notes/烯烃与醇酚羧羟基加成 27fd22f057fe80d0a1ccc5b92989b97a"},{"text":"烯烃二亚胺还原","link":"/notes/烯烃二亚胺还原 27fd22f057fe808ba35be1f44bfd6be0"},{"text":"烯烃环氧化","link":"/notes/烯烃环氧化 27fd22f057fe80b2bc37fc4ce20bc7e4"},{"text":"烯烃的一般氧化","link":"/notes/烯烃的一般氧化 27fd22f057fe80b6b136cd3ca925493b"},{"text":"烯烃的硼氢化还原","link":"/notes/烯烃的硼氢化还原 27fd22f057fe806a8a2bf458beaecf0a"},{"text":"烯酮的制备","link":"/notes/烯酮的制备 28ed22f057fe8038be76e498b8ca7315"},{"text":"烷烃的亲核取代反应","link":"/notes/烷烃的亲核取代反应 27ed22f057fe80d3b0b0fb2429fc3db9"},{"text":"烷烃的卤化","link":"/notes/烷烃的卤化 27ed22f057fe80e19284f2b1a15e9e72"},{"text":"烷烃的硝化/磺化/氯磺化","link":"/notes/烷烃的硝化 磺化 氯磺化 27ed22f057fe8092a1b4dceccc5855bd"},{"text":"环加成反应","link":"/notes/环加成反应 289d22f057fe80ea98f8e505fb9b8579"},{"text":"环氧化物碱性开环反应","link":"/notes/环氧化物碱性开环反应 27ed22f057fe80d89933d04109d5d236"},{"text":"环氧化物酸性开环反应","link":"/notes/环氧化物酸性开环反应 27ed22f057fe806f9d1ad8980f2154ca"},{"text":"电环化反应","link":"/notes/电环化反应 289d22f057fe804ebc3ae86f06c0d6f3"},{"text":"羧酸的还原","link":"/notes/羧酸的还原 28bd22f057fe808dbe13d546e325b7b9"},{"text":"羧酸的酰卤化","link":"/notes/羧酸的酰卤化 28bd22f057fe803f9841dd21877876d6"},{"text":"羧酸的酰胺化","link":"/notes/羧酸的酰胺化 28bd22f057fe807a8ad9dcefa0c1e66a"},{"text":"羧酸衍生物与金属的反应","link":"/notes/羧酸衍生物与金属的反应 28dd22f057fe806e875ac2dd1a86bd40"},{"text":"羧酸衍生物和腈的醇解","link":"/notes/羧酸衍生物和腈的醇解 28dd22f057fe80fb9462ec99a4e38753"},{"text":"羧酸衍生物的氨（胺）解","link":"/notes/羧酸衍生物的氨（胺）解 28dd22f057fe801b8d83c56cc128ec91"},{"text":"羰基的亲核加成","link":"/notes/羰基的亲核加成 27ed22f057fe805f98a3c74a52b23283"},{"text":"脱羧反应","link":"/notes/脱羧反应 28bd22f057fe800ab3e0ed5dc713eb4b"},{"text":"邻二卤代烷失卤原子","link":"/notes/邻二卤代烷失卤原子 27ed22f057fe80ecac76d347a07f7f07"},{"text":"邻二醇的氧化","link":"/notes/邻二醇的氧化 27ed22f057fe80378085fd4e32f0dbe7"},{"text":"酮式分解与酸式分解","link":"/notes/酮式分解与酸式分解 292d22f057fe80cf90f0d172621e728a"},{"text":"酯化反应","link":"/notes/酯化反应 28bd22f057fe800cbfeedbf7b26b5e0e"},{"text":"酯的热裂","link":"/notes/酯的热裂 293d22f057fe80d1b1d8c696922fe2ec"},{"text":"醇与亚硫酰氯反应","link":"/notes/醇与亚硫酰氯反应 27ed22f057fe8087bb38d871f2736edd"},{"text":"醇与卤化磷反应","link":"/notes/醇与卤化磷反应 27ed22f057fe80fcb4affd5c44697c6f"},{"text":"醇与含氧无机酸/酰卤/酸酐反应","link":"/notes/醇与含氧无机酸 酰卤 酸酐反应 27ed22f057fe80c29463eb0e1efb8f31"},{"text":"醇与氢卤酸反应","link":"/notes/醇与氢卤酸反应 27ed22f057fe8088a4c3d0f942f544b2"},{"text":"醇分子间失水","link":"/notes/醇分子间失水 27ed22f057fe80aab426d8d409457d59"},{"text":"醇的β-消除","link":"/notes/醇的β-消除 27ed22f057fe80c7b017d76b6ddb297e"},{"text":"醇的一般氧化","link":"/notes/醇的一般氧化 27ed22f057fe8056a7eecc3ae3c9641b"},{"text":"醇的催化氧化","link":"/notes/醇的催化氧化 27ed22f057fe80d68acac30172dd4fd7"},{"text":"醇羟基的酸性","link":"/notes/醇羟基的酸性 27ed22f057fe8005be6bfcb63c5b1e52"},{"text":"醚与氢碘酸反应","link":"/notes/醚与氢碘酸反应 27ed22f057fe804ba4f4f4722ef27b70"},{"text":"醚的自动氧化","link":"/notes/醚的自动氧化 27ed22f057fe80768c46f6d6f782dc1d"},{"text":"醛自氧化","link":"/notes/醛自氧化 27ed22f057fe8072bb1af3012a358caa"},{"text":"醛酮α-H卤化","link":"/notes/醛酮α-H卤化 27ed22f057fe80ae97bacba924fdccf3"},{"text":"醛酮一般氧化","link":"/notes/醛酮一般氧化 27ed22f057fe8035a57ccf9519870715"},{"text":"醛酮二烃基铜锂还原","link":"/notes/醛酮二烃基铜锂还原 27ed22f057fe803ba024f511c4e872fd"},{"text":"醛酮催化氢化","link":"/notes/醛酮催化氢化 27ed22f057fe808993d6c441681f57da"},{"text":"醛酮有机镉试剂还原","link":"/notes/醛酮有机镉试剂还原 27ed22f057fe80619e96c8b33109c831"},{"text":"醛酮氢化金属还原","link":"/notes/醛酮氢化金属还原 27ed22f057fe80bcabc4cdf19402142f"},{"text":"醛酮活泼金属单分子还原","link":"/notes/醛酮活泼金属单分子还原 27ed22f057fe80a98f79f6dec52027c1"},{"text":"醛酮活泼金属双分子还原","link":"/notes/醛酮活泼金属双分子还原 27ed22f057fe807b8596ecc49f3d4c13"}],"/tools/":[{"text":"4k谱面查询器","link":"/tools/osu展示"},{"text":"OXTI ","link":"/tools/OXTI"},{"text":"年度色彩回顾工具","link":"/tools/年度色彩回顾工具"},{"text":"色彩偏好分析","link":"/tools/色彩偏好分析"},{"text":"色相图工具","link":"/tools/色相图"}],"/bots/":[{"text":"Local Quotes System (LQS) \\\\- 语录系统使用手册","link":"/bots/LocalQuotesSystem"},{"text":"Maimai Random Helper \\\\- 舞萌随机查歌使用手册","link":"/bots/MaimaiRandomHelper"},{"text":"Multi-Media Cover Extractor (MCE) \\\\- 多媒体封面提取插件使用手册","link":"/bots/Multi-MediaCoverExtractor"}],"/music/":[{"text":"26.2.21-第1周","link":"/music/26.2.21-第1周"},{"text":"2x.x.xx-第0周","link":"/music/2x.x.xx-第0周"}]},"search":{"provider":"local"},"socialLinks":[{"icon":"github","link":"https://github.com/Virtual-NeutroN"}],"footer":{"message":"基于 MIT 许可发布。","copyright":"© 2026 OrganxyLab. All rights reserved.<br><a href=\\"/user_agreement\\">用户协议</a> <a href=\\"/privacy_policy\\">隐私政策</a>"},"docFooter":{"prev":"上一页","next":"下一页"},"lastUpdated":{"text":"最后更新于","formatOptions":{"dateStyle":"short","timeStyle":"short"}}},"locales":{},"scrollOffset":134,"cleanUrls":false}'));
const __vite_import_meta_env__ = {};
const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i;
const APPEARANCE_KEY = "vitepress-theme-appearance";
const HASH_RE = /#.*$/;
const HASH_OR_QUERY_RE = /[?#].*$/;
const INDEX_OR_EXT_RE = /(?:(^|\/)index)?\.(?:md|html)$/;
const inBrowser = typeof document !== "undefined";
const notFoundPageData = {
  relativePath: "404.md",
  filePath: "",
  title: "404",
  description: "Not Found",
  headers: [],
  frontmatter: { sidebar: false, layout: "page" },
  lastUpdated: 0,
  isNotFound: true
};
function isActive(currentPath, matchPath, asRegex = false) {
  if (matchPath === void 0) {
    return false;
  }
  currentPath = normalize(`/${currentPath}`);
  if (asRegex) {
    return new RegExp(matchPath).test(currentPath);
  }
  if (normalize(matchPath) !== currentPath) {
    return false;
  }
  const hashMatch = matchPath.match(HASH_RE);
  if (hashMatch) {
    return (inBrowser ? location.hash : "") === hashMatch[0];
  }
  return true;
}
function normalize(path) {
  return decodeURI(path).replace(HASH_OR_QUERY_RE, "").replace(INDEX_OR_EXT_RE, "$1");
}
function isExternal(path) {
  return EXTERNAL_URL_RE.test(path);
}
function getLocaleForPath(siteData2, relativePath) {
  return Object.keys((siteData2 == null ? void 0 : siteData2.locales) || {}).find((key) => key !== "root" && !isExternal(key) && isActive(relativePath, `/${key}/`, true)) || "root";
}
function resolveSiteDataByRoute(siteData2, relativePath) {
  var _a, _b, _c, _d, _e, _f, _g;
  const localeIndex = getLocaleForPath(siteData2, relativePath);
  return Object.assign({}, siteData2, {
    localeIndex,
    lang: ((_a = siteData2.locales[localeIndex]) == null ? void 0 : _a.lang) ?? siteData2.lang,
    dir: ((_b = siteData2.locales[localeIndex]) == null ? void 0 : _b.dir) ?? siteData2.dir,
    title: ((_c = siteData2.locales[localeIndex]) == null ? void 0 : _c.title) ?? siteData2.title,
    titleTemplate: ((_d = siteData2.locales[localeIndex]) == null ? void 0 : _d.titleTemplate) ?? siteData2.titleTemplate,
    description: ((_e = siteData2.locales[localeIndex]) == null ? void 0 : _e.description) ?? siteData2.description,
    head: mergeHead(siteData2.head, ((_f = siteData2.locales[localeIndex]) == null ? void 0 : _f.head) ?? []),
    themeConfig: {
      ...siteData2.themeConfig,
      ...(_g = siteData2.locales[localeIndex]) == null ? void 0 : _g.themeConfig
    }
  });
}
function createTitle(siteData2, pageData) {
  const title = pageData.title || siteData2.title;
  const template = pageData.titleTemplate ?? siteData2.titleTemplate;
  if (typeof template === "string" && template.includes(":title")) {
    return template.replace(/:title/g, title);
  }
  const templateString = createTitleTemplate(siteData2.title, template);
  if (title === templateString.slice(3)) {
    return title;
  }
  return `${title}${templateString}`;
}
function createTitleTemplate(siteTitle, template) {
  if (template === false) {
    return "";
  }
  if (template === true || template === void 0) {
    return ` | ${siteTitle}`;
  }
  if (siteTitle === template) {
    return "";
  }
  return ` | ${template}`;
}
function hasTag(head, tag) {
  const [tagType, tagAttrs] = tag;
  if (tagType !== "meta")
    return false;
  const keyAttr = Object.entries(tagAttrs)[0];
  if (keyAttr == null)
    return false;
  return head.some(([type, attrs]) => type === tagType && attrs[keyAttr[0]] === keyAttr[1]);
}
function mergeHead(prev, curr) {
  return [...prev.filter((tagAttrs) => !hasTag(curr, tagAttrs)), ...curr];
}
const INVALID_CHAR_REGEX = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g;
const DRIVE_LETTER_REGEX = /^[a-z]:/i;
function sanitizeFileName(name) {
  const match = DRIVE_LETTER_REGEX.exec(name);
  const driveLetter = match ? match[0] : "";
  return driveLetter + name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, "_").replace(/(^|\/)_+(?=[^/]*$)/, "$1");
}
const KNOWN_EXTENSIONS = /* @__PURE__ */ new Set();
function treatAsHtml(filename) {
  var _a;
  if (KNOWN_EXTENSIONS.size === 0) {
    const extraExts = typeof process === "object" && ((_a = process.env) == null ? void 0 : _a.VITE_EXTRA_EXTENSIONS) || (__vite_import_meta_env__ == null ? void 0 : __vite_import_meta_env__.VITE_EXTRA_EXTENSIONS) || "";
    ("3g2,3gp,aac,ai,apng,au,avif,bin,bmp,cer,class,conf,crl,css,csv,dll,doc,eps,epub,exe,gif,gz,ics,ief,jar,jpe,jpeg,jpg,js,json,jsonld,m4a,man,mid,midi,mjs,mov,mp2,mp3,mp4,mpe,mpeg,mpg,mpp,oga,ogg,ogv,ogx,opus,otf,p10,p7c,p7m,p7s,pdf,png,ps,qt,roff,rtf,rtx,ser,svg,t,tif,tiff,tr,ts,tsv,ttf,txt,vtt,wav,weba,webm,webp,woff,woff2,xhtml,xml,yaml,yml,zip" + (extraExts && typeof extraExts === "string" ? "," + extraExts : "")).split(",").forEach((ext2) => KNOWN_EXTENSIONS.add(ext2));
  }
  const ext = filename.split(".").pop();
  return ext == null || !KNOWN_EXTENSIONS.has(ext.toLowerCase());
}
function escapeRegExp(str) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
const dataSymbol = Symbol();
const siteDataRef = shallowRef(siteData);
function initData(route) {
  const site = computed(() => resolveSiteDataByRoute(siteDataRef.value, route.data.relativePath));
  const appearance = site.value.appearance;
  const isDark = appearance === "force-dark" ? ref(true) : appearance === "force-auto" ? usePreferredDark() : appearance ? useDark({
    storageKey: APPEARANCE_KEY,
    initialValue: () => appearance === "dark" ? "dark" : "auto",
    ...typeof appearance === "object" ? appearance : {}
  }) : ref(false);
  const hashRef = ref(inBrowser ? location.hash : "");
  if (inBrowser) {
    window.addEventListener("hashchange", () => {
      hashRef.value = location.hash;
    });
  }
  watch(() => route.data, () => {
    hashRef.value = inBrowser ? location.hash : "";
  });
  return {
    site,
    theme: computed(() => site.value.themeConfig),
    page: computed(() => route.data),
    frontmatter: computed(() => route.data.frontmatter),
    params: computed(() => route.data.params),
    lang: computed(() => site.value.lang),
    dir: computed(() => route.data.frontmatter.dir || site.value.dir),
    localeIndex: computed(() => site.value.localeIndex || "root"),
    title: computed(() => createTitle(site.value, route.data)),
    description: computed(() => route.data.description || site.value.description),
    isDark,
    hash: computed(() => hashRef.value)
  };
}
function useData() {
  const data = inject(dataSymbol);
  if (!data) {
    throw new Error("vitepress data not properly injected in app");
  }
  return data;
}
function joinPath(base, path) {
  return `${base}${path}`.replace(/\/+/g, "/");
}
function withBase(path) {
  return EXTERNAL_URL_RE.test(path) || !path.startsWith("/") ? path : joinPath(siteDataRef.value.base, path);
}
function pathToFile(path) {
  let pagePath = path.replace(/\.html$/, "");
  pagePath = decodeURIComponent(pagePath);
  pagePath = pagePath.replace(/\/$/, "/index");
  {
    if (inBrowser) {
      const base = "/";
      pagePath = sanitizeFileName(pagePath.slice(base.length).replace(/\//g, "_") || "index") + ".md";
      let pageHash = __VP_HASH_MAP__[pagePath.toLowerCase()];
      if (!pageHash) {
        pagePath = pagePath.endsWith("_index.md") ? pagePath.slice(0, -9) + ".md" : pagePath.slice(0, -3) + "_index.md";
        pageHash = __VP_HASH_MAP__[pagePath.toLowerCase()];
      }
      if (!pageHash)
        return null;
      pagePath = `${base}${"assets"}/${pagePath}.${pageHash}.js`;
    } else {
      pagePath = `./${sanitizeFileName(pagePath.slice(1).replace(/\//g, "_"))}.md.js`;
    }
  }
  return pagePath;
}
let contentUpdatedCallbacks = [];
function onContentUpdated(fn) {
  contentUpdatedCallbacks.push(fn);
  onUnmounted(() => {
    contentUpdatedCallbacks = contentUpdatedCallbacks.filter((f) => f !== fn);
  });
}
function getScrollOffset() {
  let scrollOffset = siteDataRef.value.scrollOffset;
  let offset = 0;
  let padding = 24;
  if (typeof scrollOffset === "object" && "padding" in scrollOffset) {
    padding = scrollOffset.padding;
    scrollOffset = scrollOffset.selector;
  }
  if (typeof scrollOffset === "number") {
    offset = scrollOffset;
  } else if (typeof scrollOffset === "string") {
    offset = tryOffsetSelector(scrollOffset, padding);
  } else if (Array.isArray(scrollOffset)) {
    for (const selector of scrollOffset) {
      const res = tryOffsetSelector(selector, padding);
      if (res) {
        offset = res;
        break;
      }
    }
  }
  return offset;
}
function tryOffsetSelector(selector, padding) {
  const el = document.querySelector(selector);
  if (!el)
    return 0;
  const bot = el.getBoundingClientRect().bottom;
  if (bot < 0)
    return 0;
  return bot + padding;
}
const RouterSymbol = Symbol();
const fakeHost = "http://a.com";
const getDefaultRoute = () => ({
  path: "/",
  component: null,
  data: notFoundPageData
});
function createRouter(loadPageModule, fallbackComponent) {
  const route = reactive(getDefaultRoute());
  const router = {
    route,
    go
  };
  async function go(href = inBrowser ? location.href : "/") {
    var _a, _b;
    href = normalizeHref(href);
    if (await ((_a = router.onBeforeRouteChange) == null ? void 0 : _a.call(router, href)) === false)
      return;
    if (inBrowser && href !== normalizeHref(location.href)) {
      history.replaceState({ scrollPosition: window.scrollY }, "");
      history.pushState({}, "", href);
    }
    await loadPage(href);
    await ((_b = router.onAfterRouteChange ?? router.onAfterRouteChanged) == null ? void 0 : _b(href));
  }
  let latestPendingPath = null;
  async function loadPage(href, scrollPosition = 0, isRetry = false) {
    var _a, _b;
    if (await ((_a = router.onBeforePageLoad) == null ? void 0 : _a.call(router, href)) === false)
      return;
    const targetLoc = new URL(href, fakeHost);
    const pendingPath = latestPendingPath = targetLoc.pathname;
    try {
      let page = await loadPageModule(pendingPath);
      if (!page) {
        throw new Error(`Page not found: ${pendingPath}`);
      }
      if (latestPendingPath === pendingPath) {
        latestPendingPath = null;
        const { default: comp, __pageData } = page;
        if (!comp) {
          throw new Error(`Invalid route component: ${comp}`);
        }
        await ((_b = router.onAfterPageLoad) == null ? void 0 : _b.call(router, href));
        route.path = inBrowser ? pendingPath : withBase(pendingPath);
        route.component = markRaw(comp);
        route.data = true ? markRaw(__pageData) : readonly(__pageData);
        if (inBrowser) {
          nextTick(() => {
            let actualPathname = siteDataRef.value.base + __pageData.relativePath.replace(/(?:(^|\/)index)?\.md$/, "$1");
            if (!siteDataRef.value.cleanUrls && !actualPathname.endsWith("/")) {
              actualPathname += ".html";
            }
            if (actualPathname !== targetLoc.pathname) {
              targetLoc.pathname = actualPathname;
              href = actualPathname + targetLoc.search + targetLoc.hash;
              history.replaceState({}, "", href);
            }
            if (targetLoc.hash && !scrollPosition) {
              let target = null;
              try {
                target = document.getElementById(decodeURIComponent(targetLoc.hash).slice(1));
              } catch (e) {
                console.warn(e);
              }
              if (target) {
                scrollTo(target, targetLoc.hash);
                return;
              }
            }
            window.scrollTo(0, scrollPosition);
          });
        }
      }
    } catch (err) {
      if (!/fetch|Page not found/.test(err.message) && !/^\/404(\.html|\/)?$/.test(href)) {
        console.error(err);
      }
      if (!isRetry) {
        try {
          const res = await fetch(siteDataRef.value.base + "hashmap.json");
          window.__VP_HASH_MAP__ = await res.json();
          await loadPage(href, scrollPosition, true);
          return;
        } catch (e) {
        }
      }
      if (latestPendingPath === pendingPath) {
        latestPendingPath = null;
        route.path = inBrowser ? pendingPath : withBase(pendingPath);
        route.component = fallbackComponent ? markRaw(fallbackComponent) : null;
        const relativePath = inBrowser ? pendingPath.replace(/(^|\/)$/, "$1index").replace(/(\.html)?$/, ".md").replace(/^\//, "") : "404.md";
        route.data = { ...notFoundPageData, relativePath };
      }
    }
  }
  if (inBrowser) {
    if (history.state === null) {
      history.replaceState({}, "");
    }
    window.addEventListener("click", (e) => {
      if (e.defaultPrevented || !(e.target instanceof Element) || e.target.closest("button") || // temporary fix for docsearch action buttons
      e.button !== 0 || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey)
        return;
      const link = e.target.closest("a");
      if (!link || link.closest(".vp-raw") || link.hasAttribute("download") || link.hasAttribute("target"))
        return;
      const linkHref = link.getAttribute("href") ?? (link instanceof SVGAElement ? link.getAttribute("xlink:href") : null);
      if (linkHref == null)
        return;
      const { href, origin, pathname, hash, search } = new URL(linkHref, link.baseURI);
      const currentUrl = new URL(location.href);
      if (origin === currentUrl.origin && treatAsHtml(pathname)) {
        e.preventDefault();
        if (pathname === currentUrl.pathname && search === currentUrl.search) {
          if (hash !== currentUrl.hash) {
            history.pushState({}, "", href);
            window.dispatchEvent(new HashChangeEvent("hashchange", {
              oldURL: currentUrl.href,
              newURL: href
            }));
          }
          if (hash) {
            scrollTo(link, hash, link.classList.contains("header-anchor"));
          } else {
            window.scrollTo(0, 0);
          }
        } else {
          go(href);
        }
      }
    }, { capture: true });
    window.addEventListener("popstate", async (e) => {
      var _a;
      if (e.state === null)
        return;
      const href = normalizeHref(location.href);
      await loadPage(href, e.state && e.state.scrollPosition || 0);
      await ((_a = router.onAfterRouteChange ?? router.onAfterRouteChanged) == null ? void 0 : _a(href));
    });
    window.addEventListener("hashchange", (e) => {
      e.preventDefault();
    });
  }
  return router;
}
function useRouter() {
  const router = inject(RouterSymbol);
  if (!router) {
    throw new Error("useRouter() is called without provider.");
  }
  return router;
}
function useRoute() {
  return useRouter().route;
}
function scrollTo(el, hash, smooth = false) {
  let target = null;
  try {
    target = el.classList.contains("header-anchor") ? el : document.getElementById(decodeURIComponent(hash).slice(1));
  } catch (e) {
    console.warn(e);
  }
  if (target) {
    let scrollToTarget = function() {
      if (!smooth || Math.abs(targetTop - window.scrollY) > window.innerHeight)
        window.scrollTo(0, targetTop);
      else
        window.scrollTo({ left: 0, top: targetTop, behavior: "smooth" });
    };
    const targetPadding = parseInt(window.getComputedStyle(target).paddingTop, 10);
    const targetTop = window.scrollY + target.getBoundingClientRect().top - getScrollOffset() + targetPadding;
    requestAnimationFrame(scrollToTarget);
  }
}
function normalizeHref(href) {
  const url = new URL(href, fakeHost);
  url.pathname = url.pathname.replace(/(^|\/)index(\.html)?$/, "$1");
  if (siteDataRef.value.cleanUrls)
    url.pathname = url.pathname.replace(/\.html$/, "");
  else if (!url.pathname.endsWith("/") && !url.pathname.endsWith(".html"))
    url.pathname += ".html";
  return url.pathname + url.search + url.hash;
}
const runCbs = () => contentUpdatedCallbacks.forEach((fn) => fn());
const Content = defineComponent({
  name: "VitePressContent",
  props: {
    as: { type: [Object, String], default: "div" }
  },
  setup(props) {
    const route = useRoute();
    const { frontmatter, site } = useData();
    watch(frontmatter, runCbs, { deep: true, flush: "post" });
    return () => h(props.as, site.value.contentProps ?? { style: { position: "relative" } }, [
      route.component ? h(route.component, {
        onVnodeMounted: runCbs,
        onVnodeUpdated: runCbs,
        onVnodeUnmounted: runCbs
      }) : "404 Page Not Found"
    ]);
  }
});
export {
  Content as C,
  EXTERNAL_URL_RE as E,
  RouterSymbol as R,
  useRoute as a,
  initData as b,
  createTitle as c,
  dataSymbol as d,
  createRouter as e,
  isExternal as f,
  isActive as g,
  getScrollOffset as h,
  inBrowser as i,
  useRouter as j,
  escapeRegExp as k,
  mergeHead as m,
  onContentUpdated as o,
  pathToFile as p,
  siteDataRef as s,
  treatAsHtml as t,
  useData as u,
  withBase as w
};
