import { Button, TextField, Typography } from "@material-ui/core";
import { MdSearch } from "react-icons/md";
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
                <Typography variant={"h1"} color={"primary"}>ams</Typography>
                <TextField
                    id="outlined-search"
                    color={"secondary"}
                    value={searchTerm}
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