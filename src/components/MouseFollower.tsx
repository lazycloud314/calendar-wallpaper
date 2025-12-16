import { useState, useRef, type ReactNode, useEffect } from "react";

interface MouseFollowerProps {
  children: ReactNode;
  enabled?: boolean;
  offsetX?: number;
  offsetY?: number;
  className?: string;
}

/**
 * 鼠标跟随组件
 * 当 enabled 为 true 时，将 children 渲染在鼠标位置
 * 只在组件 div 范围内跟随鼠标，超出范围不显示
 */
export function MouseFollower({
  children,
  enabled = false,
  offsetX = 0,
  offsetY = 0,
  className = "",
}: MouseFollowerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [firstMoveIn, setFirstMoveIn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) {
      setFirstMoveIn(false);
    }
  }, [enabled]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!enabled || !containerRef.current) return;

    setFirstMoveIn(true);
    setPosition({
      x: e.nativeEvent.offsetX + offsetX,
      y: e.nativeEvent.offsetY + offsetY,
    });
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!enabled || !containerRef.current) return;

    // 鼠标离开时，保持 children 在最后的位置
    setPosition({
      x: e.nativeEvent.offsetX + offsetX,
      y: e.nativeEvent.offsetY + offsetY,
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!enabled || !containerRef.current) return;

    // 让点击事件穿透到下层元素
    // 临时隐藏容器，找到下层的元素，然后触发点击
    const container = containerRef.current;
    const originalPointerEvents = container.style.pointerEvents;
    container.style.pointerEvents = "none";

    const elementBelow = document.elementFromPoint(e.clientX, e.clientY);

    // 恢复容器的 pointer-events
    container.style.pointerEvents = originalPointerEvents || "auto";

    // 如果找到了下层元素，触发它的点击事件
    if (elementBelow && elementBelow !== container) {
      (elementBelow as HTMLElement).click();
    }
  };

  if (!enabled) {
    return null;
  }

  return (
    <>
      <div
        ref={containerRef}
        className={className}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ pointerEvents: "auto" }}
      />
      {enabled && firstMoveIn && (
        <div
          className="absolute pointer-events-none z-50"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {children}
        </div>
      )}
    </>
  );
}
