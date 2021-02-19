/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import { List } from "antd";
import { Ctx } from "boardgame.io";
import { Player } from "./types";

interface Props {
  ctx: Ctx;
  players: Array<Player>;
  playerID: string | null;
  isActive: boolean;
  isNotificationEnabled?: boolean;
}

const addNotifEventListeners = (notif: Notification) => {
  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      notif.close();
    }
  };

  const onClick = () => {
    window.focus();
  };

  document.addEventListener("visibilitychange", onVisibilityChange);
  notif.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    notif.removeEventListener("click", onClick);
  };
};

const TurnOrder = (props: Props) => {
  React.useEffect(() => {
    if (props.isNotificationEnabled && props.isActive) {
      const turnNotif = new Notification("Scythe Bidder", {
        body: "It's your turn!",
      });

      return addNotifEventListeners(turnNotif);
    }
  }, [props.isNotificationEnabled, props.isActive]);

  const isGameOver = !!props.ctx.gameover;

  React.useEffect(() => {
    if (props.isNotificationEnabled && isGameOver) {
      const endGameNotif = new Notification("Scythe Bidder", {
        body: "Auction ended.",
      });

      return addNotifEventListeners(endGameNotif);
    }
  }, [props.isNotificationEnabled, isGameOver]);

  return (
    <List
      header={
        <div css={{ padding: "0 24px", fontWeight: 500 }}>
          {isGameOver
            ? "Players"
            : props.isActive
            ? "It's your turn!"
            : `Current player: ${
                props.players[parseInt(props.ctx.currentPlayer)].name
              }`}
        </div>
      }
      dataSource={props.ctx.playOrder}
      renderItem={(playerId, idx) => (
        <List.Item
          css={{
            padding: "12px 24px",
            fontWeight:
              !isGameOver && props.ctx.currentPlayer === playerId ? 500 : 400,
            background:
              !isGameOver && props.ctx.currentPlayer === playerId
                ? "var(--accent-blue)"
                : "var(--background-list-body)",
          }}
        >
          {idx + 1}. {props.players[parseInt(playerId)].name}
        </List.Item>
      )}
      css={{ background: "var(--background-list-header)" }}
    ></List>
  );
};

export default TurnOrder;
