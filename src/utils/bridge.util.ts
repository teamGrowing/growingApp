import { Bridge, BridgeType } from 'types/BridgeType';

export const createWebViewMessage = (type: BridgeType, message?: string) =>
  JSON.stringify({ type, message });

export const getWebViewMessage = (data: string) => {
  const receivedMessage: Bridge = JSON.parse(data);
  const { type, message } = receivedMessage;
  return { type, message };
};
