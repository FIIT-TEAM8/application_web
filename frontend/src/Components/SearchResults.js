import { Box, Divider, Typography, Link, List, ListItemText } from "@material-ui/core";
import { Pagination } from "@mui/material";
import { useState, useMemo, useEffect } from "react";

let PAGE_SIZE = 10;

export default function SearchResults(props) {

    const [actPage, setActPage] = useState(1);
    const totalPages = Math.ceil(props.data.result_count / PAGE_SIZE);

    const actResults = useMemo(() => {
        const firstPageIndex = (actPage - 1) * PAGE_SIZE;
        const lastPageIndex = firstPageIndex + PAGE_SIZE;
        return props.data.results.slice(firstPageIndex, lastPageIndex);
    }, [actPage]);

    useEffect(() => {
        setActPage(1);
    }, [props.data.results]);

    const handlePageChange = (event, value) => {
        setActPage(value);
    };

    return (
        <div style={{paddingTop: "20px", }}>
            <Typography style={{ color: "grey" }}>{props.data.result_count} results found.</Typography>
            <div style={{ paddingTop: "20px", }}>
                { actResults.map((result) => (
                    <List sx={{ width: '100%', }}>
                        <Box
                            sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: 'fit-content',
                            }}
                        >
                            <Typography style={{color: "grey"}}>{result.published}</Typography>
                            <Divider sx={{ t: 10}} style={{background: "grey"}} orientation="vertical" variant="middle" flexItem />
                            <Link
                                href={result.link} 
                                target="_blank" 
                                rel="noopener" 
                                underline="none"
                            >
                                <Typography style={{color: "grey"}}>{result.link}</Typography>
                            </Link>
                        </Box>
                        <Link
                            href={result.link} 
                            target="_blank" 
                            rel="noopener" 
                        >
                                <ListItemText 
                                    disableTypography
                                    primary={<Typography variant="h2" color="primary">{result.title}</Typography>}
                                >
                                </ListItemText>
                        </Link>
                        <ListItemText
                            style={{paddingBottom: "30px"}}
                            disableTypography
                            primary={<Typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</Typography>}
                        >
                        </ListItemText>
                    </List>
                ))
                }
            </div>
            <Box my={2} display="flex" justifyContent="center">
                {totalPages <= 1 ? <div></div>: <Pagination count={totalPages} page={actPage} onChange={handlePageChange} showFirstButton showLastButton></Pagination>}
            </Box>
        </div>
    )
}