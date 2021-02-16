/** @jsx jsx */

import React from "react";
import ReactDOM from "react-dom";
import { jsx } from "@emotion/core";
import LobbyView from "./scythe-bidder/lobby";
import "bootstrap/dist/css/bootstrap.min.css";
import "./layout.css";
import "antd/dist/antd.css";
import { Button, Layout, Tooltip, Input, Switch as Toggle } from "antd";
import { BellOutlined, BellFilled } from "@ant-design/icons";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import BidRoom from "./scythe-bidder/bid-room";
import { config } from "dotenv";
import { mq } from "./scythe-bidder/breakpoints";
import Lockr from "lockr";
import { NOTIFICATION_ENABLED } from "./scythe-bidder/constants";

import { useThemeSwitcher } from "react-css-theme-switcher";

config();

const App = () => {
  const setting =
    Lockr.get<string | undefined>(NOTIFICATION_ENABLED) === "true";
  const [isNotificationEnabled, setIsNotificationEnabled] = React.useState(
    setting
  );

  const onRequestNotification = React.useCallback(() => {
    const checkNotificationPromise = () => {
      try {
        Notification.requestPermission().then();
      } catch (e) {
        return false;
      }
      return true;
    };

    const requestPermission = async () => {
      if (!("Notification" in window)) {
        console.log("This browser does not support notifications.");
      } else {
        if (checkNotificationPromise()) {
          await Notification.requestPermission();
        } else {
          Notification.requestPermission(() => {});
        }
      }
    };

    requestPermission();
  }, []);

  const onToggleNotification = React.useCallback(() => {
    if (Notification.permission !== "granted" && !isNotificationEnabled) {
      onRequestNotification();
    }

    setIsNotificationEnabled((prev) => !prev);
  }, [isNotificationEnabled, onRequestNotification]);

  React.useEffect(() => {
    Lockr.set(NOTIFICATION_ENABLED, String(isNotificationEnabled));
  }, [isNotificationEnabled]);

  // themeswitch logic
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const { switcher, currentTheme, status, themes } = useThemeSwitcher();

  const toggleTheme = () => {
    if (isDarkMode) {
      setIsDarkMode(false);
      switcher({ theme: themes.light });
    } else {
      setIsDarkMode(true);
      switcher({ theme: themes.dark });
    }
  };

  // Avoid theme change flicker
  if (status === "loading") {
    return null;
  }

  return (
    <Layout>
      <Layout.Header
        css={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
        }}
      >
        <div
          css={{
            color: "white",
            fontWeight: 700,
            fontFamily: "Lato, sans-serif",
            fontSize: 20,
            [mq[0]]: {
              fontSize: 24,
            },
          }}
        >
          Scythe Bidder
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "30%",
            minWidth: 200,
          }}
        >
          <div>
            <a
              href="https://github.com/rezende/scythe-bidder"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contribute on GitHub
            </a>
          </div>
          <div>
            <Toggle
              checked={isDarkMode}
              onChange={toggleTheme}
              style={isDarkMode ? {} : { backgroundColor: "#8c8c8c" }}
            />
          </div>
        </div>
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
              <BidRoom isNotificationEnabled={isNotificationEnabled} />
            </Route>
          </Switch>
        </BrowserRouter>
        {!!window.Notification &&
          ReactDOM.createPortal(
            <Tooltip
              title={
                Notification.permission === "denied"
                  ? "Scythe Bidder is not authorized to send notifications"
                  : isNotificationEnabled
                  ? "Stop sending me notifications"
                  : "Notify me when it's my turn"
              }
              placement="topLeft"
            >
              <div css={{ position: "fixed", bottom: 40, right: 40 }}>
                <Button
                  css={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // workaround from https://github.com/ant-design/ant-design/issues/9581#issuecomment-599668648
                    pointerEvents:
                      Notification.permission === "denied" ? "none" : "auto",
                  }}
                  onClick={onToggleNotification}
                  shape="circle"
                  icon={
                    isNotificationEnabled ? <BellFilled /> : <BellOutlined />
                  }
                  disabled={Notification.permission === "denied"}
                />
              </div>
            </Tooltip>,
            document.body
          )}
      </Layout.Content>
    </Layout>
  );
};

export default App;
