interface ColorSelectorProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}

const colorPresets = [
  // 红色系
  { name: "红色", value: "#ef4444" },
  { name: "深红", value: "#dc2626" },
  { name: "浅红", value: "#f87171" },
  { name: "玫瑰红", value: "#f43f5e" },
  // 蓝色系
  { name: "蓝色", value: "#3b82f6" },
  { name: "深蓝", value: "#1e40af" },
  { name: "浅蓝", value: "#60a5fa" },
  { name: "天蓝", value: "#0ea5e9" },
  { name: "海军蓝", value: "#1e3a8a" },
  // 绿色系
  { name: "绿色", value: "#10b981" },
  { name: "深绿", value: "#059669" },
  { name: "浅绿", value: "#34d399" },
  { name: "翠绿", value: "#14b8a6" },
  { name: "橄榄绿", value: "#84cc16" },
  // 黄色系
  { name: "黄色", value: "#f59e0b" },
  { name: "浅黄", value: "#fbbf24" },
  { name: "金黄", value: "#eab308" },
  { name: "柠檬黄", value: "#fde047" },
  // 紫色系
  { name: "紫色", value: "#8b5cf6" },
  { name: "深紫", value: "#7c3aed" },
  { name: "浅紫", value: "#a78bfa" },
  { name: "薰衣草", value: "#c084fc" },
  // 粉色系
  { name: "粉色", value: "#ec4899" },
  { name: "深粉", value: "#db2777" },
  { name: "浅粉", value: "#f472b6" },
  { name: "玫瑰粉", value: "#f9a8d4" },
  // 橙色系
  { name: "橙色", value: "#f97316" },
  { name: "深橙", value: "#ea580c" },
  { name: "浅橙", value: "#fb923c" },
  { name: "珊瑚橙", value: "#ff7875" },
  // 青色系
  { name: "青色", value: "#06b6d4" },
  { name: "深青", value: "#0891b2" },
  { name: "浅青", value: "#22d3ee" },
  { name: "青绿", value: "#2dd4bf" },
  // 灰色系
  { name: "浅灰", value: "#9ca3af" },
  { name: "中灰", value: "#6b7280" },
  { name: "深灰", value: "#4b5563" },
  { name: "炭灰", value: "#374151" },
  // 棕色系
  { name: "棕色", value: "#a16207" },
  { name: "深棕", value: "#78350f" },
  { name: "浅棕", value: "#d97706" },
  { name: "米色", value: "#e5e7eb" },
  // 其他
  { name: "黑色", value: "#1f2937" },
  { name: "白色", value: "#ffffff" },
];

/**
 * 判断颜色是否为浅色（用于决定边框颜色）
 */
function isLightColor(hex: string): boolean {
  // 移除 # 号
  const color = hex.replace("#", "");
  // 转换为 RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  // 计算亮度
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 180;
}

export function ColorSelector({
  selectedColor,
  onSelect,
}: ColorSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">颜色</label>
      <div className="grid grid-cols-12 gap-2">
        {colorPresets.map((color) => {
          const isLight = isLightColor(color.value);
          const isSelected = selectedColor === color.value;
          
          return (
            <button
              key={color.value}
              type="button"
              onClick={() => onSelect(color.value)}
              className={`w-full aspect-square rounded-lg border-2 transition-all ${
                isSelected
                  ? isLight
                    ? "border-gray-800 scale-110 shadow-md"
                    : "border-white scale-110 shadow-md"
                  : isLight
                  ? "border-gray-400 hover:border-gray-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          );
        })}
      </div>
    </div>
  );
}

