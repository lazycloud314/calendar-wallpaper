import { Stamp } from "../Stamp";
import { type StampConfig } from "./types";

interface StampPreviewProps {
  stampConfig: StampConfig;
  showName?: boolean;
}
 
export function StampPreview({
  stampConfig,
  showName = true,
}: StampPreviewProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg">
      <Stamp stampConfig={stampConfig} size="large" />
      {showName && (
        <span className="text-sm font-medium">{stampConfig.name}</span>
      )}
    </div>
  );
}
