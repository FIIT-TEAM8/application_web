import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useWindowSize } from "../Utils/Screen";
import { Box, CircularProgress, LinearProgress, Stack, Typography } from "@mui/material";
import { TextField } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { IconButton } from "@mui/material";
import { Search } from "@mui/icons-material";
import { apiCall } from "../Utils/APIConnector";
import { format } from "date-fns";
import DOMPurify from "dompurify";

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
        setSearchTerm(searchParams.get("link"));
    }, []);

    const onSubmit = (event) => {
        event.preventDefault();
        // @ts-ignore
        document.activeElement.blur(); //remove focus from the text field
        searchParams.delete("link");
        searchParams.append("link", searchTerm);
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
            <ArchivedArticle url={searchParams.get("link")} />
        </div>
    );
}

export function ArchivedArticle({ url = "", displayArticle = undefined }) {
    const [article, setArticle] = useState({
        title: "",
        html: "",
        keywords: [],
        published: "Mon, 04 Jan 2016 08:00:00 GMT",
        region: "",
        link: "",
    });
    const [isLoading, setIsloading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        if (displayArticle) {
            setArticle(displayArticle);
            return;
        }
        if (!url) return;

        setLoadingProgress(0);
        setIsloading(true);

        apiCall(`/api/archive/search?link=${url}`).then((result) => {
            if (result.ok) {
                setTimeout(() => setLoadingProgress(100), 100);
                setIsloading(false);
                setArticle(result.data);
                console.log(result.data);
            } else {
                setTimeout(() => setLoadingProgress(2), 500);
                setError(result.msg);
            }
        });
    }, [url, displayArticle]);

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
            <LinearProgress
                variant={isLoading ? "indeterminate" : "determinate"}
                value={loadingProgress}
            />
            <Typography variant={"caption"} color={"secondary"} style={{ padding: "20px 0" }}>
                Published {format(new Date(article.published), "yyyy/MM/dd")} in{" "}
                {article.region.toUpperCase()}
            </Typography>
            <Typography variant={"h3"} color={"primary"} style={{ padding: "20px 0" }}>
                <a href={article.link}>{article.title}</a>
            </Typography>

            <Stack direction="row" color="secondary" spacing={2}>
                {article.keywords.map((crime, index) => (
                    <Box
                        key={index}
                        sx={{
                            pl: 0.7,
                            pr: 0.7,
                            borderRadius: 1.5,
                        }}
                        bgcolor="#e6e7eb">
                        <Typography color="secondary">{crime}</Typography>
                    </Box>
                ))}
            </Stack>

            <Typography paragraph color={"secondary"} style={{ padding: "20px 0" }}>
                <SanitizedHTML html={article.html} options={{}} />
            </Typography>
        </Box>
    );
}

const defaultOptions = {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "h1", "h2", "h3", "h4", "h5", "h6", "p", "span"],
    ALLOWED_ATTR: ["href"],
};

const sanitize = (dirty, options) => ({
    __html: DOMPurify.sanitize(dirty, { ...defaultOptions, ...options }),
});

const SanitizedHTML = ({ html, options }) => (
    // @ts-ignore
    <div dangerouslySetInnerHTML={sanitize(html, options)} />
);
