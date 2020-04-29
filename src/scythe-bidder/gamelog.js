import React from "react";

const GameLog = props => {
  const { G } = props;
  console.log(G.gameLogger);
  return (
    <ul className={"list-group"}>
      {G.gameLogger.map(msg => {
        return (
          <li className={"list-group-item"}>{msg}</li>
        )
      })}
    </ul>
  )
};

export default GameLog
