import { LobbyClient } from "boardgame.io/client";

const client = new LobbyClient({
  server: process.env.REACT_APP_SERVER_URL,
});

export default client;
