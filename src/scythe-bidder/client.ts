import { LobbyClient } from "boardgame.io/client";

const client = new LobbyClient({
  server: "http://localhost:8000",
});

export default client;
