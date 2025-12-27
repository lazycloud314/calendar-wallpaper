import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { StampPreview } from "./StampPreview";
import { IconSelector } from "./IconSelector";
import { ColorSelector } from "./ColorSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { StampConfig, StampVariant } from "./types";
import { getIconByName } from "../../lib/iconUtils";
import { toast } from "sonner";

interface StampSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: StampConfig) => void;
  initialConfig?: StampConfig;
}

const DEFAULT_STAMP_CONFIG: StampConfig = {
  name: "",
  variant: "circle",
  color: "#ef4444",
  iconName: "star",
  iconType: "icon",
};

export function StampSettingsModal({
  isOpen,
  onClose,
  onSave,
  initialConfig,
}: StampSettingsModalProps) {
  const [stampConfig, setStampConfig] = useState<StampConfig>(
    initialConfig || DEFAULT_STAMP_CONFIG
  );

  useEffect(() => {
    if (initialConfig) {
      setStampConfig(initialConfig);
    } else {
      setStampConfig(DEFAULT_STAMP_CONFIG);
    }
  }, [initialConfig, isOpen]);

  const handleSave = () => {
    if (!stampConfig.name.trim()) {
      toast.error("请输入图章描述");
      return;
    }
    onSave(stampConfig);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed w-screen h-screen inset-0 z-50 flex items-center justify-center p-8">
      {/* 半透明模糊背景 */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 设置面板 */}
      <div
        className="relative z-10 bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 @container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">图章设置</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 @md:grid-cols-2 gap-6 @md:[grid-template-rows:auto_auto_auto]">
            {/* 图章预览 */}
            <div className="flex items-center justify-center @md:row-span-3">
              <div className="w-full">
                <label className="block text-sm font-medium mb-2">
                  图章预览
                </label>
                <StampPreview stampConfig={stampConfig} />
              </div>
            </div>

            {/* 描述壁纸无法接受输入，考虑在用户设置中添加 */}
            {/* <div>
              <label className="block text-sm font-medium mb-2">描述</label>
              <input
                type="text"
                value={stampConfig.name}
                onChange={(e) =>
                  setStampConfig(
                    (prev: StampConfig): StampConfig => ({
                      ...prev,
                      name: e.target.value,
                    })
                  )
                }
                placeholder="输入图章描述"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}

            {/* 图章样式 */}
            <div>
              <label className="block text-sm font-medium mb-2">图章样式</label>
              <Select
                value={stampConfig.variant}
                onValueChange={(value) =>
                  setStampConfig(
                    (prev: StampConfig): StampConfig => ({
                      ...prev,
                      variant: value as StampVariant,
                    })
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="circle">圆形</SelectItem>
                  <SelectItem value="square">方形</SelectItem>
                  <SelectItem value="star">星形</SelectItem>
                  <SelectItem value="heart">心形</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 图章内图标 */}
            <div>
              <IconSelector
                selectedIcon={getIconByName(stampConfig.iconName)}
                selectedIconName={stampConfig.iconName}
                onSelect={(selectedIconName) => {
                  setStampConfig(
                    (prev: StampConfig): StampConfig => ({
                      ...prev,
                      iconName: selectedIconName,
                      name: selectedIconName,
                    })
                  );
                }}
              />
            </div>

            {/* 颜色 */}
            <div>
              <ColorSelector
                selectedColor={stampConfig.color}
                onSelect={(color) =>
                  setStampConfig(
                    (prev: StampConfig): StampConfig => ({ ...prev, color })
                  )
                }
              />
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
