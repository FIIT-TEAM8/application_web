import {ThemeProvider} from '@material-ui/core/styles';
import TitleSearch from "./Components/TitleSearch";
import {theme} from "./Style/Theme";




function App() {
    return (
        <div className="App" style={{maxWidth: "1920px", margin: "auto"}}>
            <ThemeProvider theme={theme}>
                <TitleSearch/>
            </ThemeProvider>
        </div>
    );
}

export default App;
