import { ThemeProvider } from "@material-ui/core/styles";
import TitleSearch from "./Components/TitleSearch";
import { theme } from "./Style/Theme";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import SearchResults from "./Components/SearchResults";

function App() {
	return (
		<div className='App' style={{ maxWidth: "1920px", margin: "auto" }}>
			<ThemeProvider theme={theme}>
				<Routes>
					<Route path='' element={<Navigate to='search' />} />
					<Route path='search' element={<TitleSearch />}>
						<Route path='results' element={<SearchResults />} />
					</Route>
					<Route path='example' element={<div>This is an example</div>} />
				</Routes>
			</ThemeProvider>
		</div>
	);
}

export default App;
