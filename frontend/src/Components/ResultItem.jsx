import { Box, Divider, Typography, Link, Stack } from "@mui/material";


export default function ResultItem ({item, index}){

    return (
        <Stack spacing={1}>
            <Stack
                direction="row"
                divider={<Divider sx={{ borderRightWidth: 0.5 }} style={{ background: "#757575" }} orientation="vertical" flexItem />}
                spacing={2}>
                <Box sx={{ minWidth: 81 }}>
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
        )
}

