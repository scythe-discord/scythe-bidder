import React from "react";

const GameLog = (props) => {
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
