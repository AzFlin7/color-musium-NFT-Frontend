import { METADATA_SERVER_URL } from "../../constants/server";
import axios from "axios";

export const colorToHexString = (int) =>
  `#${int.toString(16).padStart(6, "0")}`;


  const getAllColorNFT = async () => {
    const response = await axios(METADATA_SERVER_URL);
    const data = await response.data;
    return data;
  };
  

export default getAllColorNFT 