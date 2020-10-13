import { Server } from "boardgame.io/server";
import path from "path";
import serve from "koa-static";
import { default as ScytheBidderGame } from "../src/scythe-bidder/game";
import {
  default as sslify,
  xForwardedProtoResolver as resolver,
} from "koa-sslify";

const server = Server({ games: [ScytheBidderGame] });
const PORT = Number(process.env.PORT) || 8000;

if (process.env.NODE_ENV === "production") {
  server.app.use(sslify({ resolver }));
}

const frontEndAppBuildPath = path.resolve(__dirname, "../build");
server.app.use(serve(frontEndAppBuildPath));

server.run(PORT, () => {
  server.app.use(
    async (ctx: any, next: any) =>
      await serve(frontEndAppBuildPath)(
        Object.assign(ctx, { path: "index.html" }),
        next
      )
  );
});
