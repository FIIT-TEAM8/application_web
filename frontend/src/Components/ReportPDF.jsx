// @ts-nocheck
import {
    Typography,
    Grid,
    Stack,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";
import { useWindowSize } from "../Utils/Screen";
import { useUser } from "../Utils/UserContext";
import { useEffect, useState } from "react";
import { apiCall } from "../Utils/APIConnector";
import { jsPDF } from "jspdf";
import ReportItem from "./ReportItem";
import SuccessSnackbar from "./SuccessSnackbar";
import MainHeading from "./MainHeading";

export default function ReportPDF() {
    const { width } = useWindowSize();
    const shouldCollapse = width < 992;
    const { articlesInReport, removeArcticleReport } = useUser();
    const [articlesFromReport, setArticlesFromReport] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [successMsgOpen, setSuccessMsgOpen] = useState(false);
    const [isReportGenerating, setIsReportGenerating] = useState(false);

    let searchDivStyle = {
        margin: "auto",
        padding: shouldCollapse ? "20px 7%" : "20px 20%",
    };

    useEffect(() => {
        const articlesIds = articlesInReport.map((article) => article.id);
        if (articlesIds.length <= 0) {
            return;
        }
        apiCall(`/api/data/report?ids=[${articlesIds.join(", ")}]`, "GET").then((result) => {
            if (result.ok && result.data && result.data.results) {
                setArticlesFromReport([...result.data.results]);
                setIsLoaded(true);
            } else {
                console.log("Unable to get articles which are in pdf report.");
            }
        });
    }, [articlesInReport]);

    const handleRemoveArticle = (index, articleId) => {
        let currArticlesFromReport = [...articlesFromReport];
        currArticlesFromReport.splice(index, 1);
        removeArcticleReport(articleId);
        setArticlesFromReport(currArticlesFromReport);
        setSuccessMsgOpen(true);
    };

    const handleSnackbarClose = () => {
        setSuccessMsgOpen(false);
    };

    const downloadPDF = async () => {
        // display loading circle
        setIsReportGenerating(true);

        // parse string to html
        const parser = new DOMParser();
        const doc = new jsPDF("p", "pt", "a4");
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        const x = 25; // horizontal starting point in pdf page
        const lineLength = pageWidth - x * 2;
        let lineHeight, lines, y; // y is vertical starting point in pdf page

        for (let i = 0; i < articlesFromReport.length; i++) {
            const articleFromReport = articlesFromReport[i];
            const searchTermLower = articlesInReport[i].searchTerm.toLowerCase();
            // parse article html string to html doc
            const htmlDoc = parser.parseFromString(articleFromReport.html, "text/html");
            y = 30; // vertical starting point in pdf page

            // add title
            doc.setFontSize(16);
            lineHeight = doc.getLineHeight();
            lines = doc.splitTextToSize(articleFromReport.title, lineLength);

            for (let j = 0; j < lines.length; j++) {
                doc.text(lines[j], x, y);
                y += lineHeight;
            }

            // add some space
            y += 4;

            // add keywords
            doc.setFontSize(13);
            lineHeight = doc.getLineHeight();
            let keywordsText = `Keywords: ${articleFromReport.keywords.join(", ")}`;
            lines = doc.splitTextToSize(keywordsText, lineLength);

            for (let j = 0; j < lines.length; j++) {
                doc.text(lines[j], x, y);
                y += lineHeight;
            }

            // add some space
            y += 2;

            doc.setFontSize(12);
            lineHeight = doc.getLineHeight();
            let termText = `Found by term: ${articlesInReport[i].searchTerm}`; // articlesInReport !!!
            lines = doc.splitTextToSize(termText, lineLength);

            for (let j = 0; j < lines.length; j++) {
                doc.text(lines[j], x, y);
                y += lineHeight;
            }

            doc.setFontSize(11);
            doc.setTextColor(30, 144, 255); // rgb for dodger blue
            lineHeight = doc.getLineHeight();
            const link = articleFromReport.link;
            doc.textWithLink(`${new URL(link).hostname.replace("www.", "")}`, x, y, {
                url: `${link}`,
            });
            y += lineHeight;

            // add some space
            y += 5;

            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0); // rgb for dodger blue
            lineHeight = doc.getLineHeight();
            lines = doc.splitTextToSize(htmlDoc.body.innerText, lineLength);

            for (let j = 0; j < lines.length; j++) {
                if (y + lineHeight >= pageHeight) {
                    doc.addPage();
                    y = 30; // reset starting point for new page
                }

                if (lines[j].toLowerCase().includes(searchTermLower)) {
                    doc.setDrawColor(0);
                    doc.setFillColor(255, 255, 0); // rgb for yellow
                    doc.rect(x, y - lineHeight + 1, lineLength, lineHeight, "F"); //Fill and Border
                }

                doc.text(lines[j], x, y);
                y = y + lineHeight + 1;
            }

            if (i + 1 < articlesFromReport.length) {
                doc.addPage();
            }
        }

        // display loading circle
        setIsReportGenerating(false);

        doc.save("report.pdf");
    };

    return (
        <>
            <SuccessSnackbar
                text={"Article was successfully removed from PDF report!"}
                open={successMsgOpen}
                handleClose={handleSnackbarClose}
            />
            <Dialog open={isReportGenerating}>
                <DialogTitle>We are generating your report...</DialogTitle>
                <DialogContent align="center">
                    <CircularProgress size={50} thickness={2} color="primary" />
                </DialogContent>
            </Dialog>
            {/* Main content of the page starts here */}
            <Grid
                container
                style={searchDivStyle}
                justifyContent="space-between"
                alignItems="center">
                <Grid item xs={12} md={8}>
                    <MainHeading text={"pdf report"}/>
                </Grid>
                {articlesInReport.length > 0 ? (
                    isLoaded ? (
                        <>
                            <Grid item xs={12} md={4} lg={2} textAlign="end">
                                <Button
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                    onClick={downloadPDF}>
                                    Download
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={6} sx={{ pt: 4 }}>
                                    {articlesFromReport.map((article, index) => (
                                        <ReportItem
                                            article={article}
                                            index={index}
                                            handleRemoveArticle={handleRemoveArticle}
                                            articlesInReport={articlesInReport}
                                        />
                                    ))}
                                </Stack>
                            </Grid>
                        </>
                    ) : (
                        <Grid item xs={12} textAlign="center">
                            <CircularProgress size={50} thickness={2} color="secondary" />
                        </Grid>
                    )
                ) : (
                    <Grid item xs={12} textAlign="center">
                        <Typography>PDF report is empty.</Typography>
                    </Grid>
                )}
            </Grid>
        </>
    );
}
