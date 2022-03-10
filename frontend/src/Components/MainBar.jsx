import { Button } from "@material-ui/core";
import { Stack } from "@mui/material";
import { useState } from "react";
import Login from '../Components/Login';


export default function MainBar() {

    const [isOpenLogin, setIsOpenLogin] = useState(false);


    const onSubmit = () => {
        setIsOpenLogin(true);
    };


    const onLoginClose = () => {
        setIsOpenLogin(false)
    };


    return (
        <div>
            <Stack 
                direction={"row"}
                alignItems={"flex-end"}
                justifyContent={"flex-end"}
                spacing={0.5}
                m={2} 
                >
                <Button color="primary" variant="outlined" onClick={onSubmit}>Log in</Button>
                <Button color="primary" variant="outlined">Test Button</Button>
            </Stack>

            <Login isOpen={isOpenLogin} onClose={onLoginClose} />
        </div>
    );
}