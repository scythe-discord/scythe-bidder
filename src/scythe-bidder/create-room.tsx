/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import { Button, Card, Form, notification, Select, Modal } from "antd";
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
import { QuestionCircleFilled } from "@ant-design/icons";

enum GameSetting {
  BASE,
  IFA,
  HI,
  LO,
}

export default function CreateRoom({ onCreate }: { onCreate: () => void }) {
  const [numPlayers, setNumPlayers] = React.useState(2);
  const [activeCombinations, setActiveCombinations] = React.useState(
    GameSetting.IFA
  );
  const maxPlayers =
    activeCombinations === GameSetting.IFA ? MAX_PLAYERS_IFA : MAX_PLAYERS_BASE;

  const { Option } = Select;

  const gameSettingLabel = (
    <div css={{ display: "flex", alignItems: "center" }}>
      Game setting{" "}
      <QuestionCircleFilled
        css={{ marginLeft: 8 }}
        // css={{ verticalAlign: "50%" }}
        onClick={settingInformation}
      />
    </div>
  );

  function settingInformation() {
    Modal.info({
      title: "Game setting details",
      maskClosable: true,
      content: (
        <div css={{ marginTop: 24 }}>
          <p>Base includes only the five default faction and mat options.</p>
          <p>IFA adds Togawa, Albion, Innovative, and Militant.</p>
          <p>
            Hi-tier setting removes Albion, Togawa, Agricultural, and
            Engineering.
          </p>
          <p>
            Lo-tier setting removes Rusviet, Crimea, Innovative, and Militant.
          </p>
          <p>
            <i>
              Learn more about tiers{" "}
              <a
                href="https://belovedpacifist.com/tiers"
                target="_blank"
                rel="noopener noreferrer"
              >
                here.
              </a>
            </i>
          </p>
        </div>
      ),
      onOk() {},
    });
  }

  const onClick = React.useCallback(async () => {
    const numPlayersNum = Number(numPlayers);
    let setupData = null;
    if (activeCombinations === GameSetting.BASE) {
      setupData = {
        factions: FACTIONS_BASE,
        mats: MATS_BASE,
        setting: "Base",
      };
    }
    if (activeCombinations === GameSetting.IFA) {
      setupData = {
        factions: FACTIONS_IFA,
        mats: MATS_IFA,
        setting: "IFA",
      };
    }
    if (activeCombinations === GameSetting.HI) {
      setupData = {
        factions: FACTIONS_HI,
        mats: MATS_HI,
        setting: "Hi-Tier",
      };
    }
    if (activeCombinations === GameSetting.LO) {
      setupData = {
        factions: FACTIONS_LO,
        mats: MATS_LO,
        setting: "Lo-Tier",
      };
    }
    // this if check should be unnecessary
    if (
      !numPlayersNum ||
      numPlayersNum < MIN_PLAYERS ||
      (activeCombinations !== GameSetting.IFA &&
        numPlayersNum > MAX_PLAYERS_BASE) ||
      (activeCombinations === GameSetting.IFA &&
        numPlayersNum > MAX_PLAYERS_IFA)
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
  }, [numPlayers, activeCombinations, onCreate]);

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
            <Form.Item label={gameSettingLabel} css={{ marginBottom: 0 }}>
              <Select
                defaultValue={1}
                style={{ width: 90 }}
                onChange={(value) => {
                  setActiveCombinations(value);
                  if (value !== GameSetting.IFA) {
                    if (numPlayers > MAX_PLAYERS_BASE) {
                      setNumPlayers(MAX_PLAYERS_BASE);
                      notification.warning({
                        message: "Warning",
                        description: `This setting allows only 
                                    up to ${MAX_PLAYERS_BASE} players.`,
                      });
                    }
                  }
                }}
              >
                <Option value={GameSetting.BASE}>Base</Option>
                <Option value={GameSetting.IFA}>IFA</Option>
                <Option value={GameSetting.HI}>Hi-Tier</Option>
                <Option value={GameSetting.LO}>Lo-Tier</Option>
              </Select>
            </Form.Item>

            {/* margin is required for tighter spacing */}
            <Form.Item label="Number of players" css={{ marginBottom: 0 }}>
              <Select<number>
                value={numPlayers}
                onChange={(value) => {
                  setNumPlayers(value);
                }}
                placeholder="# of players"
                style={{ width: 55 }}
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
