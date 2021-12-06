import {Button, TextField, Typography} from "@material-ui/core";
import {MdSearch} from "react-icons/md";
import {useEffect, useState} from "react";
import {useWindowSize} from "../Utils/Screen";
import {apiCall} from "../Utils/APIConnector";
import SearchResults from "../Components/SearchResults";

export default function TitleSearch() {

    const [searchTerm, setSearchTerm] = useState("")
    const [result, setResult] = useState({})
    const [resultsToShow, setResultsToShow] = useState({})
    const [showingResults, setShowingResults] = useState(false)

    const {width, height} = useWindowSize()
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

    function onSubmit() {
         apiCall(`/api/data/search/?q=${searchTerm}`, 'GET').then(result => {
            if (result.ok) {
                setResult(result.data);
                setShowingResults(true);
            }
        })
    }

    function onKeyPress(e) {
        if (e.keyCode === 13) {
            onSubmit()
        }

    }

    return (
        <div style={searchDivStyle}>
            <Typography variant={"h1"} color={"primary"}>ams</Typography>
            <TextField
                id="outlined-search"
                color={"secondary"}
                label={<><MdSearch/> Search</>}
                type="search"
                variant="outlined"
                onChange={event => handleSearchChange(event.target.value)}
                fullWidth 
                onKeyDown={onKeyPress}
            />
            <div style={{paddingTop: "20px"}}>
                <Button variant={"contained"} color={"primary"} onClick={onSubmit}>Submit</Button>
            </div>
            {showingResults ? <SearchResults data={resultsToShow}></SearchResults> : ""}
        </div>
        
    )
}