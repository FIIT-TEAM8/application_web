import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SearchResults from "./SearchResults";
import TitleSearch from "./TitleSearch";
import Login from "./Login";

export default function MainRouter() {
    return (
        <Routes>
            <Route path="" element={<Navigate to="search" />} />
            <Route path="search" element={<TitleSearch />}>
                <Route path="results" element={<SearchResults />} />
            </Route>
            <Route path="login" element={<Login open={true} />} />
            <Route path="example" element={<div>This is an example</div>} />
        </Routes>
    );
}
