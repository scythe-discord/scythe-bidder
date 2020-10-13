/** @jsx jsx */

import React, { useEffect } from "react";
import { jsx } from "@emotion/core";
import { useParams } from "react-router-dom";
import { Client } from "boardgame.io/client";
import ScytheBidderGame from "./game";
import { Ctx } from "boardgame.io";
import { SocketIO } from "boardgame.io/multiplayer";
import BiddingBoard from "./board";
import { MatchInfo } from "./types";
import { CREDENTIALS, CURRENT_MATCH_INFO, SCYTHE_BIDDER } from "./constants";
import Lockr from "lockr";
import { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
import client from "./client";
import { Spin } from "antd";
import { SERVER_URL } from "./config";

type GameState = {
  G: any;
  isActive: boolean;
  isConnected: boolean;
  ctx: Ctx;
};

interface Props {
  isNotificationEnabled?: boolean;
}

export default function BidRoom({ isNotificationEnabled }: Props) {
  const { matchId } = useParams<{ matchId: string }>();
  const [gameState, setGameState] = React.useState<GameState | undefined>();
  const gameClientRef = React.useRef<_ClientImpl>();
  const init = React.useCallback(
    (currentMatchInfo: MatchInfo) => {
      gameClientRef.current = Client({
        game: ScytheBidderGame,
        numPlayers: currentMatchInfo.numPlayers,
        playerID: currentMatchInfo.playerId,
        matchID: matchId,
        multiplayer: SocketIO({ server: SERVER_URL }),
        credentials: Lockr.get<string | undefined>(CREDENTIALS),
        debug: false,
      });
      gameClientRef.current.start();
      gameClientRef.current.subscribe(() => {
        if (gameClientRef.current) {
          setGameState(gameClientRef.current.getState());
        }
      });
    },
    [matchId]
  );

  useEffect(() => {
    const currentMatchInfo = Lockr.get<MatchInfo | undefined>(
      CURRENT_MATCH_INFO
    );
    const getMatchInfo = async () => {
      const result = await client.getMatch(SCYTHE_BIDDER, matchId);
      init({
        numPlayers: result.players.length,
        matchId,
      });
    };
    if (currentMatchInfo) {
      init(currentMatchInfo);
    } else {
      getMatchInfo();
    }
    return () => {
      if (!gameClientRef.current) {
        return;
      }
      gameClientRef.current.stop();
    };
  }, [init, matchId]);

  return gameState && gameClientRef.current ? (
    <BiddingBoard
      G={gameState.G}
      ctx={gameState.ctx}
      isActive={gameState.isActive}
      moves={gameClientRef.current.moves}
      events={gameClientRef.current.events}
      playerID={gameClientRef.current.playerID}
      gameMetadata={gameClientRef.current.matchData}
      matchId={matchId}
      isNotificationEnabled={isNotificationEnabled}
    />
  ) : (
    <Spin css={{ display: "block", margin: 200 }} />
  );
}
