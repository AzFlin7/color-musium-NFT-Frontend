import { NOTIFICATION_COUNT, NOTIFICATION_ON, NOTIFICATION_OFF } from "../";

export const notifictionCount = (payload) => ({
  type: NOTIFICATION_COUNT,
  payload: payload,
});

export const notificationOn = () => ({
  type: NOTIFICATION_ON,
});

export const notificationOff = () => ({
  type: NOTIFICATION_OFF,
});