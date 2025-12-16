import React from "react";
import {
  // 健康类
  FaRunning,
  FaDumbbell,
  FaSwimmingPool,
  FaBicycle,
  FaWalking,
  FaPills,
  FaWater,
  FaAppleAlt,
  FaLeaf,
  FaHeartbeat,
  FaBasketballBall,
  FaFootballBall,
  // 学习类
  FaBook,
  FaGraduationCap,
  FaPen,
  FaPencilAlt,
  FaBookOpen,
  FaLaptop,
  FaChalkboardTeacher,
  FaLightbulb,
  // 工作类
  FaCode,
  FaBriefcase,
  FaEnvelope,
  FaCalendarCheck,
  FaTasks,
  FaProjectDiagram,
  FaClock,
  // 生活类
  FaCoffee,
  FaBed,
  FaShoppingCart,
  FaUtensils,
  FaBroom,
  FaTshirt,
  FaShower,
  FaHome,
  FaCar,
  FaPlane,
  // 社交类
  FaUsers,
  FaUserFriends,
  FaPhone,
  FaComments,
  FaGift,
  // 娱乐类
  FaMusic,
  FaGamepad,
  FaFilm,
  FaTv,
  FaCamera,
  FaPaintBrush,
  FaTheaterMasks,
  // 财务类
  FaWallet,
  FaChartLine,
  FaMoneyBillWave,
  FaCreditCard,
  // 状态/情感/其他
  FaHeart,
  FaStar,
  FaCheck,
  FaTimes,
  FaSmile,
  FaSun,
  FaMoon,
  FaBookmark,
  FaFlag,
  FaFire,
  FaTrophy,
  FaBell,
  FaLock,
} from "react-icons/fa";
import {
  MdSportsVolleyball,
  MdSportsTennis,
  MdSelfImprovement,
} from "react-icons/md";
import type { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
  // ========== 健康类 ==========
  running: FaRunning,
  dumbbell: FaDumbbell,
  swimming: FaSwimmingPool,
  bicycle: FaBicycle,
  walking: FaWalking,
  pills: FaPills,
  water: FaWater,
  apple: FaAppleAlt,
  leaf: FaLeaf,
  heartbeat: FaHeartbeat,
  basketball: FaBasketballBall,
  football: FaFootballBall,
  volleyball: MdSportsVolleyball,
  badminton: MdSportsTennis,
  yoga: MdSelfImprovement,

  // ========== 学习类 ==========
  book: FaBook,
  graduation: FaGraduationCap,
  pen: FaPen,
  pencil: FaPencilAlt,
  bookOpen: FaBookOpen,
  laptop: FaLaptop,
  teacher: FaChalkboardTeacher,
  lightbulb: FaLightbulb,

  // ========== 工作类 ==========
  code: FaCode,
  briefcase: FaBriefcase,
  envelope: FaEnvelope,
  calendarCheck: FaCalendarCheck,
  tasks: FaTasks,
  project: FaProjectDiagram,
  clock: FaClock,

  // ========== 生活类 ==========
  coffee: FaCoffee,
  bed: FaBed,
  shopping: FaShoppingCart,
  utensils: FaUtensils,
  broom: FaBroom,
  tshirt: FaTshirt,
  shower: FaShower,
  home: FaHome,
  car: FaCar,
  plane: FaPlane,

  // ========== 社交类 ==========
  users: FaUsers,
  userFriends: FaUserFriends,
  phone: FaPhone,
  comments: FaComments,
  gift: FaGift,

  // ========== 娱乐类 ==========
  music: FaMusic,
  gamepad: FaGamepad,
  film: FaFilm,
  tv: FaTv,
  camera: FaCamera,
  paintBrush: FaPaintBrush,
  theater: FaTheaterMasks,

  // ========== 财务类 ==========
  wallet: FaWallet,
  chartLine: FaChartLine,
  money: FaMoneyBillWave,
  creditCard: FaCreditCard,

  // ========== 状态/情感/其他 ==========
  heart: FaHeart,
  star: FaStar,
  check: FaCheck,
  times: FaTimes,
  smile: FaSmile,
  sun: FaSun,
  moon: FaMoon,
  bookmark: FaBookmark,
  flag: FaFlag,
  fire: FaFire,
  trophy: FaTrophy,
  bell: FaBell,
  lock: FaLock,
};

export type IconName = keyof typeof iconMap;
export const iconNames = Object.keys(iconMap) as IconName[];

/**
 * 根据 iconName 获取对应的图标组件
 */
export function getIconByName(iconName?: string): React.ReactNode | null {
  if (!iconName) return null;
  const IconComponent = iconMap[iconName];
  if (!IconComponent) return null;
  return React.createElement(IconComponent, { className: "w-full h-full" });
}
