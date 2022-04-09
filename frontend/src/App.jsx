import { ThemeProvider } from "@mui/material/styles";
import { Routes, Route, Navigate } from "react-router-dom";
import { theme } from "./Style/Theme";
import UserProvider from "./Components/UserProvider";
import MainLayout from "./Components/MainLayout";

function App() {
    return (
        <div className="App" style={{ maxWidth: "1920px", margin: "auto" }}>
            <UserProvider>
                <ThemeProvider theme={theme}>
					          <MainLayout/>
                </ThemeProvider>
            </UserProvider>
        </div>
    );
}

export default App;
