import { combineReducers } from "redux";
import toggle from "./toggle";
import emailForm from "./emailForm";
import updateMint from "./updateMint";
import minting from "./minting";
import warning from "./warning";
import data from "./data";
import notification from "./notification";

export default combineReducers({
  toggle: toggle,
  emailForm: emailForm,
  updateMint: updateMint,
  minting: minting,
  warning: warning,
  data: data,
  notification: notification,
});
