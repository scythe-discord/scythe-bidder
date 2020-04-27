/*
 * Copyright 2018 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import { Client } from 'boardgame.io/react';
import ScytheBidderGame from './game';
import BiddingBoard from './board';


const ScytheClient = Client({
  game: ScytheBidderGame,
  board: BiddingBoard,
});

export default ScytheClient;
