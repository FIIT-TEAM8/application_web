import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SearchResults from "./SearchResults";
import TitleSearch from "./TitleSearch";
import Login from "./Login";
import Archive from "./Archive";

export default function MainRouter() {
    return (
        <Routes>
            <Route path="" element={<Navigate to="search" />} />
            <Route path="search" element={<TitleSearch />}>
                <Route path="results" element={<SearchResults />} />
            </Route>
            <Route path="archive" element={<Archive />} />
            {/* TODO: ADD PROPER ON CLOSE */}
            <Route path="login" element={<Login isOpen={true}/>} />
        </Routes>
    );
}
