import { useEffect } from "react";
import { Calendar } from "./components/Calendar";
import { StampManager } from "./components/StampManager";
import { useStampTemplatesStore } from "./stores/stampTemplates";
import { cn } from "@/lib/utils";
import bg from "./assets/bg.jpg";

function App() {
  const { loadTemplates, isLoaded } = useStampTemplatesStore();

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  return (
    <div
      className="w-screen h-screen p-[2%] flex flex-col landscape:flex-row items-center justify-between "
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className={cn(
          "bg-white-500/60 backdrop-blur-md shadow-sm rounded-xl",
          // 竖屏样式（默认）
          "w-[90%] min-h-[50%] max-h-[70%] min-w-none max-w-none",
          // 横屏样式
          "landscape:h-[75%] landscape:min-w-[40%] landscape:max-w-[70%] landscape:min-h-none landscape:max-h-none"
        )}
      >
        <Calendar />
      </div>
      <div
        className={cn(
          "bg-white-500/60 backdrop-blur-md shadow-sm rounded-xl p-2",
          // 竖屏样式
          "portrait:w-[90%] portrait:h-fit portrait:py-2 portrait:pl-0.5 portrait:pr-2",
          // 横屏样式
          "landscape:w-fit landscape:h-[75%] landscape:px-2 landscape:pt-0.5 landscape:pb-2"
        )}
      >
        {isLoaded && <StampManager />}
      </div>
    </div>
  );
}

export default App;
