import React from "react";
import { GameState } from "./types";

const GameLog = (props: { G: GameState }) => {
  const { G } = props;
  return (
    <ul className={"list-group"}>
      {G.gameLogger.map((msg, key) => (
        <li className={"list-group-item"} key={key}>
          {msg}
        </li>
      ))}
    </ul>
  );
};

export default GameLog;
