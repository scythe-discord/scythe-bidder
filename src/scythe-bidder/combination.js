import React from "react";
import _ from "lodash";

class Combination extends React.Component {
  constructor(props) {
    super(props);
    this.selectInput = React.createRef();
  }

  bid(faction, mat, player) {
    console.log(player);
    this.props.moves.bid(faction, mat, this.selectInput.current.value, player);
    this.props.events.endTurn();
  }

  render() {
    return (
      <div>
        {this.props.combination.faction}{" "}{this.props.combination.mat}{" "}
      <select ref={this.selectInput}>
        {_.range(parseInt(this.props.combination.currentBid) + 1, 50).map(value => <option key={value} value={value}>{value}</option>)}
      </select>{" "}
      <button onClick={() => this.bid(this.props.combination.faction, this.props.combination.mat, this.props.players[this.props.ctx.currentPlayer])}>Bid</button>{" "}
        {this.props.combination.currentBid > -1 && 
          `Current bid: ${this.props.combination.currentBid} by ${this.props.combination.currentHolder.name}`}
      <br />
      </div>
    )
  }
}

export default Combination;
