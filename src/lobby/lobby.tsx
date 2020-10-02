import React from "react";
import { Lobby } from "boardgame.io/react";
import BiddingBoard from "../scythe-bidder/board";
import ScytheBidderGame from "../scythe-bidder/game";
import "./lobby.css";

const server = `https://${window.location.hostname}`;

const importedGames = [{ game: ScytheBidderGame, board: BiddingBoard }];

export default () => (
  <main className="container">
    <h1>Auction Rooms</h1>
    <Lobby
      gameServer={server}
      lobbyServer={server}
      gameComponents={importedGames}
    />
  </main>
);
