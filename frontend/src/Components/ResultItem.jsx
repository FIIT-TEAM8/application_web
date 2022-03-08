import { Box, Divider, Typography, Link } from "@material-ui/core";
import { Stack } from "@mui/material";


export default function ResultItem ({item, index}){

    return (
        <Stack spacing={1}>
            <Stack
                direction='row'
                divider={<Divider style={{ background: "grey" }} orientation='vertical' flexItem />}
                spacing={2}>
                <Box sx={{ width: 80 }}>
                    <Typography noWrap style={{ color: "grey" }}>
                        {item.published.slice(5, -13)}
                    </Typography>
                </Box>
                <Link href={item.link} target='_blank' rel='noopener' underline='none' noWrap>
                    <Typography noWrap style={{ color: "grey" }}>
                        {item.link}
                    </Typography>
                </Link>
            </Stack>
            <Link href={item.link} target='_blank' rel='noopener'>
                <Typography noWrap variant='h2' color='primary'>
                    {item.title}
                </Typography>
            </Link>
            <Stack direction='row' style={{ color: "grey" }} spacing={2}>
                {item.keywords.map((crime) => (
                    <Box
                        sx={{
                            pl: 0.7,
                            pr: 0.7,
                            borderRadius: 3,
                        }}
                        style={{
                            background: "#e6e7eb",
                            color: "grey",
                        }}>
                        <Typography>{crime}</Typography>
                    </Box>
                ))}
            </Stack>
        </Stack>
        )
}

