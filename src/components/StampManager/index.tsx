import { useState, useEffect } from "react";
import { StampSettingsModal } from "./StampSettingsModal";
import type { StampConfig } from "./types";
import { StampPreview } from "./StampPreview";
import { useSelectedStampStore } from "../../stores/selectedStamp";
import { useStampTemplatesStore } from "../../stores/stampTemplates";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  IoTrashOutline,
  IoSettingsOutline,
  IoArrowUndoOutline,
  IoHelpCircleOutline,
} from "react-icons/io5";
import { toast } from "sonner";

export function StampManager() {
  const templates = useStampTemplatesStore((state) => state.templates);
  const loadTemplates = useStampTemplatesStore((state) => state.loadTemplates);
  const selectedStamp = useSelectedStampStore((state) => state.selectedStamp);
  const setSelectedStamp = useSelectedStampStore((state) => state.setSelectedStamp);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStamp, setEditingStamp] = useState<StampConfig | undefined>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [stampToDelete, setStampToDelete] = useState<string | null>(null);
  

  // 确保 templates 已加载
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleAddStamp = () => {
    setEditingStamp(undefined);
    setIsModalOpen(true);
  };

  const handleSelectStamp = (stamp: StampConfig) => {
    if (selectedStamp != null && selectedStamp == stamp.name) {
      setSelectedStamp(null);
    } else {
      setSelectedStamp(stamp.name);
    }
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
      toast.error("保存失败: " + (result.error || "未知错误"));
    }

    setIsModalOpen(false);
    setEditingStamp(undefined);
  };

  const handleDeleteStamp = (name: string) => {
    setSelectedStamp(null);
    setStampToDelete(name);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!stampToDelete) return;

    const { deleteTemplate } = useStampTemplatesStore.getState();
    const result = await deleteTemplate(stampToDelete);
    if (!result.success) {
      console.error("删除印章模板失败:", result.error);
      toast.error("删除失败: " + (result.error || "未知错误"));
    }

    setIsDeleteDialogOpen(false);
    setStampToDelete(null);
  };

  return (
    <div className="w-full h-full flex gap-1 flex-row landscape:flex-col ">
      <div className="flex gap-1 portrait:flex-col landscape:flex-row">
        <button
          onClick={() => setEditMode(!editMode)}
          className={cn(
            "flex items-center justify-center text-black-500 hover:text-blue-500 transition-colors",
            "portrait:h-1/2 portrait:w-3 portrait:rounded-l-sm",
            "landscape:h-3 landscape:w-1/2 landscape:rounded-t-sm"
          )}
        >
          {editMode ? (
            <IoArrowUndoOutline className="w-3 h-3" />
          ) : (
            <IoSettingsOutline className="w-3 h-3" />
          )}
        </button>
        <button
          onClick={() => setIsHelpDialogOpen(true)}
          className={cn(
            "flex items-center justify-center text-black-500 hover:text-blue-500 transition-colors",
            "portrait:h-1/2 portrait:w-3 portrait:rounded-l-sm",
            "landscape:h-3 landscape:w-1/2 landscape:rounded-t-sm"
          )}
        >
          <IoHelpCircleOutline className="w-3 h-3" />
        </button>
      </div>
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
                className={cn(
                  "flex items-center justify-center border border-gray-500 rounded-lg hover:shadow-md transition-shadow cursor-pointer group relative aspect-square p-2 w-fit",
                  selectedStamp == stamp.name && "bg-blue-500/50"
                )}
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

      {/* 删除确认对话框 */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这个图章吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 帮助的对话框 */}
      <AlertDialog
        open={isHelpDialogOpen}
        onOpenChange={setIsHelpDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>使用帮助</AlertDialogTitle>
            <AlertDialogDescription>
              1. 点击图章可以选中图章，选中后在日历格子中添加，重复添加会删除<br/>
              2. 还没想好的说明还没想好的说明还没想好的说明还没想好的说明还没想好的说明还没想好的说明还没想好的说明<br/>
              3. 还没想好的说明
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>确定</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
