export type BridgeType = 'FCM_TOKEN' | 'REQ_CAMERA_PERMISSION' | 'NO_KAKAO';

export interface Bridge {
  type: BridgeType;
  message?: string;
}
