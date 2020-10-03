/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import { useParams } from "react-router-dom";

export default function BidRoom() {
  const { matchId } = useParams<{ matchId: string }>();
  console.log(matchId);
  return null;
}
