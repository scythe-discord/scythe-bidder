import React from "react";
import FactionMatCombination from "./faction-mat-combination";
import { Table } from "react-bootstrap";
import { ClientSideBid, GameState, Player } from "./types";
import { Ctx } from "boardgame.io";
import { EventsAPI } from "boardgame.io/dist/types/src/plugins/events/events";

const BidArea = (props: {
  G: GameState;
  isActive: boolean;
  moves: {
    bid: ClientSideBid;
  };
  events: EventsAPI;
  playerInfo: Array<Player>;
  ctx: Ctx;
}) => {
  return (
    <Table striped bordered responsive>
      <thead>
        <tr>
          <th></th>
          <th className="align-middle text-center">Combination</th>
          <th className="align-middle text-center">Current Bid</th>
        </tr>
      </thead>
      <tbody>
        {props.G.combinations.map((c, key) => (
          <FactionMatCombination
            combination={c}
            moves={props.moves}
            events={props.events}
            key={key}
            players={props.playerInfo}
            ctx={props.ctx}
            isActive={props.isActive}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default BidArea;
