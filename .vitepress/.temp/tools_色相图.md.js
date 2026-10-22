import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderStyle } from "vue/server-renderer";
import { ref, computed, watch, nextTick, onMounted, mergeProps, unref, useSSRContext } from "vue";
import { Sliders, Palette, Type, Trash2, Upload, Download, Image as Image$1, X, Sun, RefreshCcw } from "lucide-vue-next";
const _sfc_main$1 = {
  __name: "HueWindRose",
  __ssrInlineRender: true,
  setup(__props) {
    const rgbToHex = (r, g, b) => {
      return "#" + [r, g, b].map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      }).join("");
    };
    const rgbToHsl = (r, g, b) => {
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }
      return [h, s, l];
    };
    const colorDistance = (color1, color2) => {
      return Math.sqrt(
        Math.pow(color1[0] - color2[0], 2) + Math.pow(color1[1] - color2[1], 2) + Math.pow(color1[2] - color2[2], 2)
      );
    };
    const extractColorsFromImage = (imgElement, colorCount = 15) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const width = 200;
      const height = 200;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(imgElement, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height).data;
      const pixelColors = [];
      for (let i = 0; i < imageData.length; i += 4 * 3) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];
        if (a < 128) continue;
        pixelColors.push([r, g, b]);
      }
      const quantized = [];
      const threshold = 20;
      pixelColors.forEach((color) => {
        let found = false;
        for (let i = 0; i < quantized.length; i++) {
          if (colorDistance(color, quantized[i].color) < threshold) {
            quantized[i].count++;
            found = true;
            break;
          }
        }
        if (!found) {
          quantized.push({ color, count: 1 });
        }
      });
      quantized.sort((a, b) => b.count - a.count);
      return quantized.slice(0, colorCount).map((item) => {
        const [r, g, b] = item.color;
        return {
          rgb: item.color,
          hex: rgbToHex(r, g, b),
          hsl: rgbToHsl(r, g, b),
          count: item.count
        };
      });
    };
    const computeHueSectors = (colors, sectorWidthDeg2) => {
      var _a;
      if (!colors || colors.length === 0) return [];
      const sectorCount = Math.ceil(360 / sectorWidthDeg2);
      const sectors = [];
      for (let i = 0; i < sectorCount; i++) {
        const startHue = i * sectorWidthDeg2 / 360;
        const endHue = (i + 1) * sectorWidthDeg2 / 360;
        const sectorColors = colors.filter((c) => {
          const h = c.hsl[0];
          if (endHue > 1) {
            return h >= startHue || h < endHue - 1;
          }
          return h >= startHue && h < endHue;
        });
        const midHue = (i + 0.5) * sectorWidthDeg2;
        const hueColor = `hsl(${midHue}, 70%, 55%)`;
        if (sectorColors.length === 0) {
          sectors.push({
            index: i,
            startAngle: i * sectorWidthDeg2 * Math.PI / 180,
            endAngle: (i + 1) * sectorWidthDeg2 * Math.PI / 180,
            midAngle: (i + 0.5) * sectorWidthDeg2 * Math.PI / 180,
            startHue: i * sectorWidthDeg2,
            endHue: (i + 1) * sectorWidthDeg2,
            count: 0,
            frequency: 0,
            avgSaturation: 0,
            avgLightness: 0,
            hueColor,
            colors: []
          });
          continue;
        }
        const totalCount = sectorColors.reduce((sum, c) => sum + (c.count || 1), 0);
        const avgS = sectorColors.reduce((sum, c) => sum + c.hsl[1] * (c.count || 1), 0) / totalCount;
        const avgL = sectorColors.reduce((sum, c) => sum + c.hsl[2] * (c.count || 1), 0) / totalCount;
        sectors.push({
          index: i,
          startAngle: i * sectorWidthDeg2 * Math.PI / 180,
          endAngle: (i + 1) * sectorWidthDeg2 * Math.PI / 180,
          midAngle: (i + 0.5) * sectorWidthDeg2 * Math.PI / 180,
          startHue: i * sectorWidthDeg2,
          endHue: (i + 1) * sectorWidthDeg2,
          count: sectorColors.length,
          totalPixelCount: totalCount,
          frequency: totalCount,
          avgSaturation: avgS,
          avgLightness: avgL,
          hueColor,
          colors: sectorColors,
          sampleHex: ((_a = sectorColors[0]) == null ? void 0 : _a.hex) || "#888"
        });
      }
      const maxFreq = Math.max(...sectors.map((s) => s.frequency), 1);
      sectors.forEach((s) => {
        s.frequencyNorm = s.frequency / maxFreq;
      });
      return sectors;
    };
    const DIVISION_OPTIONS = [6, 8, 12, 16, 18, 24, 32, 48, 60, 64, 72, 96, 120, 128, 144, 180];
    const images = ref([]);
    const isProcessing = ref(false);
    const isDragging = ref(false);
    ref(null);
    const chartCanvasRef = ref(null);
    const canvasWrapperRef = ref(null);
    const sampleCount = ref(15);
    const divisionIndex = ref(5);
    const divisions = computed(() => DIVISION_OPTIONS[divisionIndex.value]);
    const sectorWidthDeg = computed(() => 360 / divisions.value);
    const displayMode = ref("frequency");
    const showLabels = ref(true);
    watch(divisions, (val) => {
      if (val >= 60) showLabels.value = false;
    });
    const processSingleFile = (fileOrUrl) => {
      return new Promise((resolve, reject) => {
        if (fileOrUrl instanceof File) {
          const reader = new FileReader();
          reader.onload = (e) => {
            loadImageAndExtract(e.target.result, fileOrUrl.name, resolve, reject);
          };
          reader.readAsDataURL(fileOrUrl);
        } else {
          loadImageAndExtract(fileOrUrl.src, fileOrUrl.name, resolve, reject, fileOrUrl.id);
        }
      });
    };
    const loadImageAndExtract = (src, name, resolve, reject, existingId = null) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const colors = extractColorsFromImage(img, sampleCount.value);
        resolve({
          id: existingId || Math.random().toString(36).substr(2, 9),
          name,
          src,
          colors
        });
      };
      img.onerror = reject;
    };
    const allColors = computed(() => {
      return images.value.flatMap((img) => img.colors);
    });
    const sectorData = computed(() => {
      return computeHueSectors(allColors.value, sectorWidthDeg.value);
    });
    const activeSectors = computed(() => sectorData.value.filter((s) => s.count > 0));
    function drawWindRose(canvas, sectors, mode) {
      const ctx = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#121218";
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2 + 40;
      const maxRadius = Math.min(cx, cy) - 80;
      const innerRadius = maxRadius * 0.18;
      const ringWidth = maxRadius - innerRadius;
      const guideSteps = 4;
      ctx.strokeStyle = "#2a2a3a";
      ctx.lineWidth = 1;
      for (let i = 1; i <= guideSteps; i++) {
        const r = innerRadius + ringWidth * i / guideSteps;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.strokeStyle = "#3a3a4a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, cy - maxRadius);
      ctx.stroke();
      if (sectors.length === 0) {
        ctx.fillStyle = "#50556e";
        ctx.font = "18px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("暂无数据 - 请导入图片", cx, cy + 6);
        return;
      }
      const barPadding = 0.85;
      sectors.forEach((sector) => {
        const startAngle = -Math.PI / 2 + sector.startAngle;
        const endAngle = -Math.PI / 2 + sector.endAngle;
        const angleSpan = (endAngle - startAngle) * barPadding;
        const anglePad = (endAngle - startAngle) * (1 - barPadding) / 2;
        const barStart = startAngle + anglePad;
        const barEnd = barStart + angleSpan;
        let radiusFactor;
        const freq = sector.frequencyNorm || 0;
        const sat = sector.avgSaturation || 0;
        const lig = sector.avgLightness || 0.5;
        switch (mode) {
          case "frequency":
            radiusFactor = 0.15 + freq * 0.85;
            break;
          case "saturation":
            radiusFactor = 0.15 + sat * 0.85;
            break;
          case "lightness":
            radiusFactor = 0.15 + lig * 0.85;
            break;
          case "combined":
          default:
            radiusFactor = 0.15 + freq * 0.85;
            break;
        }
        const outerR = innerRadius + ringWidth * radiusFactor;
        let fillColor;
        if (mode === "saturation") {
          const satAlpha = Math.max(0.2, sector.avgSaturation);
          fillColor = `hsla(${(sector.startHue + sector.endHue) / 2}, 80%, 55%, ${satAlpha})`;
        } else if (mode === "lightness") {
          const ligVal = Math.max(15, sector.avgLightness * 80 + 15);
          fillColor = `hsl(${(sector.startHue + sector.endHue) / 2}, 70%, ${ligVal}%)`;
        } else {
          fillColor = `hsl(${(sector.startHue + sector.endHue) / 2}, 80%, 55%)`;
        }
        ctx.beginPath();
        ctx.moveTo(cx + innerRadius * Math.cos(barStart), cy + innerRadius * Math.sin(barStart));
        ctx.arc(cx, cy, outerR, barStart, barEnd);
        ctx.lineTo(cx + innerRadius * Math.cos(barEnd), cy + innerRadius * Math.sin(barEnd));
        ctx.arc(cx, cy, innerRadius, barEnd, barStart, true);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
        if (showLabels.value && sector.count > 0) {
          const labelAngle = -Math.PI / 2 + sector.midAngle;
          const labelRadius = outerR + 18;
          const labelX2 = cx + labelRadius * Math.cos(labelAngle);
          const labelY2 = cy + labelRadius * Math.sin(labelAngle);
          ctx.fillStyle = "#c8cddc";
          ctx.font = "11px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`${sector.count}`, labelX2, labelY2);
        }
      });
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerRadius);
      grad.addColorStop(0, "#1e1e2a");
      grad.addColorStop(1, "#121218");
      ctx.beginPath();
      ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "#2a2a3a";
      ctx.lineWidth = 1;
      ctx.stroke();
      const active = sectors.filter((s) => s.count > 0).length;
      ctx.fillStyle = "#adbde1";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${active}`, cx, cy - 8);
      ctx.fillStyle = "#646982";
      ctx.font = "11px sans-serif";
      ctx.fillText("活跃扇区", cx, cy + 16);
      drawLegend(ctx, sectors, w, mode);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("色相玫瑰图 · Hue Wind Rose", 20, 16);
      ctx.fillStyle = "#646982";
      ctx.font = "12px sans-serif";
      ctx.fillText(`${divisions.value}等分 (${Math.round(sectorWidthDeg.value * 10) / 10}°/扇区) · 总计 ${allColors.value.length} 色彩样本`, 20, 38);
    }
    function drawLegend(ctx, sectors, canvasWidth, mode) {
      const lx = canvasWidth - 180;
      const ly = 20;
      const legendH = 70;
      ctx.fillStyle = "#2a2a3a";
      ctx.fillRect(lx - 12, ly - 6, 180, legendH);
      ctx.fillStyle = "#8c91a0";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      const modeLabels = {
        "frequency": "频率 (半径)",
        "saturation": "平均饱和度",
        "lightness": "平均明度",
        "combined": "频率 + 饱和度"
      };
      ctx.fillText(modeLabels[mode] || mode, lx, ly + 2);
      if (sectors.length > 0) {
        const bandY = 52;
        const bandH = 12;
        const bandW = 156;
        const sectorW = bandW / sectors.length;
        for (let i = 0; i < sectors.length; i++) {
          const hue = (sectors[i].startHue + sectors[i].endHue) / 2;
          ctx.fillStyle = `hsl(${hue}, 80%, 55%)`;
          ctx.fillRect(lx + i * sectorW, ly + bandY, sectorW + 0.5, bandH);
        }
        ctx.fillStyle = "#50556e";
        ctx.font = "9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("0°", lx, ly + bandY + bandH + 2);
        ctx.fillText("360°", lx + bandW, ly + bandY + bandH + 2);
      }
    }
    function renderChart() {
      const canvas = chartCanvasRef.value;
      if (!canvas) return;
      const wrapper = canvasWrapperRef.value;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = Math.max(rect.width, 300);
      const displayHeight = displayWidth;
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = displayWidth + "px";
      canvas.style.height = displayHeight + "px";
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      drawWindRose(canvas, sectorData.value, displayMode.value);
    }
    watch([sectorData, displayMode, showLabels], () => {
      nextTick(renderChart);
    }, { deep: true });
    watch(divisionIndex, () => {
      nextTick(renderChart);
    });
    watch(sampleCount, async (newCount) => {
      if (images.value.length === 0) return;
      isProcessing.value = true;
      try {
        const processed = await Promise.all(
          images.value.map((img) => processSingleFile({ src: img.src, name: img.name, id: img.id }))
        );
        images.value = processed;
      } catch (err) {
        console.error("Error reprocessing images", err);
      } finally {
        isProcessing.value = false;
      }
    });
    let resizeObserver = null;
    onMounted(() => {
      const wrapper = canvasWrapperRef.value;
      if (!wrapper) {
        setTimeout(renderChart, 500);
        window.addEventListener("resize", renderChart);
        return;
      }
      let stableCheckTimer = null;
      let lastWidth = 0;
      resizeObserver = new ResizeObserver((entries) => {
        var _a, _b, _c;
        const entry = entries[0];
        if (!entry) return;
        const currentWidth = ((_b = (_a = entry.contentBoxSize) == null ? void 0 : _a[0]) == null ? void 0 : _b.inlineSize) || ((_c = entry.contentRect) == null ? void 0 : _c.width) || 0;
        if (currentWidth <= 0) return;
        if (Math.abs(currentWidth - lastWidth) > 1) {
          lastWidth = currentWidth;
          if (stableCheckTimer) clearTimeout(stableCheckTimer);
          stableCheckTimer = setTimeout(() => {
            renderChart();
          }, 50);
        }
      });
      resizeObserver.observe(wrapper);
      setTimeout(renderChart, 5e3);
      nextTick(() => {
        renderChart();
      });
      window.addEventListener("resize", () => {
        if (stableCheckTimer) clearTimeout(stableCheckTimer);
        stableCheckTimer = setTimeout(renderChart, 100);
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["wind-rose-container bg-neutral-900 text-white p-3 sm:p-5 font-sans transition-colors duration-200 rounded-xl w-full", { "bg-neutral-800 ring-4 ring-indigo-500/50": isDragging.value }]
      }, _attrs))}><div class="w-full space-y-5"><header class="flex flex-col gap-3 bg-neutral-800/50 p-3 sm:p-5 rounded-2xl border border-neutral-800"><div class="flex flex-wrap items-center gap-2 sm:gap-3"><div class="flex items-center gap-2 sm:gap-3 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-700"><div class="flex items-center gap-1.5 text-xs font-medium text-neutral-300 whitespace-nowrap">`);
      _push(ssrRenderComponent(unref(Sliders), { size: 14 }, null, _parent));
      _push(`<span>等分:</span><span class="text-indigo-400 font-bold min-w-[32px] text-center">${ssrInterpolate(divisions.value)}</span></div><input type="range" min="0"${ssrRenderAttr("max", DIVISION_OPTIONS.length - 1)} step="1"${ssrRenderAttr("value", divisionIndex.value)} class="w-20 sm:w-28 h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"></div><div class="flex items-center gap-2 sm:gap-3 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-700"><div class="flex items-center gap-1.5 text-xs font-medium text-neutral-300 whitespace-nowrap">`);
      _push(ssrRenderComponent(unref(Palette), { size: 14 }, null, _parent));
      _push(`<span>色样:</span><span class="text-indigo-400 font-bold min-w-[20px] text-center">${ssrInterpolate(sampleCount.value)}</span></div><input type="range" min="1" max="30" step="1"${ssrRenderAttr("value", sampleCount.value)} class="w-16 sm:w-24 h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"></div><button class="${ssrRenderClass([showLabels.value ? "bg-indigo-600 text-white border-indigo-500" : "bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white hover:bg-neutral-700", "px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 border"])}">`);
      _push(ssrRenderComponent(unref(Type), { size: 12 }, null, _parent));
      _push(`<span>${ssrInterpolate(showLabels.value ? "标签开" : "标签关")}</span></button></div><div class="flex flex-wrap items-center gap-2 sm:gap-3"><div class="flex items-center gap-0.5 bg-neutral-900 px-1.5 py-1 rounded-xl border border-neutral-700"><!--[-->`);
      ssrRenderList([
        { key: "frequency", label: "频率", icon: "📊" },
        { key: "saturation", label: "饱和度", icon: "🎨" },
        { key: "lightness", label: "明度", icon: "☀️" },
        { key: "combined", label: "综合", icon: "🔄" }
      ], (m) => {
        _push(`<button class="${ssrRenderClass([displayMode.value === m.key ? "bg-indigo-600 text-white" : "text-neutral-400 hover:text-white hover:bg-neutral-700", "px-2 py-0.5 rounded-lg text-xs font-medium transition"])}">${ssrInterpolate(m.icon)} ${ssrInterpolate(m.label)}</button>`);
      });
      _push(`<!--]--></div><div class="flex gap-1.5 ml-auto"><button${ssrIncludeBooleanAttr(images.value.length === 0) ? " disabled" : ""} class="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-50 transition flex items-center gap-1 text-xs border border-neutral-700 whitespace-nowrap">`);
      _push(ssrRenderComponent(unref(Trash2), { size: 12 }, null, _parent));
      _push(` 清空 </button><label class="cursor-pointer px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition flex items-center gap-1 text-xs whitespace-nowrap">`);
      _push(ssrRenderComponent(unref(Upload), { size: 12 }, null, _parent));
      _push(` ${ssrInterpolate(isProcessing.value ? "处理中..." : "导入图片")} <input type="file" multiple accept="image/*" class="hidden"${ssrIncludeBooleanAttr(isProcessing.value) ? " disabled" : ""}></label>`);
      if (images.value.length > 0) {
        _push(`<button class="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium transition flex items-center gap-1 text-xs">`);
        _push(ssrRenderComponent(unref(Download), { size: 12 }, null, _parent));
        _push(` 导出 </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></header><div class="flex flex-col xl:flex-row gap-4 xl:gap-6"><div class="w-full xl:flex-1 bg-neutral-800 rounded-2xl p-2 sm:p-3 border border-neutral-700 overflow-hidden"><div class="w-full aspect-square max-w-full"><canvas class="w-full h-full rounded-lg block"></canvas></div></div><div class="w-full xl:w-80 space-y-3 xl:space-y-4"><div class="bg-neutral-800 rounded-2xl p-3 sm:p-4 border border-neutral-700"><h3 class="text-xs sm:text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-1.5">`);
      _push(ssrRenderComponent(unref(Image$1), {
        size: 14,
        class: "text-indigo-400"
      }, null, _parent));
      _push(` 图片 (${ssrInterpolate(images.value.length)}) </h3>`);
      if (images.value.length === 0) {
        _push(`<div class="text-center py-4"><p class="text-xs text-neutral-500">导入图片以生成色相玫瑰图</p></div>`);
      } else {
        _push(`<div class="space-y-1.5 max-h-44 overflow-y-auto pr-1"><!--[-->`);
        ssrRenderList(images.value, (img) => {
          _push(`<div class="flex items-center gap-2 bg-neutral-900 rounded-lg p-1.5 group"><img${ssrRenderAttr("src", img.src)} class="w-8 h-8 rounded object-cover flex-shrink-0"><div class="flex-1 min-w-0"><p class="text-xs text-neutral-300 truncate">${ssrInterpolate(img.name)}</p><p class="text-[10px] text-neutral-500">${ssrInterpolate(img.colors.length)} 色</p></div><button class="p-0.5 rounded hover:bg-red-500/20 text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition">`);
          _push(ssrRenderComponent(unref(X), { size: 12 }, null, _parent));
          _push(`</button></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div><div class="bg-neutral-800 rounded-2xl p-3 sm:p-4 border border-neutral-700"><h3 class="text-xs sm:text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-1.5">`);
      _push(ssrRenderComponent(unref(Palette), {
        size: 14,
        class: "text-pink-400"
      }, null, _parent));
      _push(` 扇区 (${ssrInterpolate(activeSectors.value.length)}/${ssrInterpolate(sectorData.value.length)}) </h3><div class="space-y-0.5 max-h-60 overflow-y-auto pr-1"><!--[-->`);
      ssrRenderList(activeSectors.value, (sector) => {
        _push(`<div class="flex items-center gap-1.5 py-0.5 px-1.5 rounded hover:bg-neutral-900/60 transition"><div class="w-2 h-2 rounded-full flex-shrink-0 ring-1 ring-white/10" style="${ssrRenderStyle({ backgroundColor: sector.sampleHex })}"></div><span class="text-[10px] text-neutral-500 w-12 sm:w-14 font-mono flex-shrink-0">${ssrInterpolate(Math.round(sector.startHue))}°-${ssrInterpolate(Math.round(sector.endHue))}° </span><div class="flex-1 h-1 bg-neutral-900 rounded-full overflow-hidden"><div class="h-full rounded-full transition-all duration-300" style="${ssrRenderStyle({
          width: sector.frequencyNorm * 100 + "%",
          backgroundColor: sector.hueColor
        })}"></div></div><span class="text-[10px] text-neutral-400 w-4 text-right font-mono">${ssrInterpolate(sector.count)}</span></div>`);
      });
      _push(`<!--]-->`);
      if (activeSectors.value.length === 0) {
        _push(`<div class="text-center py-3 text-xs text-neutral-600"> 暂无数据 </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="bg-neutral-900 rounded-xl p-2.5 border border-neutral-800"><p class="text-[10px] text-neutral-500 leading-relaxed">`);
      if (displayMode.value === "frequency") {
        _push(`<!--[--><strong class="text-indigo-400">频率模式：</strong>径向长度表示该扇区中颜色的出现频次。 <!--]-->`);
      } else if (displayMode.value === "saturation") {
        _push(`<!--[--><strong class="text-indigo-400">饱和度模式：</strong>径向长度表示该扇区中颜色的平均饱和度。 <!--]-->`);
      } else if (displayMode.value === "lightness") {
        _push(`<!--[--><strong class="text-indigo-400">明度模式：</strong>径向长度表示该扇区中颜色的平均明度。 <!--]-->`);
      } else {
        _push(`<!--[--><strong class="text-indigo-400">综合模式：</strong>径向长度表示频次，颜色饱和度表示该扇区的平均饱和度。 <!--]-->`);
      }
      _push(`<br><span class="text-neutral-600">等分: ${ssrInterpolate(divisions.value)} · 步长: ${ssrInterpolate(Math.round(sectorWidthDeg.value * 10) / 10)}° · 样本: ${ssrInterpolate(allColors.value.length)}</span></p></div></div></div>`);
      if (images.value.length === 0 && !isProcessing.value) {
        _push(`<div class="${ssrRenderClass([isDragging.value ? "border-indigo-500 bg-indigo-500/10" : "border-neutral-700 hover:border-indigo-500 hover:bg-neutral-800", "border-2 border-dashed rounded-2xl h-32 sm:h-36 flex flex-col items-center justify-center gap-2 bg-neutral-800/50 transition-all cursor-pointer group"])}"><div class="p-2 bg-neutral-800 rounded-full group-hover:scale-110 transition-transform">`);
        _push(ssrRenderComponent(unref(Sun), {
          size: 28,
          class: isDragging.value ? "text-indigo-400" : "text-neutral-600 group-hover:text-neutral-400"
        }, null, _parent));
        _push(`</div><div class="text-center"><p class="${ssrRenderClass([isDragging.value ? "text-indigo-300" : "text-neutral-300 group-hover:text-white", "text-sm transition-colors !m-0"])}">${ssrInterpolate(isDragging.value ? "松开鼠标导入图片" : "点击或拖入图片以分析色相")}</p><p class="text-xs mt-0.5 text-neutral-500 !m-0">支持批量选择 (JPG, PNG)</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isProcessing.value) {
        _push(`<div class="fixed bottom-4 right-4 bg-indigo-600 text-white px-3 py-2 rounded-lg shadow-2xl flex items-center gap-2 animate-pulse z-50">`);
        _push(ssrRenderComponent(unref(RefreshCcw), {
          class: "animate-spin",
          size: 16
        }, null, _parent));
        _push(` 正在提取色彩数据... </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/HueWindRose.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __pageData = JSON.parse('{"title":"色相图工具","description":"","frontmatter":{},"headers":[],"relativePath":"tools/色相图.md","filePath":"tools/色相图.md","lastUpdated":1778944336000}');
const __default__ = { name: "tools/色相图.md" };
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="色相图工具" tabindex="-1">色相图工具 <a class="header-anchor" href="#色相图工具" aria-label="Permalink to &quot;色相图工具&quot;">​</a></h1><p>这里是一个完全集成的本地工具，图片处理全部在浏览器完成，不会上传服务器。</p>`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("tools/色相图.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  __pageData,
  _sfc_main as default
};
