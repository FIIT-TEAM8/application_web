import { Box, Typography } from "@material-ui/core";
import { Pagination, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiCall } from "../Utils/APIConnector";
import ResultItem from "../Components/ResultItem";


export default function SearchResults({}) {

	const [searchParams, setSearchParams] = useSearchParams();
	const [actResults, setActResults] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const [totalResults, setTotalResults] = useState(0);


	useEffect(() => {
		apiCall(`/api/data/search/?q=${searchParams.get("q")}&page=${searchParams.get("page")}`, "GET").then((result) => {
			if (result.ok) {
				setActResults(result.data.results);
				setTotalPages(result.data.total_pages);
				setTotalResults(result.data.total_results);
			}
		});
	}, [searchParams]);


	const handlePageChange = (event, value) => {
		searchParams.delete("page");
		searchParams.append("page", value);
		setSearchParams(searchParams);
		window.scrollTo(0, 0);
	};


	return (
		<Stack sx={{ pt: 2 }}>
			<Typography style={{ color: "grey" }}>{totalResults} results found.</Typography>
			<Stack spacing={6} sx={{ pt: 4 }}>
				{actResults.map((result, index) => (
					<ResultItem item={result} index={index} /> ))}
			</Stack>
			<Box my={2} display="flex" justifyContent="center">
				{totalPages <= 1 ? <div></div>: <Pagination count={totalPages} page={parseInt(searchParams.get("page"))} onChange={handlePageChange} />}
			</Box>
		</Stack>
	);
}
