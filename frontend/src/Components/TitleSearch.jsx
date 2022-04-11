import { Collapse, IconButton, TextField, Typography, InputAdornment, Stack, Button, Box, ButtonBase } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
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
    const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
    const [selectedAdvancedSearchFilters, setSelectedAdvancedSearchFilters] = useState(undefined);
    const [numOfSelectedAdvancedSearchFilters, setNumOfSelectedAdvancedSearchFilters] = useState(0);
    const [isSelectedAdvSearchYearFrom, setIsSelectedAdvSearchYearFrom] = useState(false);
    const [isSelectedAdvSearchYearTo, setIsSelectedAdvSearchYearTo] = useState(false);

    let searchDivStyle = {
        margin: "auto", 
        padding: shouldCollapse ? "200px 7%" : "200px 20%"
    };


    if (showingResults) {
        searchDivStyle.padding = shouldCollapse ? "20px 7%" : "20px 20%";
    }


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


    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };


    const onAdvancedSearchHide = () => {
        setAdvancedSearchOpen(false);
        window.scroll({top: 0, left: 0, behavior: 'smooth' });
    }


    const onAdvancedSearchApply = () => {
        onAdvancedSearchHide();
        submitSearchParams();
    }


    const onAdvancedSearchCancel = () => {
        onAdvancedSearchHide();
    }


    const onSelectAdvancedSearchFilter = useCallback((numOfSelectedFilters, selectedFilter, isSelectedYearFrom, isSelectedYearTo) => {
        setNumOfSelectedAdvancedSearchFilters(numOfSelectedFilters);
        setSelectedAdvancedSearchFilters(selectedFilter);
        setIsSelectedAdvSearchYearFrom(isSelectedYearFrom);
        setIsSelectedAdvSearchYearTo(isSelectedYearTo);
    }, [])


    const submitSearchParams = () => {
        // delete previous state of search params
        searchParams.delete("q");
        searchParams.delete("page");
        for (const filterName in selectedAdvancedSearchFilters) {
            searchParams.delete(filterName);
        }

        searchParams.append("q", searchTerm);
		searchParams.append("page", 1);

        if (selectedAdvancedSearchFilters) {
            if (isSelectedAdvSearchYearFrom) {
                searchParams.append("from", selectedAdvancedSearchFilters['from'] + '-01-01');
            }

            if (isSelectedAdvSearchYearTo) {
                searchParams.append("to", selectedAdvancedSearchFilters['to'] + '-31-12');
            }
            
            if (selectedAdvancedSearchFilters['regions'].length) {
                searchParams.append("regions", '[' + selectedAdvancedSearchFilters['regions'].join(',') + ']');
            }

            if (selectedAdvancedSearchFilters['keywords'].length) {
                searchParams.append("keywords", '[' + selectedAdvancedSearchFilters['keywords'].join(',') + ']');
            }
            
        }

        setShowingResults(true);
        setSearchParams(searchParams);
        navigate(`results?${searchParams.toString()}`);
    }
    

    const onSubmit = (event) => {
        event.preventDefault();

        onAdvancedSearchHide();
        submitSearchParams();
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
            
            <Collapse timeout={1200} in={advancedSearchOpen}>
                <AdvancedSearch selectedAdvancedSearchFilters={selectedAdvancedSearchFilters} onSelectAdvancedSearchFilter={onSelectAdvancedSearchFilter} parentOnHide={onAdvancedSearchHide} parentOnApply={onAdvancedSearchApply} parentOnCancel={onAdvancedSearchCancel} />
            </Collapse>
            
            {(!advancedSearchOpen) && 
                <Stack 
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                    direction={"row"}
                    spacing={1}
                    >
                    {numOfSelectedAdvancedSearchFilters ? 
                        <ButtonBase onClick={() => setAdvancedSearchOpen(true)}>
                            <Stack
                                direction={"row"}
                                spacing={0.3}
                            >
                                <Box sx={{ textAlign: 'center', borderRadius: "50%", width: "0.9rem", height: "0.9rem", backgroundColor: 'primary.main' }}>
                                    <Typography fontSize={11}  color="white">{numOfSelectedAdvancedSearchFilters}</Typography>
                                </Box>
                                {numOfSelectedAdvancedSearchFilters === 1 ? 
                                    <Typography color="primary" fontSize={11}>applied filter</Typography>
                                    : 
                                    <Typography color="primary" fontSize={11}>applied filters</Typography>
                                }
                            </Stack> 
                        </ButtonBase>
                        : 
                        <></>
                    }
                    <Button 
                        color="secondary" 
                        variant="text" 
                        size="small" 
                        style={{textDecoration: "underline"}}
                        onClick={() => setAdvancedSearchOpen(true)}
                        >
                        Advanced search
                    </Button>
                </Stack>
            }

            <Outlet />
        </div>
    )
}