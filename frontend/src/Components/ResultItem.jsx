import { Box, Divider, Typography, Link, Stack, Alert, AlertTitle } from "@mui/material";
import ButtonPDF from "./ButtonPDF";
import { useUser } from "../Utils/UserContext";

export default function ResultItem ({item, index}){
    const { user } = useUser();

    return (
        <Stack direction="row" justifyContent="space-between">
            {/* <Alert severity="success"> 
                    <AlertTitle>Success</AlertTitle>
                    Article was added to PDF report!
                </Alert> */}
            <Stack spacing={1}>
                <Stack
                    direction="row"
                    divider={<Divider sx={{ borderRightWidth: 0.5 }} style={{ background: "#757575" }} orientation="vertical" flexItem />}
                    spacing={2}
                >
                    <Box sx={{ width: 80 }}>
                        <Typography noWrap color="secondary">
                            {item.published.slice(5, -13)}
                        </Typography>
                    </Box>
                    <Link href={item.link} target="_blank" rel="noopener" underline="none" noWrap>
                        <Typography noWrap color="secondary">
                            {item.link}
                        </Typography>
                    </Link>
                </Stack>
                <Link href={item.link} target="_blank" rel="noopener" underline="hover">
                    <Typography noWrap variant="h2" color="primary">
                        {item.title}
                    </Typography>
                </Link>
                <Stack direction="row" color="secondary" spacing={2}>
                    {item.keywords.map((crime, index) => (
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
            {user.name ? <Stack> <ButtonPDF articleId={item._id} /> </Stack> : <></>}
        </Stack>
        )
}