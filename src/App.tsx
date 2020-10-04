/** @jsx jsx */

import { jsx } from "@emotion/core";
import LobbyView from "./scythe-bidder/lobby";
import "bootstrap/dist/css/bootstrap.min.css";
import "./layout.css";
import "antd/dist/antd.css";
import { Layout } from "antd";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import BidRoom from "./scythe-bidder/bid-room";
import { config } from "dotenv";

config();

const App = () => (
  <Layout>
    <Layout.Header
      css={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        css={{
          color: "white",
          fontWeight: 700,
          fontFamily: "Lato, sans-serif",
          fontSize: 24,
        }}
      >
        Scythe Bidder
      </div>
      <a
        href="https://github.com/rezende/scythe-bidder"
        target="_blank"
        rel="noopener noreferrer"
      >
        Contribute on GitHub
      </a>
    </Layout.Header>
    <Layout.Content
      css={{
        margin: "24px auto 96px",
        padding: "0 24px",
        maxWidth: 1200,
        width: "100%",
      }}
    >
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            <LobbyView />
          </Route>
          <Route path="/game/:matchId">
            <BidRoom />
          </Route>
        </Switch>
      </BrowserRouter>
    </Layout.Content>
  </Layout>
);

export default App;
