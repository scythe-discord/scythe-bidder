import React from "react";

const messageStyle = {
  color: 'blue'
}

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
    const isLastPlayer = (key + 1 === playerNum);
    return (
      <span key={key}>
        <span className={this.highlightCurrentPlayer(playerId)}>
          {this.players[playerId].name}
        </span>
        <span>
          {!isLastPlayer && ", "}
        </span>
      </span>
    )
  }

  showItsYourTurnMessage() {
    return <p id='turnmessage' style={messageStyle}>{this.isActive && "It's your turn!"}</p>
  }

  render() {
    const playerNum = this.props.ctx.playOrder.length;
    return (
      <div className={"text-center container"}>
        <span>{"Bid order: "}</span>
        {this.props.ctx.playOrder.map((playerId, key) => {
          return this.showOrder(playerId, key, playerNum);
        })}
      </div>
    )
  }
}

export default TurnOrder;
