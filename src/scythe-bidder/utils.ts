import Lockr from "lockr";
import { PLAYER_NAME, CREDENTIALS, CURRENT_MATCH_INFO } from "./constants";
import { Faction } from "./types";

import Albion from "./static/images/Albion.webp";
import Crimea from "./static/images/Crimea.webp";
import Nordic from "./static/images/Nordic.webp";
import Polania from "./static/images/Polania.webp";
import Rusviet from "./static/images/Rusviet.webp";
import Saxony from "./static/images/Saxony.webp";
import Togawa from "./static/images/Togawa.webp";

export const cleanupAfterLogout = () => {
  Lockr.rm(PLAYER_NAME);
  Lockr.rm(CREDENTIALS);
  Lockr.rm(CURRENT_MATCH_INFO);
};

export function getFactionIcon(faction: Faction) {
  switch (faction) {
    case "Albion":
      return Albion;

    case "Togawa":
      return Togawa;

    case "Nordic":
      return Nordic;

    case "Rusviet":
      return Rusviet;

    case "Crimea":
      return Crimea;

    case "Saxony":
      return Saxony;

    case "Polania":
      return Polania;
  }
}
