import { bid } from "./moves";

const endIf = (G, ctx) => {
  let endGame = true;
  for (const combination of G.combinations) {
    if (combination.currentHolder === '')
      endGame = false;
  }
  if (endGame === true) return endGame;
};

const setup = ctx => {
  const mats = [
    'Industrial',
    'Engineering',
    'Mechanical',
    'Agricultural',
    'Patriotic',
    'Innovative',
    'Militant'
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
  let gameCombinations = [];
  let randomizedMats = ctx.random.Shuffle(mats);
  let randomizedFactions = ctx.random.Shuffle(factions);
  for (let j = 0; j < ctx.numPlayers ; j++) {
    const mat = randomizedMats.pop();
    const faction = randomizedFactions.pop();
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
