import {
    Typography,
    Grid,
    Stack,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    AlertColor,
} from '@mui/material';
import { useWindowSize } from '../Utils/Screen';
import { useUser } from '../Utils/UserContext';
import { useEffect, useState } from 'react';
import { apiCall } from '../Utils/APIConnector';
import ReportItem from './ReportItem';
import InfoSnackbar from './InfoSnackbar';
import MainHeading from './MainHeading';
import React from 'react';
import { APIResponse, Article, ArticleInReport } from 'Utils/Interfaces';

const ReportPage: React.FC = () => {
    const { width } = useWindowSize();
    const shouldCollapse: boolean = (width && width < 992) ? true : false;
    const { articlesInReport, removeArcticleReport } = useUser();
    const [articlesFromReport, setArticlesFromReport] = useState<Article[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isReportGenerating, setIsReportGenerating] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('info');

    let searchDivStyle: { margin:string, padding: string } = {
        margin: 'auto',
        padding: shouldCollapse ? '20px 7%' : '20px 20%',
    };

    useEffect(() => {
        const articlesIds:Array<string> = articlesInReport.map((article: ArticleInReport) => article.id);
        if (articlesIds.length <= 0) {
            return;
        }
        apiCall(`/api/data/report?ids=[${articlesIds.join(', ')}]`, 'GET').then((result: APIResponse) => {
            if (result.ok && result.data && result.data.results) {
                setArticlesFromReport([...result.data.results]);
                setIsLoaded(true);
            } else {
                openSnackbar('Unable to get articles in report.', 'error');
            }
        });
    }, [articlesInReport]);

    const handleRemoveArticle = (index: number, articleId: string) => {
        // NOTE: removeArticleReport shouldn't be optional in User interface, but currently it isn't working otherwise...
        if (removeArcticleReport) {
            let currArticlesFromReport = [...articlesFromReport];
            currArticlesFromReport.splice(index, 1);
            removeArcticleReport(articleId);
            setArticlesFromReport(currArticlesFromReport);
            openSnackbar('Article was successfully removed from report.', 'success');
        } else {
            openSnackbar('Unable to remove selected article from report.', 'error');
        }
    };

    const openSnackbar = (text: string, severity: AlertColor) => {
        setSnackbarText(text);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const downloadPDF = () => {
        if (articlesInReport.length === 0) {
            openSnackbar('Unable to generate PDF, because there are no articles in report.', 'error');
        } 

        // display loading circle
        setIsReportGenerating(true);

        const articlesIds:Array<string> = articlesInReport.map((article: ArticleInReport) => article.id);

        apiCall(`/api/pdf_report/download?ids=[${articlesIds.join(', ')}]`, 'GET')
        .then(async (result: APIResponse) => {
            if (result.ok) {
                // https://stackoverflow.com/questions/63942715/how-to-download-a-readablestream-on-the-browser-that-has-been-returned-from-fetc
                console.log(result.blobData);
                const blob: Blob = await result.blobData.blob();
                const newBlob = new Blob([blob]);

                const blobUrl = window.URL.createObjectURL(newBlob);

                const link = document.createElement('a');
                link.href = blobUrl;
                link.setAttribute('download', 'report.pdf');
                document.body.appendChild(link);
                link.click();

                if (link.parentNode) {
                    link.parentNode.removeChild(link);
                }
                
                // TODO: clean url and inform about succesfull download
                // clean up Url
                // window.URL.revokeObjectURL(blobUrl);
            } else {
                // TODO: inform user about unsuccessfull generation
                console.log('FAILED');
            }

            setIsReportGenerating(false);
        }).catch(err => {
            // TODO: inform user about unsuccessfull generation
            console.log(err);
            setIsReportGenerating(false);
        });
    };

    return (
        <>
            <InfoSnackbar
                text={snackbarText}
                open={snackbarOpen}
                severity={snackbarSeverity}
                handleClose={handleSnackbarClose}
            />
            <Dialog open={isReportGenerating} sx={{textAlign: 'center'}}>
                <DialogTitle>We are generating PDF from your report...</DialogTitle>
                <DialogContent>
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
                    <MainHeading text={'pdf report'}/>
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
};

export default ReportPage;