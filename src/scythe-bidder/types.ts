import { Game } from "boardgame.io";
import { FACTIONS_IFA as FACTIONS, MATS_IFA as MATS } from "./constants";

export type Mat = typeof MATS[number];
export type Faction = typeof FACTIONS[number];

export function getMat(s: string): Mat {
  const mat = MATS.find((m) => m === s);

  if (!mat) {
    throw new Error("not mat");
  }

  return mat;
}

export function getFaction(s: string): Faction {
  const faction = FACTIONS.find((f) => f === s);

  if (!faction) {
    throw new Error(`${s} not faction`);
  }

  return faction;
}

export type Player = {
  id: any;
  name?: string;
};

export type Combination = {
  mat: Mat;
  faction: Faction;
};

export interface CombinationWithBid extends Combination {
  currentBid: number;
  currentHolder: Player | null;
}

export type GameState = {
  combinations: Array<CombinationWithBid>;
  players: {
    [key: string]: Player;
  };
  endGame: boolean;
  gameLogger: Array<string>;
};

export type ClientSideBid = (
  faction: Faction,
  mat: Mat,
  bid: number,
  player: Player
) => void;

export interface GameWithMinMaxPlayers extends Game {
  minPlayers: number;
  maxPlayers: number;
}

export type MatchInfo = {
  matchId: string;
  playerId?: string;
  numPlayers: number;
};

export type FactionMatCombinations = {
  [key in Faction]: { [key in Mat]: boolean };
};

export enum FMComboActionType {
  TOGGLE,
  PRESET,
  FACTION_TOGGLE,
  MAT_TOGGLE,
}

export type FMComboAction =
  | {
      type: FMComboActionType.TOGGLE;
      faction: Faction;
      mat: Mat;
      value: boolean;
    }
  | {
      type: FMComboActionType.PRESET;
      preset: FactionMatCombinations;
    }
  | {
      type: FMComboActionType.FACTION_TOGGLE;
      faction: Faction;
      value: boolean;
    }
  | {
      type: FMComboActionType.MAT_TOGGLE;
      mat: Mat;
      value: boolean;
    };
