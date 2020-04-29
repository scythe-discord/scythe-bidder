const bid = (G, ctx, faction, mat, bidValue, player) => {
  const newCombination = {
    currentHolder: {...player}, 
    faction, mat, currentBid: bidValue
  };
  const newCombinations = G.combinations.map(el => el.mat === mat ? {...el, ...newCombination}: el);
  const msg = [`${player.name} bids $${bidValue} on ${faction} ${mat}`];
  return {
    ...G,
    combinations: newCombinations,
    gameLogger: [...msg, ...G.gameLogger],
  };
};

export { bid };
