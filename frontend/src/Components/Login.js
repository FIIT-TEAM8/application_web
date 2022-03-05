import { Dialog, DialogActions, DialogContent, Button, Typography, TextField } from "@material-ui/core";
import { Stack, IconButton } from "@mui/material";
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useState, useEffect } from "react";
import { useFormik } from 'formik';

import { initialLoginValues, loginValidationSchema } from '../Utils/AccountSchemas';


export default function Login(props) {

    const [shownPassword, setShownPassword] = useState(false);
    const [passwordType, setPasswordType] = useState("password");
    const [openDialog, setOpenDialog] = useState(props.open);

    
    const formikLogin = useFormik({
        initialValues: initialLoginValues,
        validationSchema: loginValidationSchema,
        onSubmit: (values) => {
            // TODO apiCall
            setOpenDialog(false);
            console.log(values);
        },
    });

    const handleClickAway = () => {
        setOpenDialog(false);
    };

    const onVisibilityClick = () => {
        if (shownPassword){
            setShownPassword(false);
            setPasswordType("password");
        }
        else{
            setShownPassword(true);
            setPasswordType("text");
        }
    };

    useEffect(() => {
        shownPassword ? setPasswordType("text") : setPasswordType("password");
    }, [shownPassword]);

    return (
        <Dialog open={openDialog} onClose={handleClickAway}>
            <DialogContent sx={{ m: 'auto', width: 250 }}>
                <form onSubmit={formikLogin.handleSubmit}>
                    <Stack sx={{ mb: 1}} spacing={1}>
                        <Typography color="primary">ams</Typography>
                        <Typography variant="h2">Login</Typography>
                    </Stack>
                    <Stack spacing={3} sx={{ mb: 2 }}>
                        <TextField
                        fullWidth
                        id="username"
                        name="username"
                        label="Username"
                        value={formikLogin.values.username}
                        onChange={formikLogin.handleChange}
                        error={formikLogin.touched.username && Boolean(formikLogin.errors.username)}
                        helperText={formikLogin.touched.username && formikLogin.errors.username}
                        />
                        <Stack direction="row">
                            <TextField
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                type={passwordType}
                                value={formikLogin.values.password}
                                onChange={formikLogin.handleChange}
                                error={formikLogin.touched.password && Boolean(formikLogin.errors.password)}
                                helperText={formikLogin.touched.password && formikLogin.errors.password}
                            />
                            <IconButton size="small" sx={{ width: 35, height: 35, mt: 1.5}} onClick={onVisibilityClick}>
                                {shownPassword ? <VisibilityOffOutlinedIcon fontSize="inherit" /> : <VisibilityOutlinedIcon fontSize="inherit" />}
                            </IconButton>
                        </Stack>
                        <Stack spacing={2}>
                            <Button color="primary" variant="contained" fullWidth type="submit">Log in</Button>
                            <Typography align="center">or</Typography>
                            <Button color="primary" variant="outlined" fullWidth type="submit">Sign up</Button>
                        </Stack>
                    </Stack>
                </form>
            </DialogContent>
        </Dialog>    
    )
}