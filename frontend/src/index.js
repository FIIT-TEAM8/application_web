import React from "react";
import ReactDOM from "react-dom";
import "./Style/index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter
            basename={
                // @ts-ignore
                process.env.PUBLIC_URL
            }>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);
