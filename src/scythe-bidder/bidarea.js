import React from "react";
import Combination from './combination';
import { Container, Row, Col } from 'react-bootstrap';

const BidArea = props => {
  return(
    <Container className="text-center">
      <Row style={{backgroundColor: '#f0f0f0'}}>
        <Col lg={2}></Col>
        <Col>Combination</Col>
        <Col>Current Bid</Col>
      </Row>
      {props.G.combinations.map((c, key) => (
        <Combination
          combination={c}
          moves={props.moves}
          events={props.events}
          key={key}
          players={props.playerInfo}
          ctx={props.ctx}
          isActive={props.isActive}
        />
      ))}
      <Row style={{backgroundColor: '#f0f0f0'}}>
        <Col lg={2}></Col>
        <Col>Combination</Col>
        <Col>Current Bid</Col>
      </Row>
    </Container>
  )
}

export default BidArea;
