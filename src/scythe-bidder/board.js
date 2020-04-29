import React from "react";
import TurnOrder from './turnorder';
import BidArea from './bidarea';
import { Container } from 'react-bootstrap';


const messageStyle = {
  color: 'blue'
}
 
let playerInfo = [
  {name: 'Player 1', id: 0},
  {name: 'Player 2', id: 1},
  {name: 'Player 3', id: 2},
  {name: 'Player 4', id: 3}
];

const rulesText = 'Scythe Auction v0.1.0';

function showGameEndMessage(gameOver) {
  if (typeof gameOver === "undefined") {
    return false;
  }
  return (
    <Container className="justify-content-center">
      {gameOver.map((c, key) => (
        <p key={key}>{c.faction}{" "}{c.mat}{" - $"}{c.currentBid}{" to "}{c.currentHolder.name}</p>
      ))}
    </Container>
  )
};

const BiddingBoard = props => {
  const { G, playerID, isActive, moves, events, gameMetadata, ctx } = props;
  if (typeof gameMetadata !== 'undefined') { playerInfo = [...gameMetadata]; }
  return (
    <div>
      <div id='rules'>
        <p id='rulesText' style={{ 'textDecoration': 'underline' }}>{rulesText}</p>
      </div>
      {isActive && <p style={messageStyle}>It's your turn</p>}
      {!ctx.gameover &&
        <Container className="justify-content-left">
          <TurnOrder players={playerInfo} ctx={ctx} playerID={playerID} isActive={isActive}/>
        </Container>
      }
      {showGameEndMessage(ctx.gameover) ||
        <BidArea isActive={isActive} ctx={ctx} G={G} moves={moves} events={events} playerInfo={playerInfo}/>
      }
    </div>
  )
};

export default BiddingBoard
