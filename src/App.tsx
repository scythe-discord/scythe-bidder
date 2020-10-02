import React from "react";
import LobbyView from "./scythe-bidder/lobby";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./ui/header/header";
import Footer from "./ui/footer/footer";
import "./layout.css";

const App = () => (
  <>
    <Header />
    <LobbyView />
    <Footer />
  </>
);

export default App;
