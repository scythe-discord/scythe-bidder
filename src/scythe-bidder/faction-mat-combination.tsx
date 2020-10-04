/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import _ from "lodash";
import { Button, Image } from "react-bootstrap";
import { Combination, Faction, Mat, Player } from "./types";
import { Ctx } from "boardgame.io";
import { EventsAPI } from "boardgame.io/dist/types/src/plugins/events/events";

interface Props {
  combination: Combination;
  moves: Record<string, (...args: any[]) => void>;
  events: EventsAPI;
  players: Array<Player>;
  ctx: Ctx;
  isActive: boolean;
}

class FactionMatCombination extends React.Component<Props> {
  selectInput = React.createRef<HTMLSelectElement>();

  matImages = {
    Innovative:
      "https://cf.geekdo-images.com/original/img/VD0zB_uzIIi5kaGYd6HNHjM2oTA=/0x0/pic3333416.png",
    Militant:
      "https://cf.geekdo-images.com/original/img/6aSVG7qvEM6NtXL0xJhgva8KxmA=/0x0/pic3333417.png",
    Patriotic:
      "https://cf.geekdo-images.com/original/img/nyNtLvT0rC_qrboC_A3rFoYMu6U=/0x0/pic2695350.jpg",
    Industrial:
      "https://cdn.arstechnica.net/wp-content/uploads/2016/07/ScythePlayermat.png",
    Agricultural:
      "https://cf.geekdo-images.com/camo/9fe9795cf6647df8b0db3be6f103bb5ea45348e8/68747470733a2f2f692e696d6775722e636f6d2f45434b73656b552e706e67",
    Engineering:
      "https://cf.geekdo-images.com/camo/faebc55a71303fbe0836ff9a0bf3bae001d5371f/68747470733a2f2f692e696d6775722e636f6d2f386478327964622e706e67",
    Mechanical:
      "https://steamuserimages-a.akamaihd.net/ugc/968727454197258419/AC405A3EB987C0F804E6D439C7B738E5F3546272/",
  };

  bid(faction: Faction, mat: Mat, player: Player) {
    if (typeof this.props.moves.bid !== "function") {
      throw new Error("bid is not callable");
    }
    if (!this.selectInput.current) {
      return;
    }
    this.props.moves.bid(
      faction,
      mat,
      parseInt(this.selectInput.current.value),
      player
    );
    if (typeof this.props.events.endTurn !== "function") {
      throw new Error("endTurn is not callable");
    }
    this.props.events.endTurn();
  }

  getFactionIcon() {
    return (
      <Image
        src={require(`./static/images/${this.props.combination.faction}.png`)}
        height={"50px"}
        roundedCircle
      />
    );
  }

  getMatLink() {
    return (
      <Button
        as="a"
        href={this.matImages[this.props.combination.mat]}
        target={"_blank"}
      >
        {this.props.combination.mat}
      </Button>
    );
  }

  render() {
    return (
      <tr>
        <td className="align-middle text-center">
          <select ref={this.selectInput}>
            {_.range(this.props.combination.currentBid + 1, 50).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <Button
            variant="primary"
            disabled={!this.props.isActive}
            onClick={() =>
              this.bid(
                this.props.combination.faction,
                this.props.combination.mat,
                this.props.players[parseInt(this.props.ctx.currentPlayer)]
              )
            }
          >
            Bid
          </Button>
        </td>
        <td className="align-middle text-center">
          {this.getFactionIcon()} {this.getMatLink()}{" "}
        </td>
        <td className="align-middle text-center">
          {this.props.combination.currentBid > -1 &&
            this.props.combination.currentHolder &&
            `$${this.props.combination.currentBid} by ${this.props.combination.currentHolder.name}`}
        </td>
      </tr>
    );
  }
}

export default FactionMatCombination;
