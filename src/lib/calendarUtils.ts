export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
}

export const WEEKDAYS = [
  { en: "SUN", zh: "日" },
  { en: "MON", zh: "一" },
  { en: "TUE", zh: "二" },
  { en: "WED", zh: "三" },
  { en: "THU", zh: "四" },
  { en: "FRI", zh: "五" },
  { en: "SAT", zh: "六" },
];

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

//YYYY-MM-DD
export type DateString = string;

export function formatDate(date: Date): DateString {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days: CalendarDay[] = [];

  // 添加上个月的最后几天
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();

  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(prevYear, prevMonth, prevMonthLastDay - i);
    days.push({
      date,
      day: prevMonthLastDay - i,
      isCurrentMonth: false,
    });
  }

  // 添加当前月的所有天
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({
      date,
      day,
      isCurrentMonth: true,
    });
  }

  // 添加下个月的前几天，使日历完整
  const remainingDays = 42 - days.length; // 6行 x 7天 = 42天
  for (let day = 1; day <= remainingDays; day++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const date = new Date(nextYear, nextMonth, day);
    days.push({
      date,
      day,
      isCurrentMonth: false,
    });
  }

  return days;
}
