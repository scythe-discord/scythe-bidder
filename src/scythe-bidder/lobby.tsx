/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import { LobbyAPI } from "boardgame.io";
import { Row, Col, Card, Input, Button, Table, Spin, notification } from "antd";
import CreateRoom from "./create-room";
import client from "./client";
import { SCYTHE_BIDDER } from "./constants";
import Lockr from "lockr";
import { Player } from "./types";
import Animate from "rc-animate";
import { mq } from "./breakpoints";
import { Link } from "react-router-dom";

const PLAYER_NAME = "playerName";
const CREDENTIALS = "credentials";
const CURRENT_MATCH_INFO = "currentMatchInfo";

export default function Lobby() {
  const [matches, setMatches] = React.useState<Array<LobbyAPI.Match>>([]);
  const [savedPlayerName, setSavedPlayerName] = React.useState<
    string | undefined
  >(Lockr.get<string | undefined>(PLAYER_NAME, undefined));
  const [tempPlayerName, setTempPlayerName] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [joinLoading, setJoinLoading] = React.useState(false);
  const [leaveLoading, setLeaveLoading] = React.useState(false);
  const credentialsRef = React.useRef(
    Lockr.get<string | undefined>(CREDENTIALS, undefined)
  );
  const currentMatchInfoRef = React.useRef(
    Lockr.get<{ matchId: string; playerId: string } | undefined>(
      CURRENT_MATCH_INFO,
      undefined
    )
  );

  const fetchMatches = React.useCallback(async () => {
    const result = await client.listMatches(SCYTHE_BIDDER);
    setLoading(false);
    setMatches(result.matches);
  }, []);

  const onJoin = React.useCallback(
    async (matchId: string) => {
      setJoinLoading(true);
      const match = matches.find((match) => match.matchID === matchId);
      const playerId = match?.players.findIndex((p) => p.name === undefined);
      if (!match || !savedPlayerName || playerId === undefined) {
        return;
      }
      try {
        const { playerCredentials } = await client.joinMatch(
          SCYTHE_BIDDER,
          matchId,
          {
            playerID: String(playerId),
            playerName: savedPlayerName,
            data: {
              credentials: credentialsRef.current,
            },
          }
        );
        const matchInfo = {
          playerId: String(playerId),
          matchId,
        };
        credentialsRef.current = playerCredentials;
        currentMatchInfoRef.current = matchInfo;

        Lockr.set(CREDENTIALS, playerCredentials);
        Lockr.set(CURRENT_MATCH_INFO, matchInfo);
        await fetchMatches();
      } catch (e) {
        notification.error({ message: String(e) });
      }
      setJoinLoading(false);
    },
    [matches, savedPlayerName, fetchMatches]
  );

  const onLeave = React.useCallback(async () => {
    if (!currentMatchInfoRef.current || !credentialsRef.current) {
      return;
    }
    setLeaveLoading(true);
    try {
      await client.leaveMatch(
        SCYTHE_BIDDER,
        currentMatchInfoRef.current.matchId,
        {
          playerID: currentMatchInfoRef.current.playerId,
          credentials: credentialsRef.current,
        }
      );
      await fetchMatches();
      currentMatchInfoRef.current = undefined;
      Lockr.rm(CURRENT_MATCH_INFO);
    } catch (e) {
      notification.error({ message: String(e) });
    }
    setLeaveLoading(false);
  }, []);

  const onSetName = React.useCallback(() => {
    const trimmed = tempPlayerName.trim();
    if (!trimmed) {
      return;
    }
    setSavedPlayerName(trimmed);
  }, [tempPlayerName]);

  const onLogout = React.useCallback(() => {
    setSavedPlayerName(undefined);
    setTempPlayerName("");
  }, []);

  React.useEffect(() => {
    fetchMatches();
    setInterval(fetchMatches, 3000);
  }, [fetchMatches]);

  React.useEffect(() => {
    if (savedPlayerName) {
      Lockr.set(PLAYER_NAME, savedPlayerName);
    } else {
      Lockr.rm(PLAYER_NAME);
      Lockr.rm(CREDENTIALS);
      Lockr.rm(CURRENT_MATCH_INFO);
    }
  }, [savedPlayerName]);

  return (
    <Row gutter={24}>
      <Col xs={24} lg={7}>
        <Card
          title={
            savedPlayerName ? `Welcome, ${savedPlayerName}` : "Enter your name"
          }
        >
          {savedPlayerName ? (
            <Button onClick={onLogout}>Logout</Button>
          ) : (
            <div css={{ display: "flex" }}>
              <Input
                type="text"
                placeholder="Name"
                value={tempPlayerName}
                onChange={(e) => {
                  setTempPlayerName(e.currentTarget.value);
                }}
              />
              <Button
                css={{ marginLeft: 12 }}
                type="primary"
                onClick={onSetName}
              >
                Confirm
              </Button>
            </div>
          )}
        </Card>
        <Animate transitionName="fade" transitionAppear>
          {savedPlayerName && <CreateRoom onCreate={fetchMatches} />}
        </Animate>
      </Col>
      <Col xs={24} lg={17}>
        {loading ? (
          <div css={{ display: "flex" }}>
            <Spin css={{ margin: "48px auto" }} />
          </div>
        ) : (
          <Table
            dataSource={matches}
            css={{ marginTop: 24, [mq[3]]: { marginTop: 0 } }}
            rowKey={(match) => match.matchID}
            locale={{ emptyText: <em>No ongoing games</em> }}
          >
            <Table.Column
              title="Players"
              dataIndex="players"
              render={(players: Array<Player>) => {
                const filteredPlayers = players.filter((p) => !!p.name);
                let content = null;
                if (filteredPlayers.length === 0) {
                  content = (
                    <em css={{ color: "rgba(0, 0, 0, 0.25)" }}>
                      No players yet
                    </em>
                  );
                } else {
                  content = (
                    <div>{filteredPlayers.map((p) => p.name).join(", ")}</div>
                  );
                }
                return {
                  children: content,
                };
              }}
            />
            <Table.Column
              width={120}
              title="# of players"
              dataIndex="players"
              render={(players: Array<Player>) => {
                const filteredPlayers = players.filter((p) => !!p.name);
                return {
                  children: `${filteredPlayers.length}/${players.length}`,
                };
              }}
            />
            <Table.Column width={60} title="IFA" render={() => null} />
            <Table.Column
              width={180}
              dataIndex="matchID"
              render={(matchId, match: LobbyAPI.Match) => {
                if (!savedPlayerName) {
                  if (
                    match.players.length ===
                    match.players.filter((p) => !!p.name).length
                  ) {
                    return <Button>Spectate</Button>;
                  }
                  return null;
                }
                if (currentMatchInfoRef.current?.matchId === matchId) {
                  return (
                    <div>
                      <Link to={`/game/${matchId}`}>
                        <Button css={{ marginRight: 12 }}>Play</Button>
                      </Link>
                      <Button onClick={onLeave} loading={leaveLoading}>
                        Leave
                      </Button>
                    </div>
                  );
                }
                return (
                  <Button
                    css={{ marginRight: 12 }}
                    onClick={() => {
                      onJoin(matchId);
                    }}
                    loading={joinLoading}
                  >
                    Join
                  </Button>
                );
              }}
            />
          </Table>
        )}
      </Col>
    </Row>
  );
}
