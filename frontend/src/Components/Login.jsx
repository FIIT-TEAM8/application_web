import { Dialog, DialogContent, Button, Typography, TextField, Stack, IconButton, InputAdornment } from "@mui/material";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { initialLoginValues, loginValidationSchema } from "../Utils/AccountSchemas";
import { useUser } from "../Utils/UserContext";


export default function Login({isOpen, onClose}) {

    const [displayedPassword, setDisplayedPassword] = useState(false);  // diplayed password means showing the plain text of entered string
    const [passwordType, setPasswordType] = useState("password");  // set to hide the plain text of entered password
    const [isOpenDialog, setIsOpenDialog] = useState(false);  // handling visibility of the login dialog
    const [incorrectCredentials, setIncorrectCredentials] = useState(false);  // show/hide incorrect credentials error message
    const {login} = useUser();
    
    const formikLogin = useFormik({
        initialValues: initialLoginValues,
        validationSchema: loginValidationSchema,

        // method to handle login form submit
        onSubmit: (loginData) => {
            // give values to UserProvider, if the values are correct,
            // call the parent method to close login dialog
            if (login(loginData)){
                onClose();
            }
            // show the error message
            else{
                setIncorrectCredentials(true);
            }
        },
    });


    // method to handle click on the visibility icon
    const onVisibilityClick = () => {
        // if the password is displayed, hiding it by updating states
        if (displayedPassword){
            setDisplayedPassword(false);
            setPasswordType("password");
        }
        // the opposite case
        else{
            setDisplayedPassword(true);
            setPasswordType("text");
        }
    };


    // parent component is handling the open and close state
    useEffect(() => {
        setIsOpenDialog(isOpen);
    }, [isOpen]);


    // if the content of textfield changes, error message is hidden and formik handles validation
    const onFieldChange = (e) => {
        setIncorrectCredentials(false);
        formikLogin.handleChange(e);
    };


    return (
        <Dialog
            open={isOpenDialog} 
            onClose={onClose}
            >
            <DialogContent sx={{ m: "auto",  width: 250 }}>
                <form onSubmit={formikLogin.handleSubmit}>
                    <Stack sx={{ mb: 1}} spacing={1}>
                        <Typography color="primary">ams</Typography>
                        <Typography variant="h2">Log in</Typography>
                    </Stack>
                    <Stack spacing={3} sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            id="username"
                            name="username"
                            label="Username"
                            value={formikLogin.values.username}
                            onChange={onFieldChange}
                            error={formikLogin.touched.username && Boolean(formikLogin.errors.username)}
                            helperText={formikLogin.touched.username && formikLogin.errors.username}
                            margin="dense"
                            variant="standard"
                            color="secondary"
                            />
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type={passwordType}
                            value={formikLogin.values.password}
                            onChange={onFieldChange}
                            error={formikLogin.touched.password && Boolean(formikLogin.errors.password)}
                            helperText={formikLogin.touched.password && formikLogin.errors.password}
                            margin="dense"
                            variant="standard"
                            color="secondary"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">{
                                        <IconButton sx={{ mb: 2 }} onClick={onVisibilityClick}>
                                            {displayedPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined fontSize="inherit" />}
                                        </IconButton>}
                                    </InputAdornment>
                                ) 
                            }}
                            />
                            
                        {incorrectCredentials && (
                            <Typography color="error">The username or password is incorrect.</Typography>
                        )}

                        <Stack spacing={2}>
                            <Button color="primary" variant="contained" fullWidth type="submit">Log in</Button>
                            <Typography variant="caption" align="center" color="secondary">OR</Typography>
                            <Button color="primary" variant="outlined" fullWidth type="submit">Sign up</Button>
                        </Stack>
                    </Stack>
                </form>
            </DialogContent>
        </Dialog>    
    )
}