import { Ctx } from "boardgame.io";
import { MAX_PLAYERS_BASE, MAX_PLAYERS_IFA, MIN_PLAYERS, SCYTHE_BASE, SCYTHE_IFA } from "./constants";
import { factions_base, factions_ifa, mats_base, mats_ifa } from "./constants";
import { bid } from "./moves";
import {
  CombinationWithBid,
  Faction,
  GameState,
  GameWithMinMaxPlayers,
  Mat,
} from "./types";

const matToIdxBase: { [key: string]: number } = {};
mats_base.forEach((mat, idx) => {
  matToIdxBase[mat] = idx;
});

const matToIdxIFA: { [key: string]: number } = {};
mats_ifa.forEach((mat, idx) => {
  matToIdxIFA[mat] = idx;
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
        matToIdxIFA[currentCombo.mat] < matToIdxIFA[firstSoFar.mat]
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
  const startingIdx = factions_ifa.findIndex(
    (faction) => faction === firstCombo.faction
  );

  const combosByFaction: { [key: string]: CombinationWithBid } = {};
  combinations.forEach((combo) => {
    combosByFaction[combo.faction] = combo;
  });

  // Iterate through factions starting with the one that goes first,
  // adding any combinations that are in play to the result
  const orderedCombos = [];
  for (let i = 0; i < factions_ifa.length; i++) {
    const currentFaction = factions_ifa[(startingIdx + i) % factions_ifa.length];
    if (combosByFaction[currentFaction]) {
      orderedCombos.push(combosByFaction[currentFaction]);
    }
  }
  return orderedCombos;
};

const setup = (ctx: Ctx) => {
  let gameCombinations: Array<CombinationWithBid> = [];
  const remainingCombos: { [key: string]: Array<Mat> } = {};
  for (const faction of factions_base) {
    remainingCombos[faction] = [
      ...mats_base.filter((mat) => !checkBannedCombos(faction as Faction, mat)),
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

    remainingFactions.forEach(
      (faction) =>
        (remainingCombos[faction] = remainingCombos[faction].filter(
          (mat) => mat !== pickedPlayerMat
        ))
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
const setup_ifa = (ctx: Ctx) => {
  let gameCombinations: Array<CombinationWithBid> = [];
  const remainingCombos: { [key: string]: Array<Mat> } = {};
  for (const faction of factions_ifa) {
    remainingCombos[faction] = [
      ...mats_ifa.filter((mat) => !checkBannedCombos(faction as Faction, mat)),
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

    remainingFactions.forEach(
      (faction) =>
        (remainingCombos[faction] = remainingCombos[faction].filter(
          (mat) => mat !== pickedPlayerMat
        ))
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
  name: SCYTHE_BASE,
  setup,
  moves: {
    bid,
  },
  endIf,
  turn,
  minPlayers: MIN_PLAYERS,
  maxPlayers: MAX_PLAYERS_BASE,
};

const ScytheBidderGameIFA: GameWithMinMaxPlayers = {
  name: SCYTHE_IFA,
  setup: setup_ifa,
  moves: {
    bid,
  },
  endIf,
  turn,
  minPlayers: MIN_PLAYERS,
  maxPlayers: MAX_PLAYERS_IFA,
};

export default ScytheBidderGame;
export {ScytheBidderGameIFA};
