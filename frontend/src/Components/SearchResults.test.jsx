import { act, render, screen } from "@testing-library/react";
import React from "react";
import {
  BrowserRouter, Routes, Route, Navigate
} from "react-router-dom";
import { apiCall } from "../Utils/APIConnector";
import SearchResults from "./SearchResults";

jest.mock("../Utils/APIConnector");

const articleMock = {
  published: "Tue, 04 Dec 2018 08:00:00 GMT",
  link: "https://www.express.co.uk/news/world/1053486/Donald-Trump-news-assassination-flip-limo-forklift-kill-president-north-dakota-attempt",
  title: "Test title",
  keywords: ["Murder", "Assault"],
  _id: "6242cbd6b20c19b08e00a57c",
  language: "en",
  preview: "Test Preview",
  region: "gb",
};

describe("<SearchResults />", () => {
  it("should display results without pagination", async () => {
    const totalResults = 2;
    const totalPages = 1;

    const mockedData = {
      results: [],
      total_pages: totalPages,
      total_results: totalResults
    };

    for (let i = 0; i < totalResults; i += 1) {
      mockedData.results.push({
        ...articleMock,
        title: `Test title ${i}`, // article's title figures as key in ResultItem component (required unique)
      });
    }

    // (apiCall as jest.Mock).mockResolvedValue( use when file will have .tsx extension
    apiCall.mockResolvedValue(
      new Promise((resolve) => {
        process.nextTick(() => resolve({
          ok: true,
          data: mockedData
        }));
      })
    );

    // await is actually required
    await act(async () => render(
      // eslint-disable-next-line dot-notation
      <BrowserRouter basename={process.env["PUBLIC_URL"]}>
        <SearchResults />
      </BrowserRouter>
    ));

    expect(screen.getByText(`${totalResults} results found.`)).toBeInTheDocument();

    const articlesTitles = screen.getAllByText(/Test title/);
    for (let i = 0; i < articlesTitles.length; i += 1) {
      expect(articlesTitles[i]).toBeInTheDocument();
    }
    expect(articlesTitles.length).toBe(totalResults);
  });

  it("should display results with pagination", async () => {
    const totalResults = 12;
    const totalPages = 2;
    const maxResultsForPage = 10;
    const activePageIndex = 1;

    const mockedData = {
      results: [],
      total_pages: totalPages,
      total_results: totalResults
    };

    for (let i = 0; i < maxResultsForPage; i += 1) {
      mockedData.results.push({
        ...articleMock,
        title: `Test title ${i}`, // article's title figures as key in ResultItem component (required unique)
      });
    }

    apiCall.mockResolvedValue(
      new Promise((resolve) => {
        process.nextTick(() => resolve({
          ok: true,
          data: mockedData
        }));
      })
    );

    // await is actually required
    await act(async () => render(
      // in this case it was easier to use Routes
      // instead of mocking useSeachrParams to get the value of page query parameter,
      // which is required in MUI Paginaton rendering
      // eslint-disable-next-line dot-notation
      <BrowserRouter basename={process.env["PUBLIC_URL"]}>
        <Routes>
          <Route path="" element={<Navigate to="/search/results?q=test&page=1" />} />
          <Route path="/search/results?q=test&page=1" element={<SearchResults />} />
        </Routes>
        <SearchResults />
      </BrowserRouter>
    ));

    expect(screen.getByText(`${totalResults} results found.`)).toBeInTheDocument();

    const articlesTitles = screen.getAllByText(/Test title/);
    for (let i = 0; i < articlesTitles.length; i += 1) {
      expect(articlesTitles[i]).toBeInTheDocument();
    }
    expect(articlesTitles.length).toBe(maxResultsForPage);

    const paginationContainer = screen.getByRole("navigation", { name: "pagination navigation" });
    expect(paginationContainer).toBeInTheDocument();

    const paginationButtons = screen.getAllByRole("button", { name: /page/i });
    const prevPageButton = paginationButtons[0];
    expect(prevPageButton).toBeInTheDocument();
    expect(prevPageButton).toHaveAttribute("aria-label", "Go to previous page");

    const nextPageButton = paginationButtons[paginationButtons.length - 1];
    expect(nextPageButton).toBeInTheDocument();
    expect(nextPageButton).toHaveAttribute("aria-label", "Go to next page");

    const length = paginationButtons.length - 1; // ommit next page button
    for (let i = 1; i < length; i += 1) {
      const currPaginationButton = paginationButtons[i];
      expect(currPaginationButton).toBeInTheDocument();
      // index of active page has to be equal to page query parameter in Route
      if (i === activePageIndex) {
        expect(currPaginationButton).toHaveAttribute("aria-label", `page ${i}`);
      } else {
        expect(currPaginationButton).toHaveAttribute("aria-label", `Go to page ${i}`);
      }
    }
  });
});
