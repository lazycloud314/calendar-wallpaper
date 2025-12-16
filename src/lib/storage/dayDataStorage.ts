import { storageDB } from "./db";
import type { DayData, DateString, StorageResult } from "./types";
import { formatDate } from "../calendarUtils";

/**
 * 印章数据存储管理器
 * 提供针对印章数据的便捷操作方法
 */
export class StampStorage {
  /**
   * 为某天添加印章
   */
  static async addStamp(
    date: Date | DateString,
    stamp: string
  ): Promise<StorageResult<DayData>> {
    const dateString = typeof date === "string" ? date : formatDate(date);
    const result = await storageDB.getDayData(dateString);

    if (!result.success) {
      return result;
    }

    const existingStamps = result.data?.stamps || [];
    // 检查是否已存在相同名称的印章
    const existingIndex = existingStamps.findIndex((s) => s === stamp);

    let updatedStamps: string[];
    if (existingIndex >= 0) {
      // 如果已存在，则更新
      updatedStamps = [...existingStamps];
      updatedStamps[existingIndex] = stamp;
    } else {
      // 如果不存在，则添加
      updatedStamps = [...existingStamps, stamp];
    }

    return storageDB.saveDayData(dateString, {
      stamps: updatedStamps,
    });
  }

  /**
   * 为某天移除印章
   */
  static async removeStamp(
    date: Date | DateString,
    stampName: string
  ): Promise<StorageResult<DayData>> {
    const dateString = typeof date === "string" ? date : formatDate(date);
    const result = await storageDB.getDayData(dateString);

    if (!result.success || !result.data) {
      return result;
    }

    const existingStamps = result.data.stamps || [];
    const updatedStamps = existingStamps.filter((s) => s !== stampName);

    return storageDB.saveDayData(dateString, {
      stamps: updatedStamps,
    });
  }

  /**
   * 获取某天的所有数据
   */
  static async getDayData(
    date: Date | DateString
  ): Promise<StorageResult<DayData>> {
    const dateString = typeof date === "string" ? date : formatDate(date);
    const result = await storageDB.getDayData(dateString);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  }

  static async getRangeDayData(
    startDate: Date | DateString,
    endDate: Date | DateString
  ): Promise<StorageResult<Record<DateString, DayData>>> {
    const startDateString =
      typeof startDate === "string" ? startDate : formatDate(startDate);
    const endDateString =
      typeof endDate === "string" ? endDate : formatDate(endDate);
    const result = await storageDB.getDayDataRange(
      startDateString,
      endDateString
    );
    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }
    return {
      success: true,
      data: result.data?.items.reduce((acc, item) => {
        acc[item.date] = item;
        return acc;
      }, {} as Record<DateString, DayData>),
    };
  }

  /**
   * 设置某天的所有印章（替换现有印章）
   */
  static async setStamps(
    date: Date | DateString,
    stamps: string[]
  ): Promise<StorageResult<DayData>> {
    const dateString = typeof date === "string" ? date : formatDate(date);
    return storageDB.saveDayData(dateString, {
      stamps,
    });
  }

  /**
   * 检查某天是否有印章
   */
  static async hasStamps(
    date: Date | DateString
  ): Promise<StorageResult<boolean>> {
    const result = await this.getDayData(date);
    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }
    return {
      success: true,
      data: (result.data?.stamps?.length ?? 0) > 0,
    };
  }
}
