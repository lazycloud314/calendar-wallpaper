import { useState, useEffect } from "react";
import { StampSettingsModal } from "./StampSettingsModal";
import type { StampConfig } from "./types";
import { StampPreview } from "./StampPreview";
import { useSelectedStampStore } from "../../stores/selectedStamp";
import { useStampTemplatesStore } from "../../stores/stampTemplates";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { cn } from "@/lib/utils";
import {
  IoTrashOutline,
  IoSettingsOutline,
  IoArrowUndoOutline,
} from "react-icons/io5";

export function StampManager() {
  const { templates, loadTemplates } = useStampTemplatesStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStamp, setEditingStamp] = useState<StampConfig | undefined>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const { setSelectedStamp } = useSelectedStampStore();

  // 确保 templates 已加载
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleAddStamp = () => {
    setEditingStamp(undefined);
    setIsModalOpen(true);
  };

  const handleSelectStamp = (stamp: StampConfig) => {
    setSelectedStamp(stamp.name);
  };

  const handleEditStamp = (stamp: StampConfig, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStamp(stamp);
    setIsModalOpen(true);
    setSelectedStamp(null);
  };

  const handleSaveStamp = async (config: {
    name: string;
    variant: StampConfig["variant"];
    color: string;
    iconName: string;
  }) => {
    const { saveTemplate } = useStampTemplatesStore.getState();

    const result = await saveTemplate(
      {
        name: config.name,
        variant: config.variant,
        color: config.color,
        iconName: config.iconName,
        iconType: "icon",
      },
      editingStamp?.name
    );

    if (!result.success) {
      console.error("保存印章模板失败:", result.error);
      alert("保存失败: " + (result.error || "未知错误"));
    }

    setIsModalOpen(false);
    setEditingStamp(undefined);
  };

  const handleDeleteStamp = async (name: string) => {
    setSelectedStamp(null);
    if (confirm("确定要删除这个图章吗？")) {
      const { deleteTemplate } = useStampTemplatesStore.getState();
      const result = await deleteTemplate(name);
      if (!result.success) {
        console.error("删除印章模板失败:", result.error);
        alert("删除失败: " + (result.error || "未知错误"));
      }
    }
  };

  return (
    <div className="w-full h-full flex gap-1 flex-row landscape:flex-col ">
      <button
        onClick={() => setEditMode(!editMode)}
        className={cn(
          "flex items-center justify-center text-white",
          "portrait:h-full portrait:w-3 portrait:rounded-l-sm",
          "landscape:h-3 landscape:w-full landscape:rounded-t-sm"
        )}
      >
        {editMode ? (
          <IoArrowUndoOutline className="w-3 h-3" />
        ) : (
          <IoSettingsOutline className="w-3 h-3" />
        )}
      </button>
      <div
        className={cn(
          "grid gap-2 custom-scrollbar",
          // 竖屏：2行，列方向流动，横向滚动
          "portrait:grid-rows-2 portrait:grid-flow-col portrait:auto-cols-[minmax(clamp(4rem,7vw,5rem),1fr)] portrait:overflow-x-auto portrait:overflow-y-hidden",
          // 横屏：2列，行方向流动，纵向滚动
          "landscape:grid-cols-2 landscape:grid-flow-row landscape:auto-rows-[minmax(clamp(4rem,7vw,5rem),1fr)] landscape:overflow-x-hidden landscape:overflow-y-auto"
        )}
      >
        {/* 已添加的图章 */}
        {templates.map((stamp, index) => (
          <Tooltip key={index} delayDuration={2000}>
            <TooltipTrigger asChild>
              <div
                className="flex items-center justify-center border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group relative aspect-square p-2 w-fit"
                onClick={() => handleSelectStamp(stamp)}
              >
                <StampPreview stampConfig={stamp} showName={false} />
                {editMode && (
                  <>
                    <button
                      onClick={(e) => handleEditStamp(stamp, e)}
                      className="absolute top-0 w-full h-1/2 rounded-t-lg bg-black/30 hover:bg-black/50 text-white hover:text-blue-700 transition-opacity border-b flex items-center justify-center"
                      title="编辑"
                    >
                      <IoSettingsOutline className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStamp(stamp.name);
                      }}
                      className="absolute top-[50%] w-full h-1/2 rounded-b-lg bg-black/30 hover:bg-black/50 text-white hover:text-red-700 transition-opacity flex items-center justify-center"
                      title="删除"
                    >
                      <IoTrashOutline className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{stamp.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        {/* 添加图章按钮 */}
        <button
          onClick={handleAddStamp}
          className="flex flex-row items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors aspect-square w-fit"
        >
          <div className="text-3xl text-gray-400">+</div>
        </button>
      </div>

      {/* 设置弹窗 */}
      <StampSettingsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStamp(undefined);
        }}
        onSave={handleSaveStamp}
        initialConfig={editingStamp}
      />
    </div>
  );
}
