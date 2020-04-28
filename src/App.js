import React from 'react';
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import ScytheBidderGame from './scythe-bidder/game';
import BiddingBoard from './scythe-bidder/board';

const ScytheClient = Client({
  game: ScytheBidderGame,
  board: BiddingBoard,
  multiplayer: Local(),
  numPlayers: 4,
});

const App = () => (
  <div>
    <ScytheClient playerID="0"/>
    <ScytheClient playerID="1"/>
    <ScytheClient playerID="2"/>
    <ScytheClient playerID="3"/>
  </div>
);

export default App
