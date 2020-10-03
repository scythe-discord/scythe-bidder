/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import { Button, Card, Input, Switch } from "antd";
import client from "./client";
import { SCYTHE_BIDDER } from "./constants";

export default function CreateRoom({ onCreate }: { onCreate: () => void }) {
  const [numPlayers, setNumPlayers] = React.useState("");
  const onClick = React.useCallback(async () => {
    const numPlayersNum = Number(numPlayers);
    if (!numPlayersNum || numPlayersNum < 2 || numPlayersNum > 7) {
      return;
    }
    const result = await client.createMatch(SCYTHE_BIDDER, {
      numPlayers: numPlayersNum,
    });
    console.log(result);
    onCreate();
  }, [numPlayers, onCreate]);

  return (
    <Card
      css={{ marginTop: 24 }}
      title={
        <div css={{ display: "flex", justifyContent: "space-between" }}>
          <div>Create a room</div>
          <Switch css={{ marginLeft: 12 }} />
        </div>
      }
    >
      <div>
        <div css={{ display: "flex" }}>
          <Input
            type="tel"
            id="num-players"
            placeholder="# of players"
            value={numPlayers}
            onChange={(e) => {
              setNumPlayers(e.currentTarget.value);
            }}
          />
          <Button onClick={onClick} css={{ marginLeft: 12 }}>
            Create
          </Button>
        </div>
      </div>
    </Card>
  );
}
