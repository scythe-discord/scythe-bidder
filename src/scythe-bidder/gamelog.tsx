/** @jsx jsx */

import { jsx } from "@emotion/core";
import { List } from "antd";
import { GameState } from "./types";

const GameLog = (props: { G: GameState }) => {
  const { G } = props;
  return (
    <List
      dataSource={G.gameLogger}
      renderItem={(msg, key) => (
        <List.Item
          css={{ background: "white", padding: "12px 24px" }}
          key={key}
        >
          {msg}
        </List.Item>
      )}
      css={{ background: "#fff", marginTop: 24 }}
    ></List>
  );
};

export default GameLog;
