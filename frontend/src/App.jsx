import {ThemeProvider} from '@material-ui/core/styles';
import TitleSearch from "./Components/TitleSearch";
import {theme} from "./Style/Theme";
import { Routes, Route, Link } from "react-router-dom";
import SearchResults from './Components/SearchResults';

function App() {

    return (
        <div className="App" style={{maxWidth: "1920px", margin: "auto"}}>
            <ThemeProvider theme={theme}>
                <Routes>
                    <Route path='/' element={<TitleSearch/>} />
                    <Route path='/search' element={<SearchResults/>} />
                </Routes>
            </ThemeProvider>
        </div>
    );
}

export default App;
