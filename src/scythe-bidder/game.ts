import { Ctx } from "boardgame.io";
import {
  FACTIONS_IFA as FACTIONS,
  MATS_IFA as MATS,
  MAX_PLAYERS,
  MIN_PLAYERS,
  SCYTHE_BIDDER,
} from "./constants";
import { bid } from "./moves";
import {
  CombinationWithBid,
  Faction,
  FactionMatCombinations,
  GameState,
  GameWithMinMaxPlayers,
  getFaction,
  getMat,
  Mat,
} from "./types";

const matToIdx: { [key: string]: number } = {};
MATS.forEach((mat, idx) => {
  matToIdx[mat] = idx;
});

const endIf = (G: GameState) => {
  let endGame = true;
  for (const combination of G.combinations) {
    if (!combination.currentHolder) endGame = false;
  }
  if (endGame === true) return G.combinations;
};

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
  const startingIdx = FACTIONS.findIndex(
    (faction) => faction === firstCombo.faction
  );

  const combosByFaction: { [key: string]: CombinationWithBid } = {};
  combinations.forEach((combo) => {
    combosByFaction[combo.faction] = combo;
  });

  // Iterate through factions starting with the one that goes first,
  // adding any combinations that are in play to the result
  const orderedCombos = [];
  for (let i = 0; i < FACTIONS.length; i++) {
    const currentFaction = FACTIONS[(startingIdx + i) % FACTIONS.length];
    if (combosByFaction[currentFaction]) {
      orderedCombos.push(combosByFaction[currentFaction]);
    }
  }
  return orderedCombos;
};

class Combination {
  faction: Faction;
  mat: Mat;

  constructor(faction: Faction, mat: Mat) {
    this.faction = faction;
    this.mat = mat;
  }

  toString() {
    return `${this.faction}:${this.mat}`;
  }

  static parse(comboString: string) {
    const match = comboString.match(/(?<faction>\w+):(?<mat>\w+)/);

    if (!match?.groups) {
      throw new Error(`Invalid combo string ${comboString}`);
    }

    const { faction, mat } = match.groups;

    const f = getFaction(faction);
    const m = getMat(mat);

    return new Combination(f, m);
  }
}

const assignCombos = (
  numPlayers: number,
  combos: Array<Combination>,
  assignments: Array<Combination>
): Array<Combination> | null => {
  if (assignments.length === numPlayers) {
    return assignments;
  }

  if (combos.length === 0) {
    return null;
  }

  for (let combo of combos) {
    assignments.push(combo);
    const validCombos = combos.filter(
      (c) => c.faction !== combo.faction && c.mat !== combo.mat
    );

    const foundAssignments: Array<Combination> | null = assignCombos(
      numPlayers,
      validCombos,
      assignments
    );

    if (foundAssignments) {
      return foundAssignments;
    }
    assignments.pop();
  }

  return null;
};

const setup = (
  ctx: Ctx,
  { combosMap }: { combosMap: FactionMatCombinations }
) => {
  const combinations: Array<Combination> = [];
  Object.entries(combosMap).forEach(([f, matsObj]) => {
    Object.entries(matsObj).forEach(([m, v]) => {
      if (v) {
        combinations.push(new Combination(f as Faction, m as Mat));
      }
    });
  });

  const shuffledCombos = ctx.random!.Shuffle(combinations);

  const assignments = assignCombos(ctx.numPlayers, shuffledCombos, []);

  if (!assignments) {
    throw new Error("No valid assignments found");
  }

  return {
    combinations: orderCombos(
      assignments.map(({ faction, mat }) => ({
        faction,
        mat,
        currentBid: -1,
        currentHolder: null,
      }))
    ),
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
  name: SCYTHE_BIDDER,
  setup,
  moves: {
    bid,
  },
  endIf,
  turn,
  minPlayers: MIN_PLAYERS,
  maxPlayers: MAX_PLAYERS,
};

export default ScytheBidderGame;
