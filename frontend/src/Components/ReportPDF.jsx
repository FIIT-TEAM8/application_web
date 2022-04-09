import { Typography, Grid, Stack, IconButton } from "@mui/material";
import { useWindowSize } from "../Utils/Screen";
import { useUser } from "../Utils/UserContext";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";

export default function ReportPDF() {
    const width = useWindowSize();
    const shouldCollapse = width < 992;
    const { articlesInReport, removeArcticleReport } = useUser();
    const [articlesFromReport, setArticlesFromReport] = useState(articlesInReport);
    
    let searchDivStyle = {
        margin: "auto", 
        padding: shouldCollapse ? "20px 7%" : "20px 20%"
    };

    const handleRemoveArticle = (index, articleId) => {
        let currArticlesFromReport = [...articlesFromReport]; // make a separate copy of the array
        currArticlesFromReport.splice(index, 1);
        setArticlesFromReport(currArticlesFromReport);
        removeArcticleReport(articleId);
    }

    return (
        <Grid container style={searchDivStyle}>
            <Grid item xs={12}>
                <Typography variant="h1" color="primary">pdf report</Typography>
            </Grid>
            <Grid item xs={12}>
                <Stack spacing={6} sx={{ pt: 4}}>
                    {articlesFromReport.map((article, index) => 
                    <Grid container key={index}>
                        <Grid item xs={11.5} md={11.6} lg={11.7}>
                            <Stack spacing={1}>
                                <Typography noWrap variant="h6" color="secondary">
                                    Found by term: <strong>{article.searchTerm}</strong>
                                </Typography>
                                {/* <Stack
                                    direction="row"
                                    divider={<Divider sx={{ borderRightWidth: 0.5 }} style={{ background: "#757575" }} orientation="vertical" flexItem />}
                                    spacing={2}
                                >
                                    <Box sx={{ width: 80 }}>
                                        <Typography noWrap color="secondary">
                                            {article.published.slice(5, -13)}
                                        </Typography>
                                    </Box>
                                    <Link href={article.link} target="_blank" rel="noopener" underline="none" noWrap>
                                        <Typography noWrap color="secondary">
                                            {article.link}
                                        </Typography>
                                    </Link>
                                </Stack> */}
                                {/* <Link href={article.link} target="_blank" rel="noopener" underline="hover"> */}
                                    <Typography noWrap variant="h2" color="primary">
                                        {article.title}
                                    </Typography>
                                {/* </Link> */}
                                {/* <Stack direction="row" color="secondary" spacing={2}>
                                    {article.keywords.map((crime, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                pl: 0.7,
                                                pr: 0.7,
                                                borderRadius: 1.5,
                                            }}
                                            bgcolor="#e6e7eb"
                                            >
                                            <Typography color="secondary">{crime}</Typography>
                                        </Box>
                                    ))}
                                </Stack> */}
                            </Stack>
                        </Grid>
                        <Grid item xs={0.5} md={0.4} lg={0.3} textAlign="end">
                            <IconButton fontSize="small" onClick={() => handleRemoveArticle(index, article.id)} sx={{ padding: 0.2 }}>
                                <DeleteIcon fontSize="medium"/>
                            </IconButton>
                        </Grid>
                    </Grid>
                )}
                </Stack>
            </Grid>
        </Grid>        
    );
}