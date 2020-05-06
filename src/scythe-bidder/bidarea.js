import React from "react";
import Combination from './combination';
import { Table } from 'react-bootstrap';

const BidArea = props => {
  return(
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
      </tbody>
    </Table>
  )
}

export default BidArea;
