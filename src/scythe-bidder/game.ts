import { Ctx } from "boardgame.io";
import { factions, mats } from "./constants";
import { bid } from "./moves";
import {
  Combination,
  CombinationWithBid,
  Faction,
  GameState,
  GameWithMinMaxPlayers,
  Mat,
} from "./types";

const matToIdx: { [key: string]: number } = {};
mats.forEach((mat, idx) => {
  matToIdx[mat] = idx;
});

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

/*
  orderCombos() takes in an array of faction/player mat combinations
  and returns them in  the order in which they will play. 
  The player mat with the lowest starting priority (represented 
  here by their index in the 'mats' array) goes first, then the 
  other combinations follow in clockwise order determined by the 
  placement of their faction on the board relative to
  the first player.
*/

const orderCombos = (combinations: Array<CombinationWithBid>) => {
  const firstCombo = combinations.reduce(
    (firstSoFar: CombinationWithBid | null, currentCombo) => {
      if (
        firstSoFar === null ||
        matToIdx[currentCombo.mat] < matToIdx[firstSoFar.mat]
      ) {
        return currentCombo;
      }
      return firstSoFar;
    },
    null
  );

  if (!firstCombo) {
    return combinations;
  }

  // Find the index of the faction that will go first
  const startingIdx = factions.findIndex(
    (faction) => faction === firstCombo.faction
  );

  const combosByFaction: { [key: string]: CombinationWithBid } = {};
  combinations.forEach((combo) => {
    combosByFaction[combo.faction] = combo;
  });

  // Iterate through factions starting with the one that goes first,
  // adding any combinations that are in play to the result
  const orderedCombos = [];
  for (let i = 0; i < factions.length; i++) {
    const currentFaction = factions[(startingIdx + i) % factions.length];
    if (combosByFaction[currentFaction]) {
      orderedCombos.push(combosByFaction[currentFaction]);
    }
  }
  return orderedCombos;
};

const setup = (ctx: Ctx) => {
  let gameCombinations: Array<CombinationWithBid> = [];
  const remainingCombos: { [key: string]: Array<Mat> } = {};
  for (const faction of factions) {
    remainingCombos[faction] = [
      ...mats.filter((mat) => !checkBannedCombos(faction as Faction, mat)),
    ];
  }
  for (let i = 0; i < ctx.numPlayers; i++) {
    const remainingFactions = Object.keys(remainingCombos);
    const pickedFaction =
      remainingFactions[Math.floor(Math.random() * remainingFactions.length)];
    const remainingPlayerMats = remainingCombos[pickedFaction];
    const pickedPlayerMat =
      remainingPlayerMats[
        Math.floor(Math.random() * remainingPlayerMats.length)
      ];

    remainingFactions.forEach((faction) =>
      remainingCombos[faction].filter((mat) => mat !== pickedPlayerMat)
    );
    delete remainingCombos[pickedFaction];

    gameCombinations.push({
      faction: pickedFaction as Faction,
      mat: pickedPlayerMat as Mat,
      currentBid: -1,
      currentHolder: null,
    });
  }

  return {
    combinations: orderCombos(gameCombinations),
    players: {},
    endGame: false,
    gameLogger: ["Auction start!"],
  };
};

const getNextPlayer = (playerId: number, numPlayers: number) =>
  (playerId + 1) % numPlayers;

const hasMat = (
  playerId: number,
  combinations: Array<CombinationWithBid>,
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
