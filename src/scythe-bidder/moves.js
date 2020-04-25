const bid = (G, ctx, faction, mat, bidValue, player) => {
  const newCombination = {
    currentHolder: {...player}, 
    faction, mat, currentBid: bidValue
  };
  const newCombinations = G.combinations.map(el => el.mat === mat ? {...el, ...newCombination}: el);
  return {
    ...G,
    combinations: newCombinations,
  };
};

export { bid };
