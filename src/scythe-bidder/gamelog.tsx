/** @jsx jsx */

import { jsx } from "@emotion/core";
import { useTheme } from "@emotion/react";
import { List } from "antd";
import { GameState } from "./types";

const GameLog = (props: { G: GameState }) => {
  const { G } = props;
  const theme = useTheme();
  return (
    <List
      dataSource={G.gameLogger}
      renderItem={(msg, key) => (
        <List.Item
          css={{
            background: theme.listBody,
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
