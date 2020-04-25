import React from 'react';
import { Lobby } from 'boardgame.io/react';
import BiddingBoard from '../scythe-bidder/board';
import ScytheBidderGame from '../scythe-bidder/game';
import './lobby.css';

ScytheBidderGame.minPlayers = 2;
ScytheBidderGame.maxPlayers = 7;

const hostname = window.location.hostname;
const importedGames = [
  { game: ScytheBidderGame, board: BiddingBoard },
];

const LobbyView = () => (
  <div style={{ padding: 50 }}>
    <h1>Game Lobby</h1>

    <Lobby
      gameServer={`http://${hostname}:8000`}
      lobbyServer={`http://${hostname}:8000`}
      gameComponents={importedGames}
    />
  </div>
);

export default LobbyView;
