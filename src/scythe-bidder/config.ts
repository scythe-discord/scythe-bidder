export const SERVER_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : `https://${window.location.hostname}`;
