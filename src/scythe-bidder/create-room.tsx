/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import { Button, Card, notification, Select, Form } from "antd";
import client from "./client";
import { MIN_PLAYERS, SCYTHE_BASE, SCYTHE_IFA, MAX_PLAYERS_BASE, MAX_PLAYERS_IFA, SCYTHE_BIDDER } from "./constants";
import { FACTIONS_BASE, FACTIONS_IFA, MATS_BASE, MATS_IFA } from "./constants";

export default function CreateRoom({ onCreate }: { onCreate: () => void }) {
  const [numPlayers, setNumPlayers] = React.useState(2);
  const [gameType, setGameType] = React.useState<string>(SCYTHE_BASE);
  const maxPlayers = gameType === SCYTHE_BASE ? MAX_PLAYERS_BASE : MAX_PLAYERS_IFA;

  const onClick = React.useCallback(async () => {
    const numPlayersNum = Number(numPlayers);
    const newGameType = String(gameType);
    let setupData = null;
    if (newGameType === SCYTHE_BASE) {
      setupData = {
        gameType  : newGameType,
        factions  : FACTIONS_BASE,
        mats      : MATS_BASE};
    } else {
      setupData = {
        gameType  : newGameType,
        factions  : FACTIONS_IFA,
        mats      : MATS_IFA};
    }
    // this if check should be unnecessary
    if (
      !numPlayersNum ||
      numPlayersNum < MIN_PLAYERS ||
      (newGameType === SCYTHE_BASE && numPlayersNum > MAX_PLAYERS_BASE) ||
      (newGameType === SCYTHE_IFA && numPlayersNum > MAX_PLAYERS_IFA)
    ) {
      return;
    }
    try {
      await client.createMatch(SCYTHE_BIDDER, {
        numPlayers: numPlayersNum,
        setupData: setupData,
      });
      onCreate();
    } catch (e) {
      notification.error({ message: String(e) });
    }
  }, [numPlayers, gameType, onCreate]);

  return (
    <Card
      css={{ marginTop: 24 }}
      title={
        <div css={{ display: "flex", justifyContent: "space-between" }}>
          <div>Create a room</div>
          {/* <Switch css={{ marginLeft: 12 }} /> */}
        </div>
      }
    >
      <div>
        <div css={{ display: "flex" }}>
          <Form name="create-room" layout="inline">
            <Form.Item>
              <Select<number>
                value={numPlayers}
                onChange={(value) => {
                  setNumPlayers(value);
                }}
                placeholder="# of players"
                style={{ width: 100 }}
              >
                {Array(maxPlayers + 1 - MIN_PLAYERS)
                  .fill(null)
                  .map((_, idx) => (
                    <Select.Option value={MIN_PLAYERS + idx} key={idx}>
                      {MIN_PLAYERS + idx} players
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Select<string>
                value={gameType}
                onChange={(value) => {
                  setGameType(value);
                  if (value === SCYTHE_BASE){
                    if (numPlayers > MAX_PLAYERS_BASE){
                      setNumPlayers(MAX_PLAYERS_BASE);
                      notification.warning({
                        message     : 'Warning',
                        description : `The Scythe base game allows only up to ${MAX_PLAYERS_BASE} players.`,
                      });
                    }
                  }
                }}
                placeholder="Base or IFA"
                style={{ width: 100 }}
              >
                <option value={SCYTHE_BASE}>Base</option>
                <option value={SCYTHE_IFA}>IFA</option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button onClick={onClick} type="primary" htmlType="submit">
                Create
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Card>
  );
}
