import { useState, useEffect } from "react";
import {
  WEEKDAYS,
  MONTHS,
  getCalendarDays,
  formatDate,
  isSameDay,
} from "../lib/calendarUtils";
import { DayCell } from "./DayCell";
import { StampStorage } from "../lib/storage/dayDataStorage";
import type { DayData } from "../lib/storage/types";
import { MouseFollower } from "./MouseFollower";
import { useSelectedStampStore } from "../stores/selectedStamp";
import { useStampTemplatesStore } from "../stores/stampTemplates";
import type { StampConfig } from "./StampManager/types";
import { Stamp } from "./Stamp";

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMouseFollowing, setIsMouseFollowing] = useState(false);
  const [dayDataMap, setDayDataMap] = useState<Record<string, DayData>>({});
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const [nowDate, setNowDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNowDate(new Date());
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const [mouseFollowerStamp, setMouseFollowerStamp] = useState<
    StampConfig | undefined
  >(undefined);
  const { selectedStamp } = useSelectedStampStore();
  const { templates } = useStampTemplatesStore();

  const calendarDays = getCalendarDays(year, month);

  useEffect(() => {
    if (selectedStamp) {
      const template = templates.find((t) => t.name === selectedStamp);
      if (template) {
        setIsMouseFollowing(Boolean(selectedStamp));
        setMouseFollowerStamp(template);
      }
    } else {
      setIsMouseFollowing(false);
      setMouseFollowerStamp(undefined);
    }
  }, [selectedStamp]);

  // 加载当前显示日期范围内的所有 DayData
  useEffect(() => {
    const loadDayData = async () => {
      if (calendarDays.length === 0) return;

      const startDate = calendarDays[0].date;
      const endDate = calendarDays[calendarDays.length - 1].date;

      const result = await StampStorage.getRangeDayData(startDate, endDate);
      if (result.success && result.data) {
        setDayDataMap(result.data);
      }
    };

    loadDayData();
  }, [year, month]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="flex flex-col p-[2%] w-full h-full">
      {/* 月份标题 */}
      <div className="mb-[2%] flex items-center justify-center gap-4 flex-shrink-0">
        <button
          onClick={goToPreviousMonth}
          className="flex items-center justify-center w-[clamp(2rem,5vw,3rem)] h-[clamp(2rem,5vw,3rem)] bg-gray-100 hover:bg-gray-200 rounded-full text-black text-[clamp(1.5rem,4vw,2.5rem)] font-medium transition-colors"
          aria-label="上个月"
        >
          ←
        </button>
        <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-semibold font-mono text-black bg-white/50 rounded-xl px-2 py-0">
          {MONTHS[month]} {year}
        </h2>
        <button
          onClick={goToNextMonth}
          className="flex items-center justify-center w-[clamp(2rem,5vw,3rem)] h-[clamp(2rem,5vw,3rem)] bg-gray-100 hover:bg-gray-200 rounded-full text-black text-[clamp(1.5rem,4vw,2.5rem)] font-medium transition-colors"
          aria-label="下个月"
        >
          →
        </button>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 border-b-2 border-black pb-[1%] mb-[0.5%] flex-shrink-0">
        {WEEKDAYS.map((weekday) => (
          <div
            key={weekday.en}
            className="text-center text-[clamp(0.75rem,1.5vw,1rem)] font-semibold text-black"
          >
            {weekday.en}
            <span className="ml-1">{weekday.zh}</span>
          </div>
        ))}
      </div>

      {/* 日期网格 */}
      <div
        className="grid grid-cols-7 border-2 border-black flex-1 min-h-0 relative"
        style={{ gridAutoRows: "1fr" }}
      >
        {calendarDays.map((calendarDay, index) => {
          const row = Math.floor(index / 7);
          const col = index % 7;
          const isFirstRow = row === 0;
          const isFirstCol = col === 0;
          const isToday = isSameDay(nowDate, calendarDay.date);

          return (
            <div
              key={index}
              className={`
                border-black
                ${isFirstRow ? "" : "border-t"}
                ${isFirstCol ? "" : "border-l"}
                ${isToday 
                  ? "bg-blue-400/70" 
                  : calendarDay.isCurrentMonth 
                    ? "bg-white/60" 
                    : "bg-gray-100/40"}
                p-[1%]
                flex flex-col items-start justify-start
                relative
                min-h-0
                overflow-hidden
              `}
            >
              <DayCell
                calendarDay={calendarDay}
                dayData={dayDataMap[formatDate(calendarDay.date)]}
                isHighlighted={isToday}
                onDayDataUpdate={(date, newDayData) => {
                  setDayDataMap((prev) => {
                    const updated = { ...prev };
                    updated[formatDate(date)] = newDayData;
                    return updated;
                  });
                }}
              />
            </div>
          );
        })}

        <MouseFollower enabled={isMouseFollowing} className="absolute inset-0">
          <Stamp stampConfig={mouseFollowerStamp!} size="small" />
        </MouseFollower>
      </div>
    </div>
  );
}
