import { IconButton, TextField, Typography, Stack, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
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
        setSearchTerm(value.toLowerCase());
    };


    useEffect(() => {
        const q = searchParams.get("q");
        if (q){
            setShowingResults(true);
            setSearchTerm(q);
        }
    }, []);
    

    const onSubmit = (event) => {
        event.preventDefault();
        setShowingResults(true);
        navigate(`results?q=${searchTerm}&page=${1}`);
    };


    return (
        <div style={searchDivStyle}>
            <form onSubmit={onSubmit}>
                <Typography variant="h1" color="primary">ams</Typography>
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
                            <InputAdornment position="end">{<IconButton ><Search /></IconButton>}</InputAdornment>
                        ) 
                    }}
                    />
            </form>

            <Outlet/>
        </div>
    )
}