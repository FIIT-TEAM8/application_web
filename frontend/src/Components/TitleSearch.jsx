import { Collapse, IconButton, TextField, Typography, InputAdornment, Stack, Button, Box } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useSearchParams, Link } from "react-router-dom";
import { useWindowSize } from "../Utils/Screen";
import AdvancedSearch from "../Components/AdvancedSearch";


export default function TitleSearch() {

    const navigate = useNavigate();
    const width = useWindowSize();
    const shouldCollapse = width < 992

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [showingResults, setShowingResults] = useState(false);
    const [advancedSearchSelected, setAdvancedSearchSelected] = useState(false);
    const [noOfSelectedAdvFilters, setNoOfSelectedAdvFilters] = useState(0);
    const [appliedAdvancedSearch, setAppliedAdvancedSearch] = useState(false);
    
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

    const onAdvancedSearchClick = () => {
        setAdvancedSearchSelected(true);
    };


    const onAdvancedSearchHide = () => {
        setAdvancedSearchSelected(false);
        //setNoOfSelectedAdvFilters(noOfFiltes);
        window.scroll({top: 0, left: 0, behavior: 'smooth' });
    }


    const onAdvancedSearchApply = () => {
        setAppliedAdvancedSearch(true);
        onAdvancedSearchHide();
    }


    const onAdvancedSearchFilterClick = (noOfFiltes) => {
        setAppliedAdvancedSearch(false);
        setNoOfSelectedAdvFilters(noOfFiltes);
    }


    // check if we should change actual state to main page state
    useEffect(() => {
        const q = searchParams.get("q");
        if (!q) {
            setShowingResults(false);
            setSearchTerm("");
        }
    }, [searchParams]);

    const onSubmit = (event) => {
        setAppliedAdvancedSearch(false);
        setAdvancedSearchSelected(false);
        event.preventDefault();
        setShowingResults(true);
        searchParams.delete("q");
		searchParams.append("q", searchTerm);
        searchParams.delete("page");
		searchParams.append("page", 1);
        setSearchParams(searchParams);
        navigate(`results?${searchParams.toString()}`);
    };


    return (
        <div style={searchDivStyle}>
            <form onSubmit={onSubmit}>
                <Link to="/search" onClick={onAdvancedSearchHide} style={{ textDecoration: 'none' }} >
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
            
            <Collapse timeout={1200} in={advancedSearchSelected}>
                <AdvancedSearch parentOnHide={onAdvancedSearchHide} parentOnApply={onAdvancedSearchApply} parentFilterClick={onAdvancedSearchFilterClick} />
            </Collapse>
            
            {(!advancedSearchSelected) && 
                <Stack 
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                    direction={"row"}
                    spacing={2}
                    >
                    {noOfSelectedAdvFilters ? 
                        appliedAdvancedSearch ? 
                            <Stack
                                direction={"row"}
                                spacing={0.3}
                            >
                                <Box sx={{ textAlign: 'center', borderRadius: "50%", width: "0.9rem", height: "0.9rem", backgroundColor: 'primary.main' }}>
                                    <Typography fontSize={11}  color="white">{noOfSelectedAdvFilters}</Typography>
                                </Box>
                                <Typography color="primary" fontSize={11}>applied filters</Typography>
                            </Stack> 
                            : 
                            <Stack
                                direction={"row"}
                                spacing={0.3}
                            >
                                <Box sx={{ textAlign: 'center', borderRadius: "50%", width: "0.9rem", height: "0.9rem", backgroundColor: 'error.main' }}>
                                    <Typography fontSize={11}  color="white">{noOfSelectedAdvFilters}</Typography>
                                </Box>
                                <Typography color="error" fontSize={11}>filters waiting to be applied</Typography>
                            </Stack> 
                        : 
                        <></> 
                    }
                    <Button 
                        color="secondary" 
                        variant="text" 
                        size="small" 
                        style={{textDecoration: "underline"}}
                        onClick={onAdvancedSearchClick}
                        >
                        Advanced search
                    </Button>
                </Stack>
            }

            <Outlet />
        </div>
    )
}