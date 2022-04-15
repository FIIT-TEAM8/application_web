// @ts-nocheck
import { Typography, Grid, Stack, IconButton, CircularProgress, Link, Box, Divider, Button } from "@mui/material";
import { useWindowSize } from "../Utils/Screen";
import { useUser } from "../Utils/UserContext";
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from "react";
import { apiCall } from "../Utils/APIConnector";
import { jsPDF } from "jspdf";

export default function ReportPDF() {
    const { width } = useWindowSize();
    const shouldCollapse = width < 992;
    const { articlesInReport, removeArcticleReport } = useUser();
    const [articlesFromReport, setArticlesFromReport] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    
    let searchDivStyle = {
        margin: "auto",
        padding: shouldCollapse ? "20px 7%" : "20px 20%",
    };

    useEffect(() => {
        const articlesIds = articlesInReport.map(article => article.id);

        apiCall(`/api/data/report?ids=[${articlesIds.join(', ')}]`, "GET").then((result) => {
			if (result.ok && result.data && result.data.results) {
				setArticlesFromReport([...result.data.results]);
                setIsLoaded(true);
			} else {
                console.log('Unable to get articles which are in pdf report.');
            }
		});
    }, []);

    const handleRemoveArticle = (index, articleId) => {
        let currArticlesFromReport = [...articlesFromReport]; // make a separate copy of the array
        currArticlesFromReport.splice(index, 1);
        removeArcticleReport(articleId);
        setArticlesFromReport(currArticlesFromReport);
    };

    const downloadPDF = () => {
        const doc = new jsPDF('p', 'pt', 'a4'); // necessary settings

        // create one html from all articles in report
        const htmlTemplate = `
            <div>
                ${articlesFromReport.map((article, index) => {
                    return `<div style="font-size:10px; width:550px;">
                        <span>Article found by term: <strong>${articlesInReport[index].searchTerm}</strong></span>
                        ${article.html}
                    </div>`;
                })}
            </div>`;

        doc.html(htmlTemplate, {
            callback: function(doc) {
                doc.save("report.pdf");
            },
            x: 20,
            y: 20,
        });
    }

    return (
        <Grid container style={searchDivStyle}>
            <Grid item xs={12}>
                <Typography variant="h1" color="primary">
                    pdf report
                </Typography>
                <Button onClick={() => downloadPDF()}>Download as PDF</Button> 
            </Grid>
            {articlesInReport.length > 0 ?
                isLoaded ?
                    <Grid item xs={12}>
                        <Stack spacing={6} sx={{ pt: 4}}>
                            {articlesFromReport.map((article, index) => 
                            <Grid container key={index}>
                                <Grid item xs={11.5} md={11.6} lg={11.7}>
                                    <Stack spacing={1}>
                                        <Typography noWrap variant="h6" color="secondary">
                                            Found by term: <strong>{articlesInReport[index].searchTerm}</strong>
                                        </Typography>
                                        <Stack
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
                                                    {new URL(article.link).hostname.replace('www.','')}
                                                </Typography>
                                            </Link>
                                        </Stack>
                                            <Link href={article.link} target="_blank" rel="noopener" underline="hover">
                                            <Typography noWrap variant="h2" color="primary">
                                                {article.title}
                                            </Typography>
                                            </Link>
                                            <Stack direction="row" color="secondary" spacing={2}>
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
                                        </Stack>
                                    </Stack>
                                </Grid>
                                <Grid item xs={0.5} md={0.4} lg={0.3} textAlign="end">
                                    <IconButton fontSize="small" onClick={() => handleRemoveArticle(index, article._id)} sx={{ padding: 0.2 }}>
                                        <DeleteIcon fontSize="medium"/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                            )}
                        </Stack>
                    </Grid>
                :
                <Grid item xs={12} textAlign="center">
                    <CircularProgress size={50} thickness={2} color="secondary" />
                </Grid>
             : <Grid item xs={12} textAlign="center">
                 <Typography>PDF report is empty.</Typography>
                </Grid>}
        </Grid>
    );
}
