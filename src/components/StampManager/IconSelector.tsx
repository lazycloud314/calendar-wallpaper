import { useState } from "react";
import { iconNames, type IconName, getIconByName } from "../../lib/iconUtils";

export interface IconOption {
  name: IconName;
  component: React.ReactNode;
}

/**
 * 获取所有可用的图标选项
 */
export function getIconOptions(): IconOption[] {
  return iconNames.map((name) => {
    return {
      name,
      component: getIconByName(name),
    };
  });
}

const iconOptions = getIconOptions();

interface IconSelectorProps {
  selectedIcon?: React.ReactNode;
  selectedIconName?: string;
  onSelect: (iconName: string) => void;
}

export function IconSelector({
  selectedIcon,
  selectedIconName,
  onSelect,
}: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: IconOption) => {
    onSelect(option.name);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2">图章内图标</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-center min-h-[48px]"
      >
        {selectedIcon ? (
          <div className="flex items-center gap-2">
            {selectedIcon}
            <span className="text-sm text-gray-600">
              {iconOptions.find((opt) => opt.name === selectedIconName)?.name ||
                "已选择"}
            </span>
          </div>
        ) : (
          <span className="text-gray-400">选择图标</span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-3 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-6 gap-2">
              {iconOptions.map((option) => (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`p-[10%] rounded-lg border-2 transition-colors ${
                    selectedIconName === option.name
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    {option.component}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
