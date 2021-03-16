/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import TurnOrder from "./turnorder";
import BidArea from "./bidarea";
import GameLog from "./gamelog";
import {
  CombinationWithBid,
  Faction,
  GameState,
  MatchInfo,
  Player,
} from "./types";
import { Ctx } from "boardgame.io";
import { EventsAPI } from "boardgame.io/dist/types/src/plugins/events/events";
import { Button, Card, Col, notification, Row } from "antd";
import client from "./client";
import {
  CREDENTIALS,
  CURRENT_MATCH_INFO,
  PLAYER_NAME,
  SCYTHE_BIDDER,
} from "./constants";
import Lockr from "lockr";
import { useHistory } from "react-router-dom";
import { cleanupAfterLogout } from "./utils";
import { mq } from "./breakpoints";

const factionToEmoji = (f: Faction) => {
  let str: String = f;
  if (f === "Crimea") {
    str = "Crimean";
  }
  return `:${str}:`;
};

const BiddingBoard = (props: {
  G: GameState;
  playerID: string | null;
  isActive: boolean;
  moves: Record<string, (...args: any[]) => void>;
  events: EventsAPI;
  gameMetadata?: Array<Player>;
  ctx: Ctx;
  matchId: string;
  isNotificationEnabled?: boolean;
}) => {
  const {
    G,
    playerID,
    isActive,
    moves,
    events,
    gameMetadata,
    ctx,
    matchId,
    isNotificationEnabled,
  } = props;

  const matchInfo = Lockr.get<MatchInfo | undefined>(CURRENT_MATCH_INFO);
  const credentials = Lockr.get<string | undefined>(CREDENTIALS);
  const playerName = Lockr.get<string | undefined>(PLAYER_NAME);

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
    if (!playerName) {
      return;
    }
    if (matchInfo && playerID && credentials) {
      await client.leaveMatch(SCYTHE_BIDDER, matchInfo.matchId, {
        playerID,
        credentials,
      });
    }
    cleanupAfterLogout();
    history.push("/");
  }, [matchInfo, playerID, credentials, history, playerName]);

  const linkTextareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const onCopyResult = async () => {
    const content = ctx.gameover
      .map(
        (c: CombinationWithBid, key: number) =>
          `${factionToEmoji(c.faction)} **${c.faction} ${c.mat}**: $${
            c.currentBid
          } to ${c.currentHolder?.name}`
      )
      .join("\n");
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(content);
      } else {
        if (!linkTextareaRef.current) {
          return;
        }
        linkTextareaRef.current.value = content;
        linkTextareaRef.current.focus();
        // https://stackoverflow.com/questions/32851485/make-clipboard-copy-paste-work-on-iphone-devices
        if (navigator.userAgent.match(/ipad|iphone/i)) {
          const range = document.createRange();
          range.selectNodeContents(linkTextareaRef.current);
          const selection = window.getSelection();
          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
          }
          linkTextareaRef.current.setSelectionRange(0, 999999);
        }
        linkTextareaRef.current.select();
        document.execCommand("copy");
      }
      notification.success({
        message: "Success",
        description: "Bid results copied to clipboard.",
      });
    } catch (e) {
      notification.error({
        message: "Error",
        description: "Sorry, an error occurred.",
      });
    }
  };

  if (!gameMetadata) {
    return null;
  }

  return (
    <React.Fragment>
      <textarea
        css={{ display: "none" }}
        id="clipboard-link"
        ref={linkTextareaRef}
        contentEditable
        suppressContentEditableWarning
      />
      <Row gutter={24}>
        <Col xs={24} lg={7}>
          <TurnOrder
            players={gameMetadata}
            ctx={ctx}
            playerID={playerID}
            isActive={isActive}
            isNotificationEnabled={isNotificationEnabled}
          />
          <div css={{ marginTop: 24 }}>
            <Button onClick={onLeave}>
              {matchInfo?.matchId === matchId ? "Leave game" : "Back to lobby"}
            </Button>
            {playerName && (
              <Button css={{ marginLeft: 12 }} danger onClick={onLogout}>
                Logout
              </Button>
            )}
          </div>
        </Col>
        <Col xs={24} lg={17} css={{ marginTop: 24, [mq[3]]: { marginTop: 0 } }}>
          {ctx.gameover ? (
            <Card
              title={
                <div
                  css={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>Auction ended!</div>
                  <Button type="primary" onClick={onCopyResult}>
                    Copy to clipboard
                  </Button>
                </div>
              }
            >
              {ctx.gameover.map((c: CombinationWithBid, key: number) => (
                <div
                  key={key}
                  css={{
                    display: "flex",
                    alignItems: "center",
                    "&:not(:first-child)": { marginTop: 12 },
                  }}
                >
                  {c.faction === "Albion" || "Togawa" ? (
                    <img
                      src={require(`./static/images/${c.faction}.webp`)}
                      css={{ width: 24, height: 24, marginRight: 8 }}
                      alt={c.faction}
                    />
                  ) : (
                    <img
                      src={require(`./static/images/${c.faction}.png`)}
                      css={{ width: 24, height: 24, marginRight: 8 }}
                      alt={c.faction}
                    />
                  )}
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
