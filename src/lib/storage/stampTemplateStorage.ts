import { storageDB } from "./db";
import type { StampConfig } from "../../components/StampManager/types";
import type { StampTemplate, StorageResult } from "./types";

const STAMPS_STORE_NAME = "stamps";

/**
 * 印章模板存储管理器
 * 用于管理 StampManager 中的印章模板（可重用的印章配置）
 */
export class StampTemplateStorage {
  /**
   * 获取数据库实例
   */
  private static async getDB() {
    // 使用 storageDB 的公共方法获取数据库实例
    const db = await storageDB.getDatabase();
    return db;
  }

  /**
   * 将 StampConfig 转换为可序列化的 StampTemplate
   */
  private static configToTemplate(
    config: StampConfig,
    existingTemplate?: StampTemplate
  ): StampTemplate {
    const now = Date.now();
    return {
      name: config.name,
      variant: config.variant,
      color: config.color,
      iconName: config.iconName,
      iconType: config.iconType,
      createdAt: existingTemplate?.createdAt || now,
      updatedAt: now,
    };
  }

  /**
   * 保存或更新印章模板
   */
  static async saveTemplate(
    config: StampConfig
  ): Promise<StorageResult<StampTemplate>> {
    try {
      const db = await this.getDB();

      // 先尝试获取现有模板
      const existing = await this.getTemplate(config.name);

      const template = this.configToTemplate(
        config,
        existing.success ? existing.data : undefined
      );

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STAMPS_STORE_NAME], "readwrite");
        const store = transaction.objectStore(STAMPS_STORE_NAME);
        const request = store.put(template);

        request.onsuccess = () => {
          resolve({
            success: true,
            data: template,
          });
        };

        request.onerror = () => {
          reject({
            success: false,
            error: `保存印章模板失败: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      };
    }
  }

  /**
   * 获取指定名称的印章模板
   */
  static async getTemplate(
    name: string
  ): Promise<StorageResult<StampTemplate>> {
    try {
      const db = await this.getDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STAMPS_STORE_NAME], "readonly");
        const store = transaction.objectStore(STAMPS_STORE_NAME);
        const request = store.get(name);

        request.onsuccess = () => {
          const data = request.result;
          if (data) {
            resolve({
              success: true,
              data,
            });
          } else {
            resolve({
              success: true,
              data: undefined,
            });
          }
        };

        request.onerror = () => {
          reject({
            success: false,
            error: `查询印章模板失败: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      };
    }
  }

  /**
   * 获取所有印章模板
   */
  static async getAllTemplates(): Promise<StorageResult<StampTemplate[]>> {
    try {
      const db = await this.getDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STAMPS_STORE_NAME], "readonly");
        const store = transaction.objectStore(STAMPS_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          const items = request.result as StampTemplate[];
          resolve({
            success: true,
            data: items,
          });
        };

        request.onerror = () => {
          reject({
            success: false,
            error: `查询所有印章模板失败: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      };
    }
  }

  /**
   * 删除指定名称的印章模板
   * 同时会从所有 dayData 中删除相关的 stamp 数据
   */
  static async deleteTemplate(name: string): Promise<StorageResult<void>> {
    try {
      // 先获取所有 dayData，删除其中包含该模板名称的 stamp
      const allDayDataResult = await storageDB.getAllDayData();
      if (allDayDataResult.success && allDayDataResult.data) {
        const dayDataList = allDayDataResult.data.items;

        // 找出所有包含该 stamp 名称的 dayData
        const dayDataToUpdate = dayDataList.filter(
          (dayData) => dayData.stamps && dayData.stamps.includes(name)
        );

        // 批量更新这些 dayData，移除该 stamp
        for (const dayData of dayDataToUpdate) {
          const updatedStamps = dayData.stamps!.filter((s) => s !== name);
          await storageDB.saveDayData(dayData.date, {
            stamps: updatedStamps,
          });
        }
      }

      // 然后删除模板
      const db = await this.getDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STAMPS_STORE_NAME], "readwrite");
        const store = transaction.objectStore(STAMPS_STORE_NAME);
        const request = store.delete(name);

        request.onsuccess = () => {
          resolve({
            success: true,
          });
        };

        request.onerror = () => {
          reject({
            success: false,
            error: `删除印章模板失败: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      };
    }
  }

  /**
   * 批量保存印章模板
   */
  static async saveTemplates(
    configs: StampConfig[]
  ): Promise<StorageResult<StampTemplate[]>> {
    try {
      const db = await this.getDB();

      // 先获取所有现有模板
      const existingResult = await this.getAllTemplates();
      const existingTemplates = existingResult.success
        ? existingResult.data || []
        : [];
      const existingMap = new Map(existingTemplates.map((t) => [t.name, t]));

      const templates = configs.map((config) =>
        this.configToTemplate(config, existingMap.get(config.name))
      );

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STAMPS_STORE_NAME], "readwrite");
        const store = transaction.objectStore(STAMPS_STORE_NAME);

        const promises = templates.map(
          (template) =>
            new Promise<void>((resolveItem, rejectItem) => {
              const request = store.put(template);
              request.onsuccess = () => resolveItem();
              request.onerror = () =>
                rejectItem(new Error(request.error?.message));
            })
        );

        Promise.all(promises)
          .then(() => {
            resolve({
              success: true,
              data: templates,
            });
          })
          .catch((error) => {
            reject({
              success: false,
              error: error instanceof Error ? error.message : "批量保存失败",
            });
          });

        transaction.oncomplete = () => {
          // 事务完成
        };
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      };
    }
  }

  /**
   * 清空所有印章模板
   */
  static async clearAll(): Promise<StorageResult<void>> {
    try {
      const db = await this.getDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STAMPS_STORE_NAME], "readwrite");
        const store = transaction.objectStore(STAMPS_STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => {
          resolve({
            success: true,
          });
        };

        request.onerror = () => {
          reject({
            success: false,
            error: `清空印章模板失败: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      };
    }
  }
}
