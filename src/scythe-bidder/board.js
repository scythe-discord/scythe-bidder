import React from "react";
import Combination from './combination'


const messageStyle = {
  color: 'blue'
}

const rulesText = 'Pick the combination you want to play as'

const BiddingBoard = props => {
  const { G, playerID, isActive, moves, events, gameMetadata, ctx } = props;
  return (
    <div>
      <div>
          <div id='rules'>
            <p id='rulesText'>{rulesText}</p>
          </div>
          <span id='turnmessage' style={messageStyle}>
            {isActive && `It's your turn, ${gameMetadata[playerID].name}`}
          </span>
          <br />
          <br />
      </div>
      {G.combinations.map((c, key) => (
        <Combination combination={c} moves={moves} events={events} key={key} players={gameMetadata} ctx={ctx}/>
      ))}
    </div>
  );
};

export default BiddingBoard
