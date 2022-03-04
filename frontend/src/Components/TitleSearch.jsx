import {Button, TextField, Typography} from "@material-ui/core";
import {MdSearch} from "react-icons/md";
import {useEffect, useState} from "react";
import {useWindowSize} from "../Utils/Screen";
import {apiCall} from "../Utils/APIConnector";
import SearchResults from "./SearchResults";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";



export default function TitleSearch() {
    const navigate = useNavigate()
    
    const [searchTerm, setSearchTerm] = useState("")
    const [result, setResult] = useState({})
    const [resultsToShow, setResultsToShow] = useState({})
    const [showingResults, setShowingResults] = useState(false)

    const {width} = useWindowSize()
    const shouldCollapse = width < 992

    let searchDivStyle = {
        margin: "auto", 
        padding: shouldCollapse ? "200px 7%" : "200px 20%"
    };

    if (showingResults) {
        searchDivStyle.padding = shouldCollapse ? "20px 7%" : "20px 20%";
    }

    function handleSearchChange(value) {
        setSearchTerm(value.toLowerCase());
    }

    useEffect(() => {
        setResultsToShow(result);
    }, [result]);

    function onSubmit(event) {
        event.preventDefault()
        setShowingResults(true)
        navigate(`results?q=${searchTerm}`)
    }

    return (
        <div style={searchDivStyle}>
            <form onSubmit={onSubmit}>
                <Typography variant={"h1"} color={"primary"}>ams</Typography>
                <TextField
                    id="outlined-search"
                    color={"secondary"}
                    label={<><MdSearch/> Search</>}
                    type="search"
                    variant="outlined"
                    onChange={event => handleSearchChange(event.target.value)}
                    fullWidth 
                />
                <div style={{paddingTop: "20px"}}>
                    <Button variant={"contained"} color={"primary"} type="submit">Submit</Button>
                </div>
            </form>

            <Outlet/>
        </div>
    )
}