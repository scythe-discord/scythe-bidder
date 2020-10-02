import React from "react";
import TurnOrder from "./turnorder";
import BidArea from "./bidarea";
import GameLog from "./gamelog";
import { Container } from "react-bootstrap";
import { ClientSideBid, Combination, GameState, Player } from "./types";
import { Ctx } from "boardgame.io";
import { EventsAPI } from "boardgame.io/dist/types/src/plugins/events/events";

const messageStyle = {
  color: "blue",
};

let playerInfo = [
  { name: "Player 1", id: 0 },
  { name: "Player 2", id: 1 },
  { name: "Player 3", id: 2 },
  { name: "Player 4", id: 3 },
];

const rulesText = "Scythe Auction v0.1.0";

function showGameEndMessage(gameOver?: Array<Combination>) {
  if (typeof gameOver === "undefined") {
    return false;
  }
  return (
    <Container className="font-weight-bold justify-content-center">
      <h3>Auction Ended!</h3>
      {gameOver.map((c, key) => (
        <p key={key}>
          {c.faction} {c.mat}
          {" - $"}
          {c.currentBid}
          {" to "}
          {c.currentHolder!.name}
        </p>
      ))}
    </Container>
  );
}

const BiddingBoard = (props: {
  G: GameState;
  playerID: string;
  isActive: boolean;
  moves: {
    bid: ClientSideBid;
  };
  events: EventsAPI;
  gameMetadata?: Array<Player>;
  ctx: Ctx;
}) => {
  const { G, playerID, isActive, moves, events, gameMetadata, ctx } = props;
  if (typeof gameMetadata !== "undefined") {
    playerInfo = [...gameMetadata];
  }
  return (
    <div>
      <div id="rules">
        <p id="rulesText" style={{ textDecoration: "underline" }}>
          {rulesText}
        </p>
      </div>
      {isActive && <p style={messageStyle}>It's your turn</p>}
      {!ctx.gameover && (
        <Container className="justify-content-left">
          <TurnOrder
            players={playerInfo}
            ctx={ctx}
            playerID={playerID}
            isActive={isActive}
          />
        </Container>
      )}
      {showGameEndMessage(ctx.gameover) || (
        <BidArea
          isActive={isActive}
          ctx={ctx}
          G={G}
          moves={moves}
          events={events}
          playerInfo={playerInfo}
        />
      )}
      <GameLog G={G} />
    </div>
  );
};

export default BiddingBoard;
