import { Stack, Button, Typography } from "@mui/material";
import { useState } from "react";
import Login from "../Components/Login";
import { useUser } from "../Utils/UserContext";


export default function MainBar() {

    const [isOpenLogin, setIsOpenLogin] = useState(false);
    const { user, logout } = useUser();


    const onLoginOpen = () => {
        setIsOpenLogin(true);
    };


    const onLoginClose = () => {
        setIsOpenLogin(false);
    };


    const onLogout = () => {
        logout();
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
                <Typography>
                    {user.name ? user.name : ""}
                </Typography>
                {user.name ? <Button color="primary" variant="outlined" onClick={onLogout}>Log out</Button> : <Button color="primary" variant="outlined" onClick={onLoginOpen}>Log in</Button>}
            </Stack>

            <Login isOpen={isOpenLogin} onClose={onLoginClose} />
        </div>
    );
}