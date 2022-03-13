import { createTheme } from "@mui/material/styles";
import { teal, grey, brown } from "@mui/material/colors";


export const theme = createTheme({
    palette: {
        primary: {
            main: teal[500],
            light: teal[100],
            dark: teal[900],
            brown: brown[600],
        },
        secondary: {
            main: grey[600],
            light: grey[100],
            dark: grey[900],
        },
    },
    typography: {
        fontSize: 12,
        h2: {
            fontSize: "1.5rem",
        },
        h3: {
            fontSize: "1.2rem",
        },
    },
});