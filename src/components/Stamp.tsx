import { type StampConfig } from "./StampManager/types";
import { getIconByName } from "../lib/iconUtils";

interface StampProps {
  stampConfig: StampConfig;
  size?: StampSize;
}

export type StampSize = "mini" | "small" | "medium" | "large" | "xlarge";

// 固定的五种大小映射 - 使用分辨率相关的单位（rem + vw）
const STAMP_SIZES: Record<StampSize, string> = {
  mini: "clamp(0.75rem, 1.5vw, 1rem)",      // 12px - 24px - 16px
  small: "clamp(1rem, 2vw, 1.5rem)",        // 16px - 32px - 24px
  medium: "clamp(1.5rem, 3vw, 2rem)",       // 24px - 48px - 32px
  large: "clamp(2rem, 4vw, 3rem)",          // 32px - 64px - 48px
  xlarge: "clamp(2.5rem, 5vw, 4rem)",       // 40px - 80px - 64px
};

/**
 * 印章组件 - 支持多种印章样式
 * 可以配合 react-icons 或其他图标库使用
 * SVG 已配置 viewBox，可以根据页面大小自适应
 */
export function Stamp({ stampConfig, size = "medium" }: StampProps) {
  const { variant, color, iconName } = stampConfig;
  // 使用固定的五种大小之一
  const sizeValue = STAMP_SIZES[size];

  const baseStyle = {
    width: sizeValue,
    height: sizeValue,
    color: color,
    maxWidth: "100%", // 确保不会超出父容器
    maxHeight: "100%",
    backgroundColor: "transparent",
  };

  const renderStamp = () => {
    switch (variant) {
      case "circle":
        return (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            style={baseStyle}
            className="drop-shadow-sm"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <foreignObject x="25" y="25" width="50" height="50">
              <div className="flex items-center justify-center w-full h-full text-[clamp(0.75rem,2vw,1.25rem)]">
                {getIconByName(iconName)}
              </div>
            </foreignObject>
          </svg>
        );
      case "square":
        return (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            style={baseStyle}
            className="drop-shadow-sm"
          >
            <rect
              x="10"
              y="10"
              width="80"
              height="80"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              rx="5"
            />
            <foreignObject x="25" y="25" width="50" height="50">
              <div className="flex items-center justify-center w-full h-full text-[clamp(0.75rem,2vw,1.25rem)]">
                {getIconByName(iconName)}
              </div>
            </foreignObject>
          </svg>
        );
      case "star":
        return (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            style={baseStyle}
            className="drop-shadow-sm"
          >
            <path
              d="M50 10 L60 40 L90 40 L68 60 L78 90 L50 70 L22 90 L32 60 L10 40 L40 40 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <foreignObject x="30" y="30" width="40" height="40">
              <div className="flex items-center justify-center w-full h-full text-[clamp(0.6rem,1.6vw,1rem)]">
                {getIconByName(iconName)}
              </div>
            </foreignObject>
          </svg>
        );
      case "heart":
        return (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            style={baseStyle}
            className="drop-shadow-sm"
          >
            <path
              d="M50 30 C35 15 10 25 10 45 C10 65 30 75 50 90 C70 75 90 65 90 45 C90 25 65 15 50 30 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <foreignObject x="25" y="36" width="50" height="42">
              <div className="flex items-center justify-center w-full h-full text-[clamp(0.7rem,1.8vw,1.1rem)]">
                {getIconByName(iconName)}
              </div>
            </foreignObject>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="inline-flex items-center justify-center bg-transparent">
      {renderStamp()}
    </div>
  );
}
