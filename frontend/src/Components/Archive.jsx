import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useWindowSize } from "../Utils/Screen";
import { Box, CircularProgress, LinearProgress, Typography } from "@mui/material";
import { TextField } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { IconButton } from "@mui/material";
import { Search } from "@mui/icons-material";
import { apiCall } from "../Utils/APIConnector";

export default function Archive() {
    const { width } = useWindowSize();
    const shouldCollapse = width < 992;

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");

    let searchDivStyle = {
        margin: "auto",
        padding: shouldCollapse ? "50px 7%" : "50px 20%",
    };

    useEffect(() => {
        setSearchTerm(searchParams.get("url"));
    }, []);

    const onSubmit = (event) => {
        event.preventDefault();
        // @ts-ignore
        document.activeElement.blur() //remove focus from the text field
        searchParams.delete("url");
        searchParams.append("url", searchTerm);
        setSearchParams(searchParams);
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    return (
        <div style={searchDivStyle}>
            <form onSubmit={onSubmit}>
                <Typography variant="h4" color="secondary">
                    .archive
                </Typography>
                <TextField
                    id="outlined-search"
                    color={"secondary"}
                    value={searchTerm}
                    // helperText={"Search for an archived URL"}
                    label={"Search URL"}
                    autoComplete="off"
                    variant="outlined"
                    onChange={(event) => handleSearchChange(event.target.value)}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {
                                    <IconButton color="primary" type="submit">
                                        <Search />
                                    </IconButton>
                                }
                            </InputAdornment>
                        ),
                    }}
                />
            </form>
            <ArchivedArticle url={searchParams.get("url")} id={searchParams.get("id")} />
        </div>
    );
}

export function ArchivedArticle({ id, url = "", displayArticle = undefined }) {
    const [article, setArticle] = useState("");
    const [isLoading, setIsloading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        if (displayArticle) {
            setArticle(displayArticle);
            return;
        }
        if (!url && !id) return;

        setLoadingProgress(0)
        setIsloading(true);
        
        apiCall(`/api/archive/search?url=${url}&id=${id}`).then((result) => {
            if (result.ok) {                
                setTimeout(() => setLoadingProgress(100), 100)
                setIsloading(false);
                setArticle(result.data);
            } else {
                setTimeout(() => setLoadingProgress(2), 500);
                setError(result.msg);
            }
        });
        
    }, [id, url, displayArticle]);

    if (error) {
        return (
            <Box sx={{ width: "100%" }}>
                <LinearProgress variant="determinate" value={loadingProgress} color="error" />
                <Typography paragraph color={"error"}>
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%" }}>
            <LinearProgress variant={isLoading ? "indeterminate" : "determinate"} value={loadingProgress} />
            <Typography paragraph color={"secondary"} style={{ padding: "20px 0" }}>
                {article}
            </Typography>
        </Box>
    );
}
