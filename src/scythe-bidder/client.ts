import { LobbyClient } from "boardgame.io/client";
import { SERVER_URL } from "./config";

const client = new LobbyClient({
  server: SERVER_URL,
});

export default client;
