import type { CalendarDay } from "../lib/calendarUtils";
import type { DayData } from "../lib/storage/types";
import { Stamp, type StampSize } from "./Stamp";
import { useStampTemplatesStore } from "../stores/stampTemplates";
import { useSelectedStampStore } from "../stores/selectedStamp";
import { StampStorage } from "../lib/storage/dayDataStorage";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface DayCellProps {
  calendarDay: CalendarDay;
  dayData?: DayData;
  isHighlighted?: boolean;
  onDayDataUpdate?: (date: Date, dayData: DayData) => void;
}

function getStampSize(stampCount: number): StampSize {
  if (stampCount <= 3) {
    return "medium";
  } else if (stampCount <= 6) {
    return "small";
  } else {
    return "mini";
  }
}
export function DayCell({
  calendarDay,
  dayData,
  isHighlighted = false,
  onDayDataUpdate,
}: DayCellProps) {
  console.log("DayCell", calendarDay.date, dayData);


  const templates = useStampTemplatesStore((state) => state.templates);
  const isLoaded = useStampTemplatesStore((state) => state.isLoaded);
  const selectedStamp = useSelectedStampStore((state) => state.selectedStamp);
  const setSelectedStamp = useSelectedStampStore(
    (state) => state.setSelectedStamp
  );

  // 如果 templates 还没有加载完成，不显示 stamps
  const stamps = isLoaded && dayData?.stamps ? dayData.stamps : [];

  const handleClick = async () => {
    // 如果没有选中的印章，不执行任何操作
    if (!isLoaded || !selectedStamp) {
      return;
    }

    if (stamps.find((s) => s === selectedStamp)) {
      //删除印章
      const result = await StampStorage.removeStamp(
        calendarDay.date,
        selectedStamp
      );
      if (result.success && result.data) {
        // 通知父组件更新数据
        onDayDataUpdate?.(calendarDay.date, result.data);
      } else {
        toast.error("删除印章失败:" + result.error);
      }
    } else {
      // 添加印章到该天
      const result = await StampStorage.addStamp(
        calendarDay.date,
        selectedStamp
      );
      if (result.success && result.data) {
        // 通知父组件更新数据
        onDayDataUpdate?.(calendarDay.date, result.data);
      } else {
        toast.error("添加印章失败:" + result.error);
      }
    }

    setSelectedStamp(null);
  };

  return (
    <div
      className={`
        w-full h-full
        font-bold
        text-[clamp(0.5rem,2vw,1rem)]
        ${
          isHighlighted
            ? "text-blue-900"
            : calendarDay.isCurrentMonth
            ? "text-gray-900"
            : "text-gray-500"
        }
        flex flex-col
      `}
      onClick={handleClick}
    >
      <div className="shrink-0">{calendarDay.day}</div>
      {isLoaded && stamps.length > 0 && (
        <div className="flex flex-wrap shrink-0 pointer-events-none">
          {stamps.map((stampName, index) => {
            const template = templates.find((t) => t.name === stampName);
            if (!template) return null;
            return (
              <Stamp
                key={`${stampName}-${index}`}
                stampConfig={template}
                size={getStampSize(stamps.length)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
