export type StampVariant = "circle" | "square" | "star" | "heart";
export type StampIconType = "icon" | "text";

export interface StampConfig {
  name: string;
  variant: StampVariant;
  color: string;
  iconName: string; // 用于存储图标名称，方便序列化
  iconType: StampIconType;
}
