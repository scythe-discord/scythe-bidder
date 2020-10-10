/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import { Button, Card, Form, notification, Select, Switch } from "antd";
import client from "./client";
import { FACTIONS_BASE, FACTIONS_IFA, MATS_BASE, MATS_IFA } from "./constants";
import { MAX_PLAYERS_BASE, MAX_PLAYERS_IFA, MIN_PLAYERS } from "./constants";
import { SCYTHE_BIDDER } from "./constants";

export default function CreateRoom({ onCreate }: { onCreate: () => void }) {
  const [numPlayers, setNumPlayers] = React.useState(2);
  const [isIfaActive, setIsIfaActive] = React.useState<boolean>(true);
  const maxPlayers = isIfaActive ? MAX_PLAYERS_IFA : MAX_PLAYERS_BASE;

  const onClick = React.useCallback(async () => {
    const numPlayersNum = Number(numPlayers);
    let setupData = null;
    if (!isIfaActive) {
      setupData = {
        factions: FACTIONS_BASE,
        mats: MATS_BASE,
      };
    } else {
      setupData = {
        factions: FACTIONS_IFA,
        mats: MATS_IFA,
      };
    }
    // this if check should be unnecessary
    if (
      !numPlayersNum ||
      numPlayersNum < MIN_PLAYERS ||
      (!isIfaActive && numPlayersNum > MAX_PLAYERS_BASE) ||
      (isIfaActive && numPlayersNum > MAX_PLAYERS_IFA)
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
  }, [numPlayers, isIfaActive, onCreate]);

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
          <Form name="create-room" layout="horizontal">
            <Form.Item
              css={{
                ".ant-form-item-control-input-content": { display: "flex" },
                marginBottom: 0,
              }}
            >
              <Form.Item css={{ marginLeft: 6 }}>
                <Switch
                  defaultChecked
                  checkedChildren="IFA"
                  unCheckedChildren="IFA"
                  style={{ transform: "scale(1.2,1.2)" }}
                  onChange={(value) => {
                    setIsIfaActive(value);
                    if (!value) {
                      if (numPlayers > MAX_PLAYERS_BASE) {
                        setNumPlayers(MAX_PLAYERS_BASE);
                        notification.warning({
                          message: "Warning",
                          description: `The Scythe base game allows only 
                                      up to ${MAX_PLAYERS_BASE} players.`,
                        });
                      }
                    }
                  }}
                />
              </Form.Item>
              <Form.Item css={{ marginLeft: 32 }}>
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
            </Form.Item>
            <Form.Item css={{ marginBottom: 0, marginLeft: 1 }}>
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
