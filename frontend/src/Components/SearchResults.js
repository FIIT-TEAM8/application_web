import { Box, Divider, Typography, Link } from "@material-ui/core";
import { Pagination, Stack } from "@mui/material";
import { useState, useMemo, useEffect } from "react";


const PAGE_SIZE = 10;
const crimes = ["murder", "kill", "bomb threat"]

export default function SearchResults(props) {

    const [actResults, setActResults] = useState([])
    const [actPage, setActPage] = useState(1);

    const totalPages = Math.ceil(props.data.result_count / PAGE_SIZE);

    useEffect(() => {
        setActPage(1);
        setActResults(props.data.results.slice(0, PAGE_SIZE));
    }, [props.data.results]);

    useEffect(() => {
        let firstPageResultIndex = (actPage - 1) * PAGE_SIZE;
        let lastPageResultIndex = firstPageResultIndex + PAGE_SIZE;
        setActResults(props.data.results.slice(firstPageResultIndex, lastPageResultIndex));
    }, [actPage]);

    const handlePageChange = (event, value) => {
        setActPage(value);
    };

    return (
        <Stack sx={{ pt: 2 }}>
            <Typography style={{ color: "grey" }}>{props.data.result_count} results found.</Typography>
            <Stack spacing={6} sx={{ pt: 4 }}>
                { actResults.map((result) => (
                    <Stack spacing={1}>
                        <Stack
                            direction="row"
                            divider={
                                <Divider 
                                    style={{background: "grey"}} 
                                    orientation="vertical" 
                                    flexItem />
                                }
                            spacing={2}
                        >
                            <Typography style={{color: "grey"}}>{result.published}</Typography>
                            <Link
                                href={result.link} 
                                target="_blank" 
                                rel="noopener" 
                                underline="none"
                            >
                                <Typography style={{color: "grey"}}>{result.link}</Typography>
                            </Link>
                        </Stack>
                        <Link
                            href={result.link} 
                            target="_blank" 
                            rel="noopener" 
                        >
                                <Typography variant="h2" color="primary">{result.title}</Typography>
                        </Link>
                        <Stack
                            direction="row"
                            style={{color: "grey"}}
                            spacing={2}
                        >
                            { crimes.map((crime) => (
                                <Box
                                    sx={{ 
                                        pl: 0.7, 
                                        pr: 0.7, 
                                        borderRadius: 3 
                                    }}
                                    style={{
                                        background: "#e6e7eb", 
                                        color: "grey" 
                                    }}
                                >
                                    <Typography>{crime}</Typography>
                                </Box>
                            ))
                            }
                        </Stack>
                    </Stack>
                ))
                }
            </Stack>
            <Box my={2} display="flex" justifyContent="center">
                {totalPages <= 1 ? <div></div>: <Pagination count={totalPages} page={actPage} onChange={handlePageChange} showFirstButton showLastButton></Pagination>}
            </Box>
        </Stack>
    )
}