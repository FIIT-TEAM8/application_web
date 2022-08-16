import React from "react";
import {
  render, cleanup, screen
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useUser } from "../Utils/UserContext";
import ResultItem from "./ResultItem";

jest.mock("../Utils/UserContext");

afterEach(cleanup);

describe("<ResultItem />", () => {
  const mockedArticle = {
    published: "Tue, 04 Dec 2018 08:00:00 GMT",
    link: "https://www.express.co.uk/news/world/1053486/Donald-Trump-news-assassination-flip-limo-forklift-kill-president-north-dakota-attempt",
    title: "Test title",
    keywords: ["Murder", "Assault"],
    _id: "6242cbd6b20c19b08e00a57c",
    language: "en",
    preview: "Test Preview",
    region: "gb",
  };

  it("check component rendering for not logged user", async () => {
    useUser.mockImplementation(() => ({
      user: undefined
    }));

    render(
      // eslint-disable-next-line dot-notation
      <BrowserRouter basename={process.env["PUBLIC_URL"]}>
        <ResultItem item={mockedArticle} />
      </BrowserRouter>
    );

    const titleLink = screen.getByRole("link", { name: mockedArticle.title });
    expect(titleLink).toHaveAttribute("href", mockedArticle.link);
    const archiveLink = screen.getByRole("link", { name: "Archived Article" });
    expect(archiveLink).toHaveAttribute("href", `/archive?link=${mockedArticle.link}`);
    expect(screen.getByText("04 Dec 2018")).toBeInTheDocument();
    const sourceLink = screen.getByRole("link", { name: "express.co.uk" });
    expect(sourceLink).toHaveAttribute("href", mockedArticle.link);

    for (let i = 0; i < mockedArticle.keywords.length; i += 1) {
      expect(screen.getByText(mockedArticle.keywords[i])).toBeInTheDocument();
    }
  });

  it("check component rendering for logged user", () => {
    useUser.mockImplementation(() => ({
      user: "tester"
    }));

    // TODO: not working, mock articlesInReport???
    render(
      // eslint-disable-next-line dot-notation
      <BrowserRouter basename={process.env["PUBLIC_URL"]}>
        <ResultItem item={mockedArticle} />
      </BrowserRouter>
    );
  });
});
