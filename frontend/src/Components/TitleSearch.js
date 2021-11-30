import {Button, TextField, Typography} from "@material-ui/core";
import {MdSearch} from "react-icons/md";
import {useState} from "react";
import {useWindowSize} from "../Utils/Screen";
import {apiCall} from "../Utils/APIConnector";

export default function TitleSearch({}) {

    const [searchTerm, setSearchTerm] = useState("")
    const [result, setResult] = useState({results: []})
    const [showingResults, setShowingResults] = useState(false)

    const {width, height} = useWindowSize()
    const shouldCollapse = width < 992


    const searchDivStyle = {
        margin: "auto",
        padding: shouldCollapse ? "200px 7%" : "200px 20%"
    }

    function handleSearchChange(value) {
        console.log(value)
        setSearchTerm(value.toLowerCase());
    }

    function onSubmit() {
        apiCall(`/api/data/search/?q=${searchTerm}`, 'GET').then(result => {
            if (result.ok) {
                setResult(result)
                setShowingResults(true)
            }
        })
    }

    return (
        <div style={searchDivStyle}>
            <Typography variant={"h1"} color={"primary"}>ams</Typography>
            {/*<h1 style={{fontSize: "5rem", color: theme.palette.primary.main}}>ams</h1>*/}
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
                <Button variant={"contained"} color={"primary"} onClick={onSubmit}>Submit</Button>
            </div>

            <div style={{padding: "50px"}}>
                {JSON.stringify(result)}
            </div>
        </div>
    )
}