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
          css={{
            background: "var(--background-list-body)",
            padding: "12px 24px",
          }}
          key={key}
        >
          {msg}
        </List.Item>
      )}
      css={{ marginTop: 24 }}
    ></List>
  );
};

export default GameLog;
