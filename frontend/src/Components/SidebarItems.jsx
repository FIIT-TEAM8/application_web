import React from "react";
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { Link } from "react-router-dom";

export function SidebarItems({ open }) {
    return (
        <List>
            <SidebarItem open={open} text="Home" icon={<HomeIcon />} href="/search" />
            <SidebarItem open={open} text="Archive" icon={<HistoryEduIcon />} href="/archive" />
        </List>
    );
}

function SidebarItem({ open, text, icon, href = "/" }) {
    return (
        <Link to={href} style={{ textDecoration: "none" }}>
            <ListItemButton
                color="primary"
                sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                }}>
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                    }}>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
        </Link>
    );
}