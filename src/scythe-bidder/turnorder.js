import React from "react";
import { Table } from 'react-bootstrap';


class TurnOrder extends React.Component {
  constructor(props) {
    super(props);
    this.currentPlayer = this.props.ctx.currentPlayer;
    this.players = this.props.players;
    this.playerID = this.props.playerID;
    this.isActive = this.props.isActive;
  }

  highlightCurrentPlayer(playerId) {
    if (this.isCurrentPlayer(playerId))
      return 'font-weight-bold';
    return 'font-weight-normal';
  }

  isCurrentPlayer(playerId) {
    return this.props.ctx.currentPlayer === playerId;
  }

  showOrder(playerId, key, playerNum) {
    return (
      <tr><td>
        <span className={this.highlightCurrentPlayer(playerId)}>
          {key+1}{". "}{this.players[playerId].name}
        </span>
      </td></tr>
    )
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
    )
  }
}

export default TurnOrder;
