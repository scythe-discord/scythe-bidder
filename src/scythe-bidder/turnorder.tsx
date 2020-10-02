import { Ctx } from "boardgame.io";
import React from "react";
import { Table } from "react-bootstrap";
import { Player } from "./types";

interface Props {
  ctx: Ctx;
  players: Array<Player>;
  playerID: string;
  isActive: boolean;
}

class TurnOrder extends React.Component<Props> {
  currentPlayer = this.props.ctx.currentPlayer;
  players = this.props.players;
  playerID = this.props.playerID;
  isActive = this.props.isActive;

  highlightCurrentPlayer(playerId: string) {
    if (this.isCurrentPlayer(playerId)) return "font-weight-bold";
    return "font-weight-normal";
  }

  isCurrentPlayer(playerId: string) {
    return this.props.ctx.currentPlayer === playerId;
  }

  showOrder(playerId: string, key: number, playerNum: number) {
    return (
      <tr>
        <td>
          <span className={this.highlightCurrentPlayer(playerId)}>
            {key + 1}
            {". "}
            {this.players[parseInt(playerId)].name}
          </span>
        </td>
      </tr>
    );
  }

  render() {
    const playerNum = this.props.ctx.playOrder.length;
    return (
      <div className={"text-center container mt-4 mb-4"}>
        <h4>{"Bid order: "}</h4>
        <Table size="sm">
          <tbody>
            {this.props.ctx.playOrder.map((playerId, key) => {
              return this.showOrder(playerId, key, playerNum);
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default TurnOrder;
