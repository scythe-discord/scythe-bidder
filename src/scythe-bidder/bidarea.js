import React from "react";
import Combination from './combination';

//does not need to be a class
class BidArea extends React.Component {
  render() {
    return (
      <div>
        {this.props.G.combinations.map((c, key) => (
          <Combination
            combination={c}
            moves={this.props.moves}
            events={this.props.events}
            key={key}
            players={this.props.playerInfo}
            ctx={this.props.ctx}
            isActive={this.props.isActive}
          />
        ))}
      </div>
    )
  }
}

export default BidArea;
