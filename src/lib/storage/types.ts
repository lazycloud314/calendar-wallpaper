import type { StampConfig } from "../../components/StampManager/types";

/**
 * 日期字符串格式：YYYY-MM-DD
 */
export type DateString = string;

/**
 * 可序列化的印章模板（用于 IndexedDB 存储）
 * 不包含 ReactNode，只存储可序列化的数据
 */
export interface StampTemplate extends StampConfig {
  /** 创建时间戳 */
  createdAt: number;
  /** 更新时间戳 */
  updatedAt: number;
  /** 扩展字段，用于存储未来可能添加的其他数据类型 */
  [key: string]: unknown;
}

/**
 * 某天的数据记录
 * 设计为可扩展结构，可以添加其他类型的数据
 */
export interface DayData {
  /** 日期（YYYY-MM-DD 格式）作为主键 */
  date: DateString;
  /** 该天的印章数据 */
  stamps?: string[];
  /** 创建时间戳 */
  createdAt: number;
  /** 更新时间戳 */
  updatedAt: number;
  /** 扩展字段，用于存储未来可能添加的其他数据类型 */
  [key: string]: unknown;
}

/**
 * 存储操作结果
 */
export interface StorageResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 批量查询结果
 */
export interface BatchQueryResult {
  items: DayData[];
  total: number;
}
