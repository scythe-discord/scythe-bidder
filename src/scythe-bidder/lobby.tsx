/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import { LobbyAPI } from "boardgame.io";
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Table,
  Spin,
  notification,
  Form,
} from "antd";
import CreateRoom from "./create-room";
import client from "./client";
import { SCYTHE_BIDDER } from "./constants";
import Lockr from "lockr";
import { MatchInfo, Player } from "./types";
import Animate from "rc-animate";
import { mq } from "./breakpoints";
import { Link } from "react-router-dom";
import { PLAYER_NAME, CREDENTIALS, CURRENT_MATCH_INFO } from "./constants";
import { cleanupAfterLogout } from "./utils";
import { useTheme } from "@emotion/react";

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
    Lockr.get<MatchInfo | undefined>(CURRENT_MATCH_INFO, undefined)
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
          numPlayers: match.players.length,
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
    if (
      !currentMatchInfoRef.current ||
      !credentialsRef.current ||
      !currentMatchInfoRef.current.playerId
    ) {
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
  }, [fetchMatches]);

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
    const interval = setInterval(fetchMatches, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [fetchMatches]);

  React.useEffect(() => {
    if (savedPlayerName) {
      Lockr.set(PLAYER_NAME, savedPlayerName);
    } else {
      cleanupAfterLogout();
    }
  }, [savedPlayerName]);

  const playerIsInMatch = matches.some(
    (match) => match.matchID === currentMatchInfoRef.current?.matchId
  );

  const theme = useTheme();

  return (
    <Row gutter={24}>
      <Col xs={24} lg={7}>
        <Card
          title={
            savedPlayerName ? `Welcome, ${savedPlayerName}` : "Enter your name"
          }
        >
          {savedPlayerName ? (
            <Button onClick={onLogout} danger>
              Logout
            </Button>
          ) : (
            <div css={{ display: "flex" }}>
              <Form
                layout="inline"
                css={{
                  display: "flex",
                  flexWrap: "nowrap",
                  ".ant-form-item:first-child": { flex: "1 1 auto" },
                  ".ant-form-item:last-child": { marginRight: 0 },
                }}
              >
                <Form.Item>
                  <Input
                    type="text"
                    placeholder="Name"
                    value={tempPlayerName}
                    onChange={(e) => {
                      setTempPlayerName(e.currentTarget.value);
                    }}
                  />
                </Form.Item>
                <Form.Item css={{ margin: 0 }}>
                  <Button type="primary" onClick={onSetName} htmlType="submit">
                    Confirm
                  </Button>
                </Form.Item>
              </Form>
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
                    <em css={{ color: theme.disabled }}>No players yet</em>
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
            {/* <Table.Column width={60} title="IFA" render={() => null} /> */}
            <Table.Column
              width={180}
              dataIndex="matchID"
              render={(matchId, match: LobbyAPI.Match) => {
                const matchIsFull =
                  match.players.length ===
                  match.players.filter((p) => !!p.name).length;
                let content = null;
                if (
                  currentMatchInfoRef.current?.matchId === matchId &&
                  savedPlayerName
                ) {
                  content = (
                    <React.Fragment>
                      <Animate transitionName="fade" transitionAppear>
                        {matchIsFull && (
                          <Link to={`/game/${matchId}`}>
                            <Button css={{ marginRight: 12 }}>Play</Button>
                          </Link>
                        )}
                      </Animate>
                      <Button onClick={onLeave} loading={leaveLoading}>
                        Leave
                      </Button>
                    </React.Fragment>
                  );
                } else if (!playerIsInMatch) {
                  content =
                    savedPlayerName && !matchIsFull ? (
                      <Button
                        onClick={() => {
                          onJoin(matchId);
                        }}
                        loading={joinLoading}
                      >
                        Join
                      </Button>
                    ) : (
                      <Link to={`/game/${matchId}`}>
                        <Button>Spectate</Button>
                      </Link>
                    );
                }
                return (
                  <div
                    css={{
                      display: "flex",
                      justifyContent: "flex-end",
                      minHeight: 32,
                    }}
                  >
                    {content}
                  </div>
                );
              }}
            />
          </Table>
        )}
      </Col>
    </Row>
  );
}
