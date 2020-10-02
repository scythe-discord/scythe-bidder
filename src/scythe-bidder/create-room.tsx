/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import client from "./client";

export default function CreateRoom({ onCreate }: { onCreate: () => void }) {
  const [numPlayers, setNumPlayers] = React.useState("");
  const onClick = React.useCallback(async () => {
    const numPlayersNum = Number(numPlayers);
    if (!numPlayersNum || numPlayersNum < 2 || numPlayersNum > 7) {
      return;
    }
    const result = await client.createMatch("scythe-bidder", {
      numPlayers: numPlayersNum,
    });
    console.log(result);
    onCreate();
  }, [numPlayers, onCreate]);
  return (
    <Card css={{ marginTop: 16 }}>
      <Card.Body>
        <Card.Title>Create a room</Card.Title>
        <Card.Text>
          <div className="form-inline">
            <div className="form-group mb-3 mt-1" css={{ display: "flex" }}>
              <label htmlFor="num-players" className="sr-only">
                Number of players
              </label>
              <input
                type="tel"
                className="form-control"
                id="num-players"
                placeholder="Number of players"
                css={{ flex: "0 1 120px", width: "160px !important" }}
                value={numPlayers}
                onChange={(e) => {
                  setNumPlayers(e.currentTarget.value);
                }}
              />
              <div className="custom-control custom-switch ml-4">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customSwitch1"
                />
                <label className="custom-control-label" htmlFor="customSwitch1">
                  IFA
                </label>
              </div>
            </div>
          </div>
          <div>
            <Button onClick={onClick}>Create</Button>
          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
