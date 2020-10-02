/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import { LobbyAPI } from "boardgame.io";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { Col } from "react-bootstrap";
import CreateRoom from "./create-room";
import client from "./client";

export default function Lobby() {
  const [matches, setMatches] = React.useState<Array<LobbyAPI.Match>>([]);

  const fetchMatches = React.useCallback(async () => {
    const result = await client.listMatches("scythe-bidder");
    setMatches(result.matches);
    console.log(result);
  }, []);
  React.useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);
  return (
    <Container fluid="lg" css={{ flex: 1 }}>
      <Row>
        <Col xs={12} lg={4}>
          <Card body>
            Your player name is <strong>playerName</strong>.
          </Card>
          <CreateRoom onCreate={fetchMatches} />
        </Col>
        <Col xs={12} lg={8}>
          <Table responsive>
            <thead>
              <tr>
                <th>Players</th>
                <th>Player Count</th>
                <th>IFA</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match.matchID}>
                  <td>
                    {match.players.map((player) => player.name).join(", ")}
                  </td>
                  <td>
                    {match.players.length}/{match.players.length}
                  </td>
                  <td>Yes</td>
                  <td>
                    <Button>Join</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
