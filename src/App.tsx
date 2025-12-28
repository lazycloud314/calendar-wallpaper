import { useEffect } from "react";
import { Calendar } from "./components/Calendar";
import { StampManager } from "./components/StampManager";
import { useStampTemplatesStore } from "./stores/stampTemplates";
import { Toaster } from "./components/ui/sonner";
import { BackupClick } from "./components/BackupClick";
import { Background } from "./components/Background";
import { cn } from "@/lib/utils";

function App() {
  const isLoaded = useStampTemplatesStore((state) => state.isLoaded);
  const loadTemplates = useStampTemplatesStore((state) => state.loadTemplates);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  return (
    <>
      <Background />
      <BackupClick />
      <div className="relative bg-transparent z-10 w-screen h-screen portrait:py-[10%] portrait:px-[1%] landscape:py-[2%] landscape:px-[5%] flex flex-col landscape:flex-row items-center justify-between overflow-hidden scrollbar-hide">
        <div
          className={cn(
            // 玻璃态效果 - 半透明白色背景 + 强模糊
            "bg-white/80 dark:bg-gray-900/80",
            "backdrop-blur-xl",
            "border border-white/30 dark:border-white/10",
            "shadow-2xl shadow-black/10 dark:shadow-black/30",
            "rounded-xl",
            // 竖屏样式（默认）
            "w-[95%] min-h-[50%] max-h-[70%] min-w-none max-w-none",
            // 横屏样式
            "landscape:h-[90%] landscape:min-w-[40%] landscape:max-w-[60%] landscape:min-h-none landscape:max-h-none"
          )}
        >
          <Calendar />
        </div>
        <div
          className={cn(
            // 玻璃态效果 - 半透明白色背景 + 强模糊
            "bg-white/80 dark:bg-gray-900/80",
            "backdrop-blur-xl",
            "border border-white/30 dark:border-white/10",
            "shadow-2xl shadow-black/10 dark:shadow-black/30",
            "rounded-xl p-2",
            // 竖屏样式
            "portrait:w-[95%] portrait:h-fit portrait:py-2 portrait:pl-0.5 portrait:pr-2",
            // 横屏样式
            "landscape:w-fit landscape:h-[90%] landscape:px-2 landscape:pt-0.5 landscape:pb-2"
          )}
        >
          {isLoaded && <StampManager />}
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default App;
