import { bid } from "./moves";


const mats = [
  'Industrial',
  'Engineering',
  'Militant'
  'Patriotic',
  'Innovative',
  'Mechanical',
  'Agricultural',
];

const factions = [
  'Togawa',
  'Crimea',
  'Saxony',
  'Polania',
  'Albion',
  'Nordic',
  'Rusviet'
];

const endIf = (G, ctx) => {
  let endGame = true;
  for (const combination of G.combinations) {
    if (combination.currentHolder === '')
      endGame = false;
  }
  if (endGame === true) return endGame;
};

const checkBannedCombos = (faction, mat) => (
  (
    (faction == 'Rusviet' && mat == 'Industrial') ||
    (faction == 'Crimea' && mat == 'Patriotic')
  )
)

const setup = ctx => {
  let gameCombinations = [];
  let randomizedMats = ctx.random.Shuffle(mats);
  let randomizedFactions = ctx.random.Shuffle(factions);
  for (let j = 0; j < ctx.numPlayers ; j++) {
    const mat = randomizedMats[j];
    const faction = randomizedFactions[j];
    if (j < 6) {
      if (checkBannedCombos(faction, mat)) {
        const temp = randomizedMats[j];
        randomizedMats[j] = randomizedMats[j+1];
        randomizedMats[j+1] = temp;
        j = j - 1;
      }
    }
    const combination = {mat, faction, currentBid:-1, currentHolder: ''};
    gameCombinations.push(combination);
  }
  return {
    combinations: gameCombinations,
    players: {},
    endGame: false
  };
};

const getNextPlayer = (playerId, numPlayers) => (
    (playerId + 1) % numPlayers
)

const hasMat = (playerId, combinations) => {
  for (const c of combinations) {
    if (parseInt(c.currentHolder.id) === parseInt(playerId)) {
      return true;
    }
  }
  return false;
};

const turn = {
  order: {
    first: (G, ctx) => 0,
    next: (G, ctx) => {
      let nextPlayer = getNextPlayer(ctx.playOrderPos, ctx.numPlayers);
      while (hasMat(nextPlayer, G.combinations)) {
        nextPlayer = getNextPlayer(nextPlayer, ctx.numPlayers)
      }
      return nextPlayer;
    }
  }
};

const ScytheBidderGame = {
  name: 'scythe-bidder',
  setup,
  moves: {
    bid,
  },
  endIf,
  turn
};

export default ScytheBidderGame
