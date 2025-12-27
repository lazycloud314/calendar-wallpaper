import { useSelectedStampStore } from "@/stores/selectedStamp";

export function BackupClick() {
  const { setSelectedStamp } = useSelectedStampStore();
  const onClick = (e: React.MouseEvent) => {
    console.log("back onClick");
    setSelectedStamp(null);
  };
  return (
    <div
      className="absolute top-0 left-0 w-full h-full"
      onClick={onClick}
    ></div>
  );
}
