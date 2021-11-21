import {TextField, Typography} from "@material-ui/core";
import {MdSearch} from "react-icons/md";
import {useEffect, useState} from "react";
import {useWindowSize} from "../Utils/Screen";
import {theme} from "../Style/Theme";

export default function TitleSearch({}) {

    const [searchTerm, setSearchTerm] = useState("")

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
        </div>
    )
}