import {createTheme} from "@material-ui/core";


export const theme = createTheme({
    palette: {
        divider: '#31b69c',
        primary: {
            light: '#6de9cd',
            main: '#31b69c',
            dark: '#00856e',
            contrastText: '#fff',
        },
        secondary: {
            light: "#fbac2e",
            main: "#f68529",
            dark: "#f68529",
            contrastText: '#fff',
        },
        link: {
            main: '#9d32a8'
        },
    },
    typography: {
        fontSize: 12,
        h2: {
            fontSize: "2rem",
        },
    }
});