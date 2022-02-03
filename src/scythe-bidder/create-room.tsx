/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import { Button, Card, Form, notification, Select, Modal, Tooltip } from "antd";
import client from "./client";
import { DEFAULT_COMBOS } from "./constants";
import { MAX_PLAYERS_IFA, MIN_PLAYERS } from "./constants";
import { SCYTHE_BIDDER } from "./constants";
import { QuestionCircleFilled } from "@ant-design/icons";

import CombinationSelector from "./combination-selector";
import { Faction, Mat } from "./types";

export default function CreateRoom({ onCreate }: { onCreate: () => void }) {
  const [numPlayers, setNumPlayers] = React.useState(2);
  const [combosMap, setCombosMap] = React.useState(DEFAULT_COMBOS);

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

          <p>Choose "Custom" to select and view exact configurations.</p>
        </div>
      ),
      onOk() {},
    });
  }

  let factionsSet = new Set<Faction>();
  let matsSet = new Set<Mat>();

  Object.entries(combosMap).forEach(([f, matsObj]) => {
    Object.entries(matsObj).forEach(([m, v]) => {
      if (v) {
        factionsSet.add(f as Faction);
        matsSet.add(m as Mat);
      }
    });
  });

  const shouldDisableButton =
    factionsSet.size < numPlayers || matsSet.size < numPlayers;

  const onClick = async () => {
    try {
      await client.createMatch(SCYTHE_BIDDER, {
        numPlayers,
        setupData: { combosMap: combosMap },
      });
      onCreate();
    } catch (e) {
      notification.error({ message: String(e) });
    }
  };

  const button = (
    <Button
      onClick={onClick}
      type="primary"
      htmlType="submit"
      disabled={shouldDisableButton}
    >
      Create
    </Button>
  );

  return (
    <Card
      css={{ marginTop: 24 }}
      title={
        <div css={{ display: "flex", justifyContent: "space-between" }}>
          <div>Create a room</div>
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
              <CombinationSelector value={combosMap} onChange={setCombosMap} />
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
                {Array(MAX_PLAYERS_IFA + 1 - MIN_PLAYERS)
                  .fill(null)
                  .map((_, idx) => (
                    <Option value={MIN_PLAYERS + idx} key={idx}>
                      {MIN_PLAYERS + idx}
                    </Option>
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
              {shouldDisableButton ? (
                <Tooltip title="Invalid configuration - too few factions/mats selected for the number of players.">
                  {button}
                </Tooltip>
              ) : (
                button
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
    </Card>
  );
}
