export const MATS_BASE = [
  "Industrial",
  "Engineering",
  "Patriotic",
  "Mechanical",
  "Agricultural",
] as const;

export const FACTIONS_BASE = [
  "Crimea",
  "Saxony",
  "Polania",
  "Nordic",
  "Rusviet",
] as const;

export const MATS_IFA = [
  "Industrial",
  "Engineering",
  "Militant",
  "Patriotic",
  "Innovative",
  "Mechanical",
  "Agricultural",
] as const;

export const FACTIONS_IFA = [
  "Togawa",
  "Crimea",
  "Saxony",
  "Polania",
  "Albion",
  "Nordic",
  "Rusviet",
] as const;

export const SCYTHE_BIDDER = "scythe-bidder";

export const PLAYER_NAME = "playerName";
export const CREDENTIALS = "credentials";
export const CURRENT_MATCH_INFO = "currentMatchInfo";

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 7;

export const MAX_PLAYERS_BASE = 5;
export const MAX_PLAYERS_IFA = 7;

const MAT_IMAGES:  { [key: string]: string } = {};
MATS_IFA.forEach((mat,idx) => {
  MAT_IMAGES[mat] = process.env.PUBLIC_URL + "/" + mat + ".png";
})
export {MAT_IMAGES};
