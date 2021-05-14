import { NOTIFICATION_COUNT, NOTIFICATION_ON, NOTIFICATION_OFF } from "../../actions";

const initialState = {
  notificationCount: null,
  notificationSlide: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_COUNT:
      return { ...state, notificationCount: action.payload };
    case NOTIFICATION_ON:
      const newNotificationOn = { ...state, ...action.payload };
      newNotificationOn.notificationSlide = true;
      return newNotificationOn;
    case NOTIFICATION_OFF:
      const newNotificationOff = { ...state, ...action.payload };
      newNotificationOff.notificationSlide = false;
      return newNotificationOff;
    default:
      return state;
  }
};

export default reducer;
