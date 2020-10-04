## How to run

In the project directory, you can run:

### `yarn`

Install dependencies

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `node -r esm src/server.js`

* Run an instance of the game server.

The `Lobby` component **must be changed** to
point to `http://localhost:8000` (both `gameServer` and `lobbyServer` variables)

This happens because I didn't set a development environment yet 

## Contributing

Branch off `development` branch and open PR requests against it.
