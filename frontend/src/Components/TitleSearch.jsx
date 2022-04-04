import { IconButton, TextField, Typography, InputAdornment, Stack, Button } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useSearchParams, Link } from "react-router-dom";
import { useWindowSize } from "../Utils/Screen";


export default function TitleSearch() {

    const navigate = useNavigate();
    const width = useWindowSize();
    const shouldCollapse = width < 992

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("")
    const [showingResults, setShowingResults] = useState(false)
    
    let searchDivStyle = {
        margin: "auto", 
        padding: shouldCollapse ? "200px 7%" : "200px 20%"
    };


    if (showingResults) {
        searchDivStyle.padding = shouldCollapse ? "20px 7%" : "20px 20%";
    }


    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };


    // during render, check search params and fill appropriate fields/components
    useEffect(() => {
        const q = searchParams.get("q");
        if (q) {
            setShowingResults(true);
            setSearchTerm(q);
        }
    }, []);


    // check if we should change actual state to main page state
    useEffect(() => {
        const q = searchParams.get("q");
        if (!q) {
            setShowingResults(false);
            setSearchTerm("");
        }
    }, [searchParams]);
    

    const onSubmit = (event) => {
        event.preventDefault();
        setShowingResults(true);
        navigate(`results?q=${searchTerm}&page=${1}`);
    };


    return (
        <div style={searchDivStyle}>
            <form onSubmit={onSubmit}>
                <Link to="/search" style={{ textDecoration: 'none' }} >
                    <Typography variant="h1" color="primary">ams</Typography>
                </Link>
                <TextField
                    id="outlined-search"
                    color={"secondary"}
                    value={searchTerm}
                    label={"Search"}
                    autoComplete="off"
                    variant="outlined"
                    onChange={event => handleSearchChange(event.target.value)}
                    fullWidth 
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">{<IconButton color="primary" type="submit"><Search /></IconButton>}</InputAdornment>
                        ) 
                    }}
                    />
            </form>
            <Stack 
                alignItems={"flex-end"}
                justifyContent={"flex-end"}
                >
                <Button color="secondary" variant="text" size="small" style={{textDecoration: "underline"}}>Advanced search</Button>
            </Stack>

            <Outlet/>
        </div>
    )
}