import React from "react";
import Combination from './combination'
import TurnOrder from '.turnorder'


const messageStyle = {
  color: 'blue'
}

let playerInfo = [
  {name: 'Player 1', id: 0},
  {name: 'Player 2', id: 1},
  {name: 'Player 3', id: 2},
  {name: 'Player 4', id: 3}
];

const rulesText = 'Scythe Auction v0.0.1';

const BiddingBoard = props => {
  const { G, playerID, isActive, moves, events, gameMetadata, ctx } = props;
  if (typeof gameMetadata !== 'undefined') { playerInfo = [...gameMetadata]; }
  return (
    <div>
      <div>
          <div id='rules'>
            <p id='rulesText' style={{ 'text-decoration': 'underline' }}>{rulesText}</p>
          </div>
          <span id='turnmessage' style={messageStyle}>
            {isActive && `It's your turn, ${playerInfo[playerID].name}`}
          </span>
          <TurnOrder players={playerInfo} ctx={ctx}/>
          <br />
          <br />
      </div>
      {G.combinations.map((c, key) => {
        return <Combination combination={c} moves={moves} events={events} key={key} players={playerInfo} ctx={ctx}/>
      })}
    <footer>============================================</footer>
    </div>
  );
};

export default BiddingBoard
