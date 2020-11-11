/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import { Button, Card, Form, notification, Select, Switch } from "antd";
import client from "./client";
import {
  FACTIONS_BASE,
  FACTIONS_IFA,
  FACTIONS_HI,
  FACTIONS_LO,
  MATS_BASE,
  MATS_IFA,
  MATS_HI,
  MATS_LO,
} from "./constants";
import { MAX_PLAYERS_BASE, MAX_PLAYERS_IFA, MIN_PLAYERS } from "./constants";
import { SCYTHE_BIDDER } from "./constants";

export default function CreateRoom({ onCreate }: { onCreate: () => void }) {
  const [numPlayers, setNumPlayers] = React.useState(2);
  const [isIfaActive, setIsIfaActive] = React.useState<boolean>(true);
  const [isHiTierActive, setIsHiTierActive] = React.useState<boolean>(true);
  const [isLoTierActive, setIsLoTierActive] = React.useState<boolean>(true);
  const [isMaxPlayerFive, setMaxPlayerFive] = React.useState<boolean>(true);
  const maxPlayers = isMaxPlayerFive ? MAX_PLAYERS_BASE : MAX_PLAYERS_IFA;

  const onClick = React.useCallback(async () => {
    const numPlayersNum = Number(numPlayers);
    let setupData = null;
    if (!isIfaActive) {
      setupData = {
        factions: FACTIONS_BASE,
        mats: MATS_BASE,
      };
    }
    if (isHiTierActive) {
      setupData = {
        factions: FACTIONS_HI,
        mats: MATS_HI,
      };
    }
    if (isLoTierActive) {
      setupData = {
        factions: FACTIONS_LO,
        mats: MATS_LO,
      };
    }
    if (isIfaActive && !isHiTierActive && !isLoTierActive) {
      setupData = {
        factions: FACTIONS_IFA,
        mats: MATS_IFA,
      };
    }
    // this if check should be unnecessary
    if (
      !numPlayersNum ||
      numPlayersNum < MIN_PLAYERS ||
      (isMaxPlayerFive && numPlayersNum > MAX_PLAYERS_BASE) ||
      (!isMaxPlayerFive && numPlayersNum > MAX_PLAYERS_IFA)
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
  }, [numPlayers, isMaxPlayerFive, onCreate]);

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
          <Form
            name="create-room"
            colon={false}
            labelAlign="left"
            labelCol={{ span: 16 }}
            wrapperCol={{ offset: 4, span: 4 }}
          >
            {/* margin is required for tighter spacing */}
            <Form.Item label="IFA enabled" css={{ marginBottom: 0 }}>
              <Switch
                defaultChecked
                onChange={(value) => {
                  setIsIfaActive(value);
                  if (value && !isLoTierActive && !isHiTierActive) {
                    setMaxPlayerFive(!value);
                  }
                  if (!value) {
                    setIsHiTierActive(value);
                    setIsLoTierActive(value);
                    setMaxPlayerFive(!value);
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
            <Form.Item label="High tier only" css={{ marginBottom: 0 }}>
              <Switch
                onChange={(value) => {
                  setIsHiTierActive(value);
                  if (value) {
                    setMaxPlayerFive(value);
                    setIsLoTierActive(!value);
                    if (numPlayers > MAX_PLAYERS_BASE) {
                      setNumPlayers(MAX_PLAYERS_BASE);
                      notification.warning({
                        message: "Warning",
                        description: `This version allows only 
                                      up to ${MAX_PLAYERS_BASE} players.`,
                      });
                    }
                    if (!isIfaActive) {
                      setIsIfaActive(value);
                    }
                  }
                }}
              />
            </Form.Item>
            <Form.Item label="Low tier only" css={{ marginBottom: 0 }}>
              <Switch
                defaultChecked
                onChange={(value) => {
                  setIsLoTierActive(value);
                  if (value) {
                    setMaxPlayerFive(value);
                    setIsHiTierActive(!value);
                    if (numPlayers > MAX_PLAYERS_BASE) {
                      setNumPlayers(MAX_PLAYERS_BASE);
                      notification.warning({
                        message: "Warning",
                        description: `This version allows only 
                                      up to ${MAX_PLAYERS_BASE} players.`,
                      });
                    }
                    if (!isIfaActive) {
                      setIsIfaActive(value);
                    }
                  }
                }}
              />
            </Form.Item>
            {/* margin is required for tighter spacing */}
            <Form.Item label="Number of players" css={{ marginBottom: 0 }}>
              <Select<number>
                value={numPlayers}
                onChange={(value) => {
                  setNumPlayers(value);
                }}
                placeholder="# of players"
                style={{ width: 50 }}
              >
                {Array(maxPlayers + 1 - MIN_PLAYERS)
                  .fill(null)
                  .map((_, idx) => (
                    <Select.Option value={MIN_PLAYERS + idx} key={idx}>
                      {MIN_PLAYERS + idx}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <br />
            {/* name and wrapperCol required for proper alignment */}
            <Form.Item
              name="Create"
              wrapperCol={{ offset: -4, span: 4 }}
              css={{ marginBottom: 0 }}
            >
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
