import { Faction, FactionMatCombinations, Mat } from "./types";
import cloneDeep from "lodash/cloneDeep";

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

export const MATS_HI = [
  "Industrial",
  "Militant",
  "Patriotic",
  "Innovative",
  "Mechanical",
] as const;

export const FACTIONS_HI = [
  "Crimea",
  "Saxony",
  "Polania",
  "Nordic",
  "Rusviet",
] as const;

export const MATS_LO = [
  "Industrial",
  "Engineering",
  "Patriotic",
  "Mechanical",
  "Agricultural",
] as const;

export const FACTIONS_LO = [
  "Togawa",
  "Saxony",
  "Polania",
  "Albion",
  "Nordic",
] as const;

export const BANNED_COMBOS = [
  { faction: "Rusviet", mat: "Industrial" },
  { faction: "Crimea", mat: "Patriotic" },
] as const;

export const SCYTHE_BIDDER = "scythe-bidder";

export const PLAYER_NAME = "playerName";
export const CREDENTIALS = "credentials";
export const CURRENT_MATCH_INFO = "currentMatchInfo";

export const NOTIFICATION_ENABLED = "notificationEnabled";

export const DARK_THEME = "darkTheme";

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 7;

export const MAX_PLAYERS_BASE = 5;
export const MAX_PLAYERS_IFA = 7;

export const DESELECT_ALL = FACTIONS_IFA.reduce(
  (acc, curr) => ({
    ...acc,
    [curr]: MATS_IFA.reduce((a, c) => ({ ...a, [c]: false }), {}),
  }),
  {} as FactionMatCombinations
);

function fmFactory(
  factions: ReadonlyArray<Faction>,
  mats: ReadonlyArray<Mat>,
  removeBannedCombos = true
) {
  const result = cloneDeep(DESELECT_ALL);
  factions.forEach((f) => {
    mats.forEach((m) => {
      result[f][m] = true;
    });
  });

  if (removeBannedCombos) {
    BANNED_COMBOS.forEach(({ faction, mat }) => (result[faction][mat] = false));
  }

  return result;
}

const NO_IFA = cloneDeep(DESELECT_ALL);
FACTIONS_BASE.forEach((f) => {
  MATS_BASE.forEach((m) => {
    NO_IFA[f][m] = true;
  });
});

export const DEFAULT_COMBOS = fmFactory(FACTIONS_IFA, MATS_IFA);

export const PRESETS = [
  { label: "Deselect all", value: DESELECT_ALL, hide: true },
  { label: "IFA", value: DEFAULT_COMBOS },
  { label: "Base, no IFA", value: fmFactory(FACTIONS_BASE, MATS_BASE) },
  { label: "Hi tier", value: fmFactory(FACTIONS_HI, MATS_HI) },
  { label: "Lo tier", value: fmFactory(FACTIONS_LO, MATS_LO) },
  { label: "Anything goes", value: fmFactory(FACTIONS_IFA, MATS_IFA, false) },
];
