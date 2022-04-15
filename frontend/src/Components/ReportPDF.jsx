// @ts-nocheck
import { Typography, Grid, Stack, CircularProgress, Button, Dialog, DialogTitle, DialogActions } from "@mui/material";
import { useWindowSize } from "../Utils/Screen";
import { useUser } from "../Utils/UserContext";
import { useEffect, useState } from "react";
import { apiCall } from "../Utils/APIConnector";
import { jsPDF } from "jspdf";
import ReportItem from "./ReportItem";
import SuccessSnackbar from "./SuccessSnackbar";

export default function ReportPDF() {
    const { width } = useWindowSize();
    const shouldCollapse = width < 992;
    const { articlesInReport, removeArcticleReport } = useUser();
    const [articlesFromReport, setArticlesFromReport] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [successMsgOpen, setSuccessMsgOpen] = useState(false);
    
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
        let currArticlesFromReport = [...articlesFromReport];
        currArticlesFromReport.splice(index, 1);
        removeArcticleReport(articleId);
        setArticlesFromReport(currArticlesFromReport);
        setSuccessMsgOpen(true);
    };

    const handleSnackbarClose = () => {
        setSuccessMsgOpen(false);
    }

    // TODO: tell user, that pdf is generating
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
        <>
            <SuccessSnackbar 
                text={"Article was successfully removed from PDF report!"}
                open={successMsgOpen}
                handleClose={handleSnackbarClose}
            />
            <Grid container style={searchDivStyle} justifyContent="space-between" alignItems="center">
                <Grid item xs={8}>
                    <Typography variant="h1" color="primary">
                        pdf report
                    </Typography>
                </Grid>
                {articlesInReport.length > 0 ?
                    (isLoaded ?
                        (<>
                            <Grid item xs={4} textAlign="end">
                                <Button 
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                    onClick={downloadPDF}
                                >
                                    Download
                                </Button> 
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={6} sx={{ pt: 4}}>
                                    {articlesFromReport.map((article, index) => 
                                        <ReportItem 
                                            article={article}
                                            index={index}
                                            handleRemoveArticle={handleRemoveArticle}
                                            articlesInReport={articlesInReport}
                                        />
                                    )}
                                </Stack>
                            </Grid>
                        </>)
                    :
                    (<Grid item xs={12} textAlign="center">
                        <CircularProgress size={50} thickness={2} color="secondary" />
                    </Grid>))
                :
                (<Grid item xs={12} textAlign="center">
                    <Typography>PDF report is empty.</Typography>
                </Grid>)}
            </Grid>
        </>
    );
}
