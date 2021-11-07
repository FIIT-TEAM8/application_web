import {TextField, Typography} from "@material-ui/core";
import {MdSearch} from "react-icons/md";
import {useState} from "react";
import {useWindowSize} from "../Utils/Screen";
import {theme} from "../Style/Theme";

export default function TitleSearch({}) {

    const [searchTerm, setSearchTerm] = useState("")

    const {width, height} = useWindowSize()
    const isMobile = width < 768

    const searchDivStyle = {
        margin: "auto",
        padding: isMobile ? "20px" : "200px 400px"
    }

    function handleSearchChange(value) {
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