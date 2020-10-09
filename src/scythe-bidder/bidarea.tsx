/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import { Button, InputNumber, notification, Table } from "antd";
import { Faction, GameState, Mat, Player } from "./types";
import { Ctx } from "boardgame.io";
import { EventsAPI } from "boardgame.io/dist/types/src/plugins/events/events";

const matImages = {
  Innovative:
    "https://cf.geekdo-images.com/original/img/VD0zB_uzIIi5kaGYd6HNHjM2oTA=/0x0/pic3333416.png",
  Militant:
    "https://cf.geekdo-images.com/original/img/6aSVG7qvEM6NtXL0xJhgva8KxmA=/0x0/pic3333417.png",
  Patriotic:
    "https://cf.geekdo-images.com/original/img/nyNtLvT0rC_qrboC_A3rFoYMu6U=/0x0/pic2695350.jpg",
  Industrial:
    "https://cdn.arstechnica.net/wp-content/uploads/2016/07/ScythePlayermat.png",
  Agricultural:
    "https://cf.geekdo-images.com/camo/9fe9795cf6647df8b0db3be6f103bb5ea45348e8/68747470733a2f2f692e696d6775722e636f6d2f45434b73656b552e706e67",
  Engineering:
    "https://cf.geekdo-images.com/camo/faebc55a71303fbe0836ff9a0bf3bae001d5371f/68747470733a2f2f692e696d6775722e636f6d2f386478327964622e706e67",
  Mechanical:
    "https://steamuserimages-a.akamaihd.net/ugc/968727454197258419/AC405A3EB987C0F804E6D439C7B738E5F3546272/",
};

const BidArea = (props: {
  G: GameState;
  isActive: boolean;
  moves: Record<string, (...args: any[]) => void>;
  events: EventsAPI;
  playerInfo: Array<Player>;
  ctx: Ctx;
}) => {
  const [bids, setBids] = React.useState<{ [key: string]: number }>(
    props.G.combinations.reduce(
      (acc, combo) => ({
        ...acc,
        [`${combo.faction}:${combo.mat}`]: combo.currentBid + 1,
      }),
      {}
    )
  );
  const onBid = (faction: Faction, mat: Mat) => {
    const currentCombo = props.G.combinations.find(
      ({ faction: f }) => faction === f
    );
    if (!currentCombo) {
      return;
    }
    const currentBid = currentCombo.currentBid;
    if (bids[`${faction}:${mat}`] <= currentBid) {
      notification.error({
        message:
          currentBid > -1
            ? `The current bid for ${faction} ${mat} is ${currentBid}. You must bid at least ${
                currentBid + 1
              }.`
            : "You must bid at least 0.",
      });
      return;
    }
    props.moves.bid(
      faction,
      mat,
      bids[`${faction}:${mat}`],
      props.playerInfo[Number(props.ctx.currentPlayer)]
    );
    if (typeof props.events.endTurn !== "function") {
      throw new Error("endTurn is not callable");
    }
    props.events.endTurn();
  };

  React.useEffect(() => {
    setBids(
      props.G.combinations.reduce(
        (acc, combo) => ({
          ...acc,
          [`${combo.faction}:${combo.mat}`]: combo.currentBid + 1,
        }),
        {}
      )
    );
  }, [props.G]);

  return (
    <Table
      bordered
      dataSource={props.G.combinations}
      css={{
        overflow: "auto",
        tbody: { background: "#fff" },
        ".ant-table": { overflow: "auto" },
      }}
      pagination={false}
    >
      <Table.Column
        css={{ background: "#fff" }}
        width={120}
        render={(combo) => {
          return (
            <div css={{ display: "flex", alignItems: "center" }}>
              <InputNumber
                key={combo.currentBid}
                defaultValue={combo.currentBid + 1}
                disabled={!props.isActive}
                value={bids[`${combo.faction}:${combo.mat}`]}
                onChange={(e: string | number | undefined) => {
                  if (typeof e !== "number") {
                    return;
                  }
                  setBids({ ...bids, [`${combo.faction}:${combo.mat}`]: e });
                }}
              ></InputNumber>
              <Button
                css={{ marginLeft: 12 }}
                disabled={!props.isActive}
                onClick={() => {
                  onBid(combo.faction, combo.mat);
                }}
              >
                Bid
              </Button>
            </div>
          );
        }}
      ></Table.Column>
      <Table.Column
        title="Faction"
        css={{ background: "#fff" }}
        width={72}
        dataIndex="faction"
        render={(faction) => {
          return (
            <div
              css={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={require(`./static/images/${faction}.png`)}
                alt={faction}
                css={{ width: 36, height: 36 }}
              />
              <div css={{ marginLeft: 12 }}>{faction}</div>
            </div>
          );
        }}
      />

      <Table.Column
        title="Player mat"
        css={{ background: "#fff" }}
        width={120}
        dataIndex="mat"
        render={(mat: Mat) => {
          return (
            <a href={matImages[mat]} target="_blank" rel="noopener noreferrer">
              {mat}
            </a>
          );
        }}
      />

      <Table.Column
        title="Current bid"
        css={{ background: "#fff" }}
        width={120}
        dataIndex="currentBid"
        render={(currentBid) => {
          if (currentBid === -1) {
            return null;
          }
          return `$${currentBid}`;
        }}
      />

      <Table.Column
        title="Highest bidder"
        css={{ background: "#fff" }}
        width={120}
        dataIndex="currentHolder"
        render={(currentHolder) => {
          if (!currentHolder) {
            return null;
          }
          return currentHolder.name;
        }}
      />
    </Table>
  );
};

export default BidArea;
