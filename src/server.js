const os = require('os');
import { default as ScytheBidderGame } from './scythe-bidder/game';
import { Server } from 'boardgame.io/server';

const hostname = os.hostname();
const PORT = process.env.PORT || 8000;
const server = Server({ games: [ScytheBidderGame] });
server.run(PORT, () => {
  console.log(`Serving at: ${hostname}:${PORT}/`);
});
