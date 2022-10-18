/* eslint-disable no-template-curly-in-string */
const config = {
  REACT_APP_NODE_SERVER_URL: process.env.REACT_APP_PRODUCTION ? "${{REACT_APP_NODE_SERVER_URL}}$" : "http://localhost:8080",
};

export default config;
