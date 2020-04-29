import React from "react";
import _ from "lodash";
import { Button, Row, Col } from 'react-bootstrap';

class Combination extends React.Component {
  constructor(props) {
    super(props);
    this.selectInput = React.createRef();
  }

  bid(faction, mat, player) {
    this.props.moves.bid(faction, mat, this.selectInput.current.value, player);
    this.props.events.endTurn();
  }

  render() {
    return (
      <Row>
        <Col lg={2}>
          <select ref={this.selectInput}>
            {_.range(parseInt(this.props.combination.currentBid) + 1, 50).map(value => <option key={value} value={value}>{value}</option>)}
          </select>
          <Button disabled={!this.props.isActive} variant="light" onClick={() => this.bid(this.props.combination.faction, this.props.combination.mat, this.props.players[this.props.ctx.currentPlayer])}>Bid</Button>
        </Col>
        <Col className="my-auto">
          {this.props.combination.faction}{" "}{this.props.combination.mat}{" "}
        </Col>
        <Col>
          {this.props.combination.currentBid > -1 &&
            `$${this.props.combination.currentBid} by ${this.props.combination.currentHolder.name}`}
        </Col>
      </Row>
    )
  }
}

export default Combination;
