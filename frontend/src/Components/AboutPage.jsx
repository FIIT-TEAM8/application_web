import { Typography, Grid, Link, IconButton } from "@mui/material";
import { useWindowSize } from "../Utils/Screen";
import { useUser } from "../Utils/UserContext";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AboutPage() {
    const { width } = useWindowSize();
    const shouldCollapse = width < 992;
    const { articlesInReport, removeArcticleReport } = useUser();

    let searchDivStyle = {
        margin: "auto",
        padding: shouldCollapse ? "20px 7%" : "20px 20%",
    };

    const handleRemoveArticle = (articleId) => {
        removeArcticleReport(articleId);
    };

    return (
        <Grid container 
            style={searchDivStyle}
        >
            <Grid container 
                spacing={3} 
                direction={"row"}
            >
                <Grid item>
                    <Typography component="h1" fontSize={"4rem"} color="secondary">
                    about
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography component="h1" fontSize={"4rem"} color="primary">
                    ams
                    </Typography>
                </Grid>
            </Grid>
            <Grid container 
                spacing={2} 
                mt={0.5} 
                direction={"column"}
            >
                <Grid item>
                    <Grid container 
                        spacing={1}
                        direction={"column"}
                    >
                        <Grid item>
                            <Typography variant="h2" color="primary">
                            what is ams?
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography color="secondary" fontSize={"1rem"}>
                            ams stands for Adverse Media Screenig. A portal designed to search for natural and legal persons with an unfavourable reputation. The key impulse behind this project is to provide a solution for companies where the integrity of their potential employees or partners is a key to reliable and safe operation.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container 
                        spacing={1}
                        direction={"column"}
                    >
                        <Grid item>
                            <Typography variant="h2" color="primary">
                            source of information
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography color="secondary" fontSize={"1rem"}>
                            The source of information is available international online media.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container 
                        spacing={1}
                        direction={"column"}
                    >
                        <Grid item>
                            <Typography variant="h2" color="primary">
                            how to use
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Grid container
                                spacing={1}
                                direction={"column"}
                            >
                                <Grid item>
                                    <Typography color="secondary" fontSize={"1rem"}>
                                    The current state of the page represents only the prototype. Therefore, we do not require any account confirmation or personal information during registration. We work every day to improve ams so we can deliver the highest quality possible. Stay tuned to be the first to experience updated ams.
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h3" color="secondary">
                                    search
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography color="secondary" fontSize={"1rem"}>
                                    Simply enter the name in the search field to find the person you want.
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h3" color="secondary">
                                    keywords
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography color="secondary" fontSize={"1rem"}>
                                    We only show articles that potentially associate with suspicious activity or commited crimes. You can use advanced search to define which suspicious activities or commited crimes you want to search (keywords). Advanced search only provides keyword categories, whereas showed articles will contain specific keywords from one or more categories. 
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h3" color="secondary">
                                        regions
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography color="secondary" fontSize={"1rem"}>
                                    We cover whole Europe and are slowly growing further. You can specify the region in which the article was published in the advanced search.
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h3" color="secondary">
                                    archive
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography color="secondary" fontSize={"1rem"}>
                                    We provide view of articles from our archive based on the article URL. This feature is useful in case the article is deleted in the original source.
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h3" color="secondary">
                                    pdf report
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography color="secondary" fontSize={"1rem"}>
                                    We offer registered users the feature of storing important articles, this feature is called pdf report. User can generate a pdf report from stored articles. Simply add interesting article to pdf report with small button next to article title. You can combine articles from multiple searches. After the pdf report is done, click on download in the pdf report section and you're done!
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container 
                        spacing={1}
                        direction={"column"}
                    >
                        <Grid item>
                            <Typography variant="h2" color="primary">
                                advanced use
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography color="secondary" fontSize={"1rem"}>
                            We provide direct access to articles via API for demanding users. Visit the <Link href="https://app.swaggerhub.com/apis-docs/AMS89/AMS/1.0.0" target="_blank" rel="noopener">documentation page</Link> to take quick bearing.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container 
                        spacing={1}
                        direction={"column"}
                    >
                        <Grid item>
                            <Typography variant="h2" color="primary">
                                contact us
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography color="secondary" fontSize={"1rem"}>
                            If you have something on your mind or just want to talk, contact us on <Link href={`mailto:tim8.fiit.stuba@gmail.com`} target="_blank" rel="noopener">tim8.fiit.stuba@gmail.com</Link>.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};