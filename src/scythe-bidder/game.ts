import { Ctx, Game } from "boardgame.io";
import { factions, mats } from "./constants";
import { bid } from "./moves";
import {
  Combination,
  Faction,
  GameState,
  GameWithMinMaxPlayers,
  Mat,
} from "./types";

const endIf = (G: GameState) => {
  let endGame = true;
  for (const combination of G.combinations) {
    if (!combination.currentHolder) endGame = false;
  }
  if (endGame === true) return G.combinations;
};

const checkBannedCombos = (faction: Faction, mat: Mat) =>
  (faction === "Rusviet" && mat === "Industrial") ||
  (faction === "Crimea" && mat === "Patriotic");

const setup = (ctx: Ctx) => {
  let gameCombinations: Array<Combination> = [];
  let randomizedMats = ctx.random!.Shuffle([...mats]);
  let randomizedFactions = ctx.random!.Shuffle([...factions]);
  for (let j = 0; j < ctx.numPlayers; j++) {
    const mat = randomizedMats[j];
    const faction = randomizedFactions[j];
    if (j < 6) {
      if (checkBannedCombos(faction, mat)) {
        const temp = randomizedMats[j];
        randomizedMats[j] = randomizedMats[j + 1];
        randomizedMats[j + 1] = temp;
        j = j - 1;
      } else {
        const combination = {
          mat,
          faction,
          currentBid: -1,
          currentHolder: null,
        };
        gameCombinations.push(combination);
      }
    }
  }
  return {
    combinations: gameCombinations,
    players: {},
    endGame: false,
    gameLogger: ["Auction start!"],
  };
};

const getNextPlayer = (playerId: number, numPlayers: number) =>
  (playerId + 1) % numPlayers;

const hasMat = (
  playerId: number,
  combinations: Array<Combination>,
  playOrder: string[]
) => {
  const player = playOrder[playerId];
  for (const c of combinations) {
    if (parseInt(c.currentHolder?.id) === parseInt(player)) {
      return true;
    }
  }
  return false;
};

const turn = {
  order: {
    first: (G: GameState, ctx: Ctx) => 0,
    next: (G: GameState, ctx: Ctx) => {
      let nextPlayerPos = getNextPlayer(ctx.playOrderPos, ctx.numPlayers);
      while (hasMat(nextPlayerPos, G.combinations, ctx.playOrder)) {
        nextPlayerPos = getNextPlayer(nextPlayerPos, ctx.numPlayers);
      }
      return nextPlayerPos;
    },
    playOrder: (G: GameState, ctx: Ctx) => ctx.random!.Shuffle(ctx.playOrder),
  },
};

const ScytheBidderGame: GameWithMinMaxPlayers = {
  name: "scythe-bidder",
  setup,
  moves: {
    bid,
  },
  endIf,
  turn,
  minPlayers: 2,
  maxPlayers: 7,
};

export default ScytheBidderGame;
