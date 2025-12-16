import { create } from "zustand";
import { StampTemplateStorage } from "../lib/storage/stampTemplateStorage";
import type { StampTemplate } from "../lib/storage/types";
import type { StampConfig } from "../components/StampManager/types";

interface StampTemplatesStore {
  templates: StampTemplate[];
  isLoading: boolean;
  isLoaded: boolean;
  loadTemplates: () => Promise<void>;
  saveTemplate: (
    config: Omit<StampConfig, "icon">,
    oldName?: string
  ) => Promise<{ success: boolean; error?: string }>;
  deleteTemplate: (
    name: string
  ) => Promise<{ success: boolean; error?: string }>;
  getTemplate: (name: string) => StampTemplate | undefined;
}

export const useStampTemplatesStore = create<StampTemplatesStore>(
  (set, get) => ({
    templates: [],
    isLoading: false,
    isLoaded: false,
    loadTemplates: async () => {
      if (get().isLoading || get().isLoaded) {
        return;
      }
      set({ isLoading: true });
      try {
        const result = await StampTemplateStorage.getAllTemplates();
        if (result.success) {
          set({
            templates: result.data || [],
            isLoading: false,
            isLoaded: true,
          });
        } else {
          console.error("加载印章模板失败:", result.error);
          set({ isLoading: false, isLoaded: true });
        }
      } catch (error) {
        console.error("加载印章模板失败:", error);
        set({ isLoading: false, isLoaded: true });
      }
    },
    getTemplate: (name: string) => {
      return get().templates.find((t) => t.name === name);
    },
    saveTemplate: async (
      config: Omit<StampConfig, "icon">,
      oldName?: string
    ) => {
      try {
        // 保存到存储
        const result = await StampTemplateStorage.saveTemplate(config);

        if (result.success && result.data) {
          // 如果是编辑且名称改变了，需要删除旧的模板
          if (oldName && oldName !== config.name) {
            const deleteResult = await StampTemplateStorage.deleteTemplate(
              oldName
            );
            if (!deleteResult.success) {
              console.error("删除旧模板失败:", deleteResult.error);
            }
            // 即使删除失败，也更新 store（因为新模板已保存成功）
            set((state) => ({
              templates: state.templates
                .filter((t) => t.name !== oldName)
                .concat([result.data!]),
            }));
          } else {
            // 新增或编辑但名称没变：更新或添加模板
            set((state) => {
              const existingIndex = state.templates.findIndex(
                (t) => t.name === config.name
              );
              if (existingIndex >= 0) {
                // 更新现有模板
                return {
                  templates: state.templates.map((t) =>
                    t.name === config.name ? result.data! : t
                  ),
                };
              } else {
                // 添加新模板
                return {
                  templates: [...state.templates, result.data!],
                };
              }
            });
          }
          return { success: true };
        } else {
          return {
            success: false,
            error: result.error || "保存失败",
          };
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "未知错误",
        };
      }
    },
    deleteTemplate: async (name: string) => {
      try {
        const result = await StampTemplateStorage.deleteTemplate(name);
        if (result.success) {
          set((state) => ({
            templates: state.templates.filter((t) => t.name !== name),
          }));
          return { success: true };
        } else {
          return {
            success: false,
            error: result.error || "删除失败",
          };
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "未知错误",
        };
      }
    },
  })
);
