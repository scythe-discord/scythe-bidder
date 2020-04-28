import React from "react";
import _ from "lodash";

class TurnOrder extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.players.map((p, key) => {
          return <p>{p.name}</p>
        })}
      </div>
    )
  }
}

export default Combination;
