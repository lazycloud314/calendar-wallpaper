import type { CalendarDay } from "../lib/calendarUtils";
import type { DayData } from "../lib/storage/types";
import { Stamp } from "./Stamp";
import { useStampTemplatesStore } from "../stores/stampTemplates";
import { useSelectedStampStore } from "../stores/selectedStamp";
import { StampStorage } from "../lib/storage/dayDataStorage";

interface DayCellProps {
  calendarDay: CalendarDay;
  dayData?: DayData;
  isHighlighted?: boolean;
  onDayDataUpdate?: (date: Date, dayData: DayData) => void;
}

export function DayCell({
  calendarDay,
  dayData,
  isHighlighted = false,
  onDayDataUpdate,
}: DayCellProps) {
  const { templates, isLoaded } = useStampTemplatesStore();
  const { selectedStamp, setSelectedStamp } = useSelectedStampStore();

  const handleClick = async () => {
    // 如果没有选中的印章，不执行任何操作
    if (!selectedStamp) {
      return;
    }

    // 添加印章到该天
    const result = await StampStorage.addStamp(calendarDay.date, selectedStamp);
    if (result.success && result.data) {
      // 通知父组件更新数据
      onDayDataUpdate?.(calendarDay.date, result.data);
    } else {
      console.error("添加印章失败:", result.error);
    }
    setSelectedStamp(null);
  };

  // 如果 templates 还没有加载完成，不显示 stamps
  const stamps = isLoaded && dayData?.stamps ? dayData.stamps : [];

  return (
    <div
      className={`
        w-full h-full
        font-bold
        text-[clamp(0.5rem,2vw,1rem)]
        ${calendarDay.isCurrentMonth ? "text-black" : "text-gray-400"}
        ${isHighlighted ? "bg-blue-200/50" : ""}
        flex flex-col
      `}
      onClick={handleClick}
    >
      <div className="flex-shrink-0">{calendarDay.day}</div>
      {isLoaded && stamps.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1 flex-shrink-0">
          {stamps.map((stampName, index) => {
            const template = templates.find((t) => t.name === stampName);
            if (!template) return null;
            return (
              <Stamp
                key={`${stampName}-${index}`}
                stampConfig={template}
                size="small"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
