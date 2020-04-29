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

  showCurrentPlayerMark(playerId) {
    if (this.isCurrentPlayer(playerId))
      return "***";
  }

  isCurrentPlayer(playerId) {
    return this.props.ctx.currentPlayer === playerId
  }

  showOrder(playerId, key) {
    return (
      <span key={key}>
        {this.showCurrentPlayerMark(playerId)}{this.players[playerId].name}{this.showCurrentPlayerMark(playerId)}{", "}
      </span>
    )
  }

  showItsYourTurnMessage() {
    return <p id='turnmessage' style={messageStyle}>{this.isActive && "It's your turn!"}</p>
  }

  render() {
    return (
      <div>
        {this.props.ctx.playOrder.map((playerId, key) => {
          return this.showOrder(playerId, key);
        })}
      </div>
    )
  }
}

export default TurnOrder;
