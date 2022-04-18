// @ts-nocheck
import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import { styled, useTheme } from "@mui/material/styles";
import MainBar from "./MainBar";
import {
    DesktopDrawer,
    AppBar,
    DrawerHeader,
    closedMixin,
    openedMixin,
    drawerWidth,
} from "../Style/NavStyledComponents";
import HomeLink from "./HomeLink";
import { useWindowSize } from "../Utils/Screen";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { Drawer, SwipeableDrawer } from "@mui/material";
import { SidebarItems } from "./SidebarItems";

// SOURCE (MUI DOCS):
// https://mui.com/components/drawers/#MiniDrawer.js

export function Topbar({ open, handleDrawerOpen, handleDrawerToggle }) {
    const { width, height } = useWindowSize();
    const isMobile = width && width < 768;

    return (
        <AppBar position="fixed" open={!isMobile && open} color="neutral">
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="toggle drawer"
                    onClick={handleDrawerToggle}
                    edge="start"
                    sx={{
                        marginRight: 5,
                        ...(!isMobile && open && { display: "none" }),
                    }}>
                    <MenuIcon />
                </IconButton>
                <div style={{ marginLeft: "auto" }}>
                    <MainBar />
                </div>
            </Toolbar>
        </AppBar>
    );
}

export function Sidebar({
    children,
    open,
    handleDrawerClose,
    handleDrawerOpen,
    handleDrawerToggle,
}) {
    const theme = useTheme();
    const { width, height } = useWindowSize();
    const isMobile = width && width < 768;

    let DrawerComponent = DesktopDrawer;
    let drawerVariant = "permanent";
    let onClickAway = () => {};
    if (isMobile) {
        DrawerComponent = SwipeableDrawer;
        drawerVariant = "temporary";
        onClickAway = handleDrawerClose;
    }

    return (
        <DrawerComponent
            variant={drawerVariant}
            open={open}
            onOpen={handleDrawerOpen}
            onClose={onClickAway}
            hysterisis={0.25}
            swipeAreaWidth={40}
            ModalProps={{
                keepMounted: true,
            }}>
            <DrawerHeader style={{ minWidth: `${drawerWidth}px` }}>
                <HomeLink variant="h4" />

                <IconButton onClick={handleDrawerClose} style={{ marginLeft: "auto" }}>
                    {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            {children}
        </DrawerComponent>
    );
}

export default function MainNavigation() {
    const theme = useTheme();
    const [isOpen, setIsOpen] = React.useState(false);
    const { width, height } = useWindowSize();
    const isMobile = width < 768;

    const handleDrawerOpen = () => {
        setIsOpen(true);
    };

    const handleDrawerClose = () => {
        setIsOpen(false);
    };

    const handleDrawerToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <Topbar
                open={isOpen}
                handleDrawerOpen={handleDrawerOpen}
                handleDrawerToggle={handleDrawerToggle}
            />
            <Sidebar
                open={isOpen}
                handleDrawerClose={handleDrawerClose}
                handleDrawerOpen={handleDrawerOpen}
                handleDrawerToggle={handleDrawerToggle}>
                <SidebarItems open={isOpen} />
            </Sidebar>
        </>
    );
}
