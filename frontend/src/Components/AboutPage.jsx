import { Typography, Grid, Stack, IconButton } from "@mui/material";
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
                    <Typography variant="h1" color="secondary">
                        about
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h1" color="primary">
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
                            <Typography variant="h2" color="secondary">
                                what is ams?
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography color="secondary" fontSize={"1rem"}>
                                ams stands for Adverse Media Screenig. A portal designed to search for natural and legal persons with an unfavourable reputation. The key impulse behind this project is to provide a solution for companies where
    the integrity of their potential employees or partners is a key to reliable and safe operation.
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
                            <Typography variant="h2" color="secondary">
                                source of information
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography color="secondary" fontSize={"1rem"}>
                                The source of information is available online media.
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
                            <Typography variant="h2" color="secondary">
                                how to use
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography color="secondary" fontSize={"1rem"}>
                                Informacie su ziskavane na zakl klucovych slov. Kategorie sa nachadzaju vo filtri. Pokryvame znacnu cast europy a rozrastame sa aj mimo nej. Prihlaseni pouzivatelia mozu vyuzit PDF report featurku.
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
                            <Typography variant="h2" color="secondary">
                                advanced use
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography color="secondary" fontSize={"1rem"}>
                                mozete vyuzit aj nasu api, kt je zdokumentovana na: https://app.swaggerhub.com/apis-docs/AMS89/AMS/1.0.0
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
                            <Typography variant="h2" color="secondary">
                                contact us
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography color="secondary" fontSize={"1rem"}>
                                v pripade napadov na vylepsenie nas kontaktujte tim8.fiit.stuba@gmail.com
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};