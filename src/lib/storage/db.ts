import type { DayData, DateString, StorageResult, BatchQueryResult } from "./types";

const DB_NAME = "CalendarWallpaperDB";
const DB_VERSION = 2; // 升级版本以添加新的 stamps 表
const STORE_NAME = "dayData";
const STAMPS_STORE_NAME = "stamps";

/**
 * IndexedDB 数据库管理器
 */
class StorageDB {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase> | null = null;

  /**
   * 初始化数据库
   */
  private async init(): Promise<IDBDatabase> {
    // 如果已经有初始化中的 Promise，直接返回它
    if (this.initPromise) {
      return this.initPromise;
    }

    // 如果数据库已经打开，直接返回
    if (this.db) {
      return this.db;
    }

    // 创建新的初始化 Promise
    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        this.initPromise = null;
        reject(new Error(`数据库打开失败: ${request.error?.message}`));
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.initPromise = null;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 如果 dayData 对象存储不存在，则创建
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, {
            keyPath: "date",
          });

          // 创建索引以便查询
          objectStore.createIndex("date", "date", { unique: true });
          objectStore.createIndex("createdAt", "createdAt", { unique: false });
          objectStore.createIndex("updatedAt", "updatedAt", { unique: false });
        }

        // 如果 stamps 对象存储不存在，则创建（用于存储印章模板）
        if (!db.objectStoreNames.contains(STAMPS_STORE_NAME)) {
          const stampsStore = db.createObjectStore(STAMPS_STORE_NAME, {
            keyPath: "name",
          });

          // 创建索引以便查询
          stampsStore.createIndex("name", "name", { unique: true });
          stampsStore.createIndex("createdAt", "createdAt", { unique: false });
          stampsStore.createIndex("updatedAt", "updatedAt", { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  /**
   * 获取数据库实例（确保已初始化）
   */
  private async getDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error("数据库初始化失败");
    }
    return this.db;
  }

  /**
   * 获取数据库实例（公共方法，供其他存储类使用）
   */
  async getDatabase(): Promise<IDBDatabase> {
    return this.getDB();
  }

  /**
   * 将 Date 对象转换为日期字符串（YYYY-MM-DD）
   */
  private dateToString(date: Date): DateString {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }


  /**
   * 保存或更新某天的数据
   */
  async saveDayData(
    date: Date | DateString,
    data: Partial<Omit<DayData, "date" | "createdAt" | "updatedAt">>
  ): Promise<StorageResult<DayData>> {
    try {
      const db = await this.getDB();
      const dateString = typeof date === "string" ? date : this.dateToString(date);

      // 先尝试获取现有数据
      const existing = await this.getDayData(dateString);

      const now = Date.now();
      const dayData: DayData = {
        date: dateString,
        ...(existing.data || {}),
        ...data,
        createdAt: existing.data?.createdAt || now,
        updatedAt: now,
      };

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(dayData);

        request.onsuccess = () => {
          resolve({
            success: true,
            data: dayData,
          });
        };

        request.onerror = () => {
          reject({
            success: false,
            error: `保存失败: ${request.error?.message}`,
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
   * 获取某天的数据
   */
  async getDayData(date: Date | DateString): Promise<StorageResult<DayData>> {
    try {
      const db = await this.getDB();
      const dateString = typeof date === "string" ? date : this.dateToString(date);

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(dateString);

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
            error: `查询失败: ${request.error?.message}`,
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
   * 删除某天的数据
   */
  async deleteDayData(date: Date | DateString): Promise<StorageResult<void>> {
    try {
      const db = await this.getDB();
      const dateString = typeof date === "string" ? date : this.dateToString(date);

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(dateString);

        request.onsuccess = () => {
          resolve({
            success: true,
          });
        };

        request.onerror = () => {
          reject({
            success: false,
            error: `删除失败: ${request.error?.message}`,
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
   * 批量获取日期范围内的数据
   */
  async getDayDataRange(
    startDate: Date | DateString,
    endDate: Date | DateString
  ): Promise<StorageResult<BatchQueryResult>> {
    try {
      const db = await this.getDB();
      const startDateString = typeof startDate === "string" ? startDate : this.dateToString(startDate);
      const endDateString = typeof endDate === "string" ? endDate : this.dateToString(endDate);

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index("date");
        const range = IDBKeyRange.bound(startDateString, endDateString, false, false);
        const request = index.getAll(range);

        request.onsuccess = () => {
          const items = request.result as DayData[];
          resolve({
            success: true,
            data: {
              items,
              total: items.length,
            },
          });
        };

        request.onerror = () => {
          reject({
            success: false,
            error: `批量查询失败: ${request.error?.message}`,
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
   * 获取所有数据
   */
  async getAllDayData(): Promise<StorageResult<BatchQueryResult>> {
    try {
      const db = await this.getDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          const items = request.result as DayData[];
          resolve({
            success: true,
            data: {
              items,
              total: items.length,
            },
          });
        };

        request.onerror = () => {
          reject({
            success: false,
            error: `查询所有数据失败: ${request.error?.message}`,
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
   * 清空所有数据
   */
  async clearAll(): Promise<StorageResult<void>> {
    try {
      const db = await this.getDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => {
          resolve({
            success: true,
          });
        };

        request.onerror = () => {
          reject({
            success: false,
            error: `清空数据失败: ${request.error?.message}`,
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
   * 关闭数据库连接
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initPromise = null;
    }
  }
}

// 导出单例实例
export const storageDB = new StorageDB();

