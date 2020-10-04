import Lockr from "lockr";
import { PLAYER_NAME, CREDENTIALS, CURRENT_MATCH_INFO } from "./constants";

export const cleanupAfterLogout = () => {
  Lockr.rm(PLAYER_NAME);
  Lockr.rm(CREDENTIALS);
  Lockr.rm(CURRENT_MATCH_INFO);
};
