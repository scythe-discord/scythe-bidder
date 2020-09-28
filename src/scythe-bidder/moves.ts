import { Ctx } from "boardgame.io";
import { Faction, GameState, Mat, Player } from "./types";

const bid = (
  G: GameState,
  ctx: Ctx,
  faction: Faction,
  mat: Mat,
  bidValue: number,
  player: Player
) => {
  const newCombination = {
    currentHolder: { ...player },
    faction,
    mat,
    currentBid: bidValue,
  };
  const newCombinations = G.combinations.map((el) =>
    el.mat === mat ? { ...el, ...newCombination } : el
  );
  const msg = [`${player.name} bids $${bidValue} on ${faction} ${mat}`];
  return {
    ...G,
    combinations: newCombinations,
    gameLogger: [...msg, ...G.gameLogger],
  };
};

export { bid };
