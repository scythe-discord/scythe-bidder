import React from 'react';
import { Lobby } from 'boardgame.io/react';
import BiddingBoard from '../scythe-bidder/board';
import ScytheBidderGame from '../scythe-bidder/game';
import './lobby.css';

ScytheBidderGame.minPlayers = 2;
ScytheBidderGame.maxPlayers = 7;

const server = `https://${window.location.hostname}`;

const importedGames = [
  { game: ScytheBidderGame, board: BiddingBoard },
];

export default () => (
  <div>
    <h1>Lobby</h1>
    <Lobby gameServer={server} lobbyServer={server} gameComponents={importedGames} />
  </div>
)