import { act, render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
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
});
