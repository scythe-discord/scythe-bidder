/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import TurnOrder from "./turnorder";
import BidArea from "./bidarea";
import GameLog from "./gamelog";
import { Combination, GameState, MatchInfo, Player } from "./types";
import { Ctx } from "boardgame.io";
import { EventsAPI } from "boardgame.io/dist/types/src/plugins/events/events";
import { Button, Card, Col, Row } from "antd";
import client from "./client";
import { CREDENTIALS, CURRENT_MATCH_INFO, SCYTHE_BIDDER } from "./constants";
import Lockr from "lockr";
import { useHistory } from "react-router-dom";
import { cleanupAfterLogout } from "./utils";
import { mq } from "./breakpoints";

const BiddingBoard = (props: {
  G: GameState;
  playerID: string | null;
  isActive: boolean;
  moves: Record<string, (...args: any[]) => void>;
  events: EventsAPI;
  gameMetadata?: Array<Player>;
  ctx: Ctx;
}) => {
  const { G, playerID, isActive, moves, events, gameMetadata, ctx } = props;

  const matchInfo = Lockr.get<MatchInfo | undefined>(CURRENT_MATCH_INFO);
  const credentials = Lockr.get<string | undefined>(CREDENTIALS);

  const history = useHistory();

  const onLeave = React.useCallback(async () => {
    if (matchInfo && playerID && credentials) {
      await client.leaveMatch(SCYTHE_BIDDER, matchInfo.matchId, {
        playerID,
        credentials,
      });
    }
    Lockr.rm(CURRENT_MATCH_INFO);
    history.push("/");
  }, [credentials, matchInfo, playerID, history]);

  const onLogout = React.useCallback(async () => {
    if (matchInfo && playerID && credentials) {
      await client.leaveMatch(SCYTHE_BIDDER, matchInfo.matchId, {
        playerID,
        credentials,
      });
    }
    cleanupAfterLogout();
    history.push("/");
  }, [matchInfo, playerID, credentials, history]);

  if (!gameMetadata) {
    return null;
  }

  return (
    <React.Fragment>
      <Row gutter={24}>
        <Col xs={24} lg={7}>
          <TurnOrder
            players={gameMetadata}
            ctx={ctx}
            playerID={playerID}
            isActive={isActive}
          />
          <div css={{ marginTop: 24 }}>
            <Button onClick={onLeave}>Leave game</Button>
            <Button css={{ marginLeft: 12 }} danger onClick={onLogout}>
              Logout
            </Button>
          </div>
        </Col>
        <Col xs={24} lg={17} css={{ marginTop: 24, [mq[3]]: { marginTop: 0 } }}>
          {ctx.gameover ? (
            <Card title="Auction ended!">
              {ctx.gameover.map((c: Combination, key: number) => (
                <div
                  key={key}
                  css={{
                    display: "flex",
                    alignItems: "center",
                    "&:not(:first-child)": { marginTop: 12 },
                  }}
                >
                  {
                    <img
                      src={require(`./static/images/${c.faction}.png`)}
                      css={{ width: 24, height: 24, marginRight: 8 }}
                      alt={c.faction}
                    />
                  }
                  <strong css={{ fontWeight: 500 }}>
                    {c.faction} {c.mat}
                  </strong>
                  {" - $"}
                  {c.currentBid}
                  {" to "}
                  {c.currentHolder!.name}
                </div>
              ))}
            </Card>
          ) : (
            <BidArea
              isActive={isActive}
              ctx={ctx}
              G={G}
              moves={moves}
              events={events}
              playerInfo={gameMetadata}
            />
          )}
          <GameLog G={G} />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BiddingBoard;
