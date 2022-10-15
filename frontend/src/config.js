const config = {
  REACT_APP_PORT: process.env.REACT_APP_PRODUCTION ? "REACT_APP_PORT" : 3000,
  REACT_APP_NODE_SERVER_URL: process.env.REACT_APP_PRODUCTION ? "${{REACT_APP_NODE_SERVER_URL}}$" : "HOVNO",
};

export default config;
