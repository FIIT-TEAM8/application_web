import { ThemeProvider } from "@material-ui/core/styles";
import { Routes, Route, Navigate } from "react-router-dom";
import { theme } from "./Style/Theme";
import SearchResults from "./Components/SearchResults";
import TitleSearch from "./Components/TitleSearch";
import MainBar from "./Components/MainBar";
import Login from "./Components/Login";


function App() {
	return (
		<div className='App' style={{ maxWidth: "1920px", margin: "auto" }}>
			<ThemeProvider theme={theme}>
				<MainBar />
				<Routes>
					<Route path='' element={<Navigate to='search' />} />
					<Route path='search' element={<TitleSearch />}>
						<Route path='results' element={<SearchResults />} />
					</Route>
					<Route path='login' element={<Login open={true} />} />
					<Route path='example' element={<div>This is an example</div>} />
				</Routes>
			</ThemeProvider>
		</div>
	);
}

export default App;
