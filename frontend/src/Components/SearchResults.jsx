import { Box, Divider, Typography, Link } from "@material-ui/core";
import { Pagination, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiCall } from "../Utils/APIConnector";

const PAGE_SIZE = 8;

export default function SearchResults({}) {
	const [searchParams, setSearchParams] = useSearchParams();

	const [actResults, setActResults] = useState([]);
	const [actPage, setActPage] = useState(1);

	// const totalPages = Math.ceil(data.result_count / PAGE_SIZE);

	useEffect(() => {
		apiCall(`/api/data/search/?q=${searchParams.get("q")}`, "GET").then((result) => {
			if (result.ok) {
				console.log(result.data);
				setActResults(result.data.results);
			}
		});
	}, [searchParams]);

	// useEffect(() => {
	//     setActPage(1);
	//     setActResults(data.results.slice(0, PAGE_SIZE));
	// }, [data.results]);

	// useEffect(() => {
	//     let firstPageResultIndex = (actPage - 1) * PAGE_SIZE;
	//     let lastPageResultIndex = firstPageResultIndex + PAGE_SIZE;
	//     setActResults(data.results.slice(firstPageResultIndex, lastPageResultIndex));
	// }, [actPage, data.results]);

	const handlePageChange = (event, value) => {
		setActPage(value);
	};

	return (
		<Stack sx={{ pt: 2 }}>
			{/* <Typography style={{ color: "grey" }}>{data.result_count} results found.</Typography> */}
			<Stack spacing={6} sx={{ pt: 4 }}>
				{actResults.map((result) => (
					<Stack spacing={1}>
						<Stack
							direction='row'
							divider={<Divider style={{ background: "grey" }} orientation='vertical' flexItem />}
							spacing={2}>
							<Box sx={{ width: 80 }}>
								<Typography noWrap style={{ color: "grey" }}>
									{result.published.slice(5, -13)}
								</Typography>
							</Box>
							<Link href={result.link} target='_blank' rel='noopener' underline='none' noWrap>
								<Typography noWrap style={{ color: "grey" }}>
									{result.link}
								</Typography>
							</Link>
						</Stack>
						<Link href={result.link} target='_blank' rel='noopener'>
							<Typography noWrap variant='h2' color='primary'>
								{result.title}
							</Typography>
						</Link>
						<Stack direction='row' style={{ color: "grey" }} spacing={2}>
							{result.keywords.map((crime) => (
								<Box
									sx={{
										pl: 0.7,
										pr: 0.7,
										borderRadius: 3,
									}}
									style={{
										background: "#e6e7eb",
										color: "grey",
									}}>
									<Typography>{crime}</Typography>
								</Box>
							))}
						</Stack>
					</Stack>
				))}
			</Stack>
			<Box my={2} display='flex' justifyContent='center'>
				{/* {totalPages <= 1 ? <div></div>: <Pagination count={totalPages} page={actPage} onChange={handlePageChange} showFirstButton showLastButton></Pagination>} */}
			</Box>
		</Stack>
	);
}
