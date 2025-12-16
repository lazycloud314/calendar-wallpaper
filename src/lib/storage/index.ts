/**
 * 存储管理模块
 * 
 * 提供基于 IndexedDB 的数据存储功能，支持：
 * - 某天的印章数据存储
 * - 印章模板数据存储（StampManager 中的可重用印章配置）
 * - 可扩展的数据结构，便于未来添加其他数据类型
 * 
 * 使用示例：
 * ```ts
 * import { storageDB, StampStorage, StampTemplateStorage } from '@/lib/storage';
 * 
 * // 基础操作
 * await storageDB.saveDayData(new Date(), { stamps: [...] });
 * const result = await storageDB.getDayData(new Date());
 * 
 * // 某天的印章操作
 * await StampStorage.addStamp(new Date(), stampConfig);
 * const stamps = await StampStorage.getStamps(new Date());
 * 
 * // 印章模板操作（StampManager 使用）
 * await StampTemplateStorage.saveTemplate(stampConfig);
 * const templates = await StampTemplateStorage.getAllTemplates();
 * ```
 */

// 导出数据库实例
export { storageDB } from "./db";

// 导出印章存储管理器（某天的印章数据）
export { StampStorage } from "./dayDataStorage";

// 导出印章模板存储管理器（StampManager 的印章模板）
export { StampTemplateStorage } from "./stampTemplateStorage";

// 导出类型
export type {
  DayData,
  DateString,
  StorageResult,
  BatchQueryResult,
  StampTemplate,
} from "./types";

