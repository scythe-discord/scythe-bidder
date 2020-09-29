import { Game } from "boardgame.io";
import { factions, mats } from "./constants";

export type Mat = typeof mats[number];
export type Faction = typeof factions[number];

export type Player = {
  id: any;
  name: string;
};

export type Combination = {
  mat: Mat;
  faction: Faction;
  currentBid: number;
  currentHolder: Player | null;
};

export type GameState = {
  combinations: Array<Combination>;
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
