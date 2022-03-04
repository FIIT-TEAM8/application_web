import {ThemeProvider} from '@material-ui/core/styles';
import TitleSearch from "./Components/TitleSearch";
import {theme} from "./Style/Theme";
import { Routes, Route, Link } from "react-router-dom";




function App() {

    return (
        <div className="App" style={{maxWidth: "1920px", margin: "auto"}}>
            <ThemeProvider theme={theme}>
                <Routes>
                </Routes>
                <TitleSearch/>
            </ThemeProvider>
        </div>
    );
}

export default App;
