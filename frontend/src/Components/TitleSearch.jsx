import {
  IconButton,
  TextField,
  InputAdornment
} from "@mui/material";
import { Search } from "@mui/icons-material";
import {
  Outlet, useNavigate, useSearchParams, Link
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import useWindowSize from "../Utils/Screen";
import AdvancedSearchHandler from "./AdvancedSearchHandler";
import AppliedAdvSearchInfo from "./AppliedAdvSearchInfo";

export default function TitleSearch() {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const shouldCollapse = width < 992;

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [showingResults, setShowingResults] = useState(false);

  // states for advanced search
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [numSelectedFilters, setNumSelectedFilters] = useState(0);

  const searchDivStyle = {
    margin: "auto",
    padding: shouldCollapse ? "100px 7%" : "100px 20%",
  };

  const logoStyle = {
    margin: "auto",
    marginBottom: "20px",
    display: "block",
    width: "30%",
    height: "auto"
  };

  if (showingResults) {
    searchDivStyle.padding = shouldCollapse ? "20px 7%" : "20px 20%";
  }

  useEffect(() => {
    const q = searchParams.get("q");

    if (q) {
      setShowingResults(true);
      setSearchTerm(q);
    }
  }, []);

  // check if we should change actual state to main page state
  // handling when click on logo
  useEffect(() => {
    const q = searchParams.get("q");
    if (!q) {
      setShowingResults(false);
      setSearchTerm("");
    }
  }, [searchParams]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const submitSearchParams = () => {
    searchParams.delete("q");
    searchParams.delete("page");

    searchParams.append("q", searchTerm);
    searchParams.append("page", 1);

    setShowingResults(true);
    setSearchParams(searchParams);
    setAdvancedSearchOpen(false);
    navigate(`results?${searchParams.toString()}`);
  };

  const updateNumSelectedFilters = (num) => {
    setNumSelectedFilters(num);
  };

  const onAdvancedSearchCancel = () => {
    // adv search handler should be notified
    // isCanceled - true
  };

  const onSubmit = (event) => {
    event.preventDefault();

    // onAdvancedSearchHide();
    // adv search handler should be notified
    // isApplied - true
    submitSearchParams();
  };

  return (
    <div style={searchDivStyle}>
      <form onSubmit={onSubmit}>
        <Link
          to="/search"
          onClick={onAdvancedSearchCancel}
          style={{ textDecoration: "none" }}
        >
          {/* <Typography variant="h1" color="primary">
            ams
          </Typography> */}
          <img style={logoStyle} src="./adversea_logo.svg" alt="adversea" />
        </Link>
        <TextField
          id="outlined-search"
          color="secondary"
          value={searchTerm}
          label="Search"
          autoComplete="off"
          variant="outlined"
          onChange={(event) => handleSearchChange(event.target.value)}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton color="primary" type="submit">
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>

      <AdvancedSearchHandler
        open={advancedSearchOpen}
        onFilterSelect={updateNumSelectedFilters}
        apply={submitSearchParams}
      />

      {!advancedSearchOpen && (
        <AppliedAdvSearchInfo
          numSelectedFilters={numSelectedFilters}
          onClick={() => setAdvancedSearchOpen(true)}
        />
      )}

      <Outlet isShowingResults={showingResults} />
    </div>
  );
}
