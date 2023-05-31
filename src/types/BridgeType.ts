export type BridgeType = 'FCM_TOKEN' | 'REQ_CAMERA_PERMISSION';

export interface Bridge {
  type: BridgeType;
  message?: string;
}
