import React from "react";
import { render, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useUser } from "../Utils/UserContext";
import ResultItem from "./ResultItem";

jest.mock("../Utils/UserContext");

afterEach(cleanup);

it("check component rendering for logged user", async () => {
  useUser.mockImplementation(() => ({
    username: "tester"
  }));

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

  render(
    // eslint-disable-next-line dot-notation
    <BrowserRouter basename={process.env["PUBLIC_URL"]}>
      <ResultItem item={mockedArticle} />
    </BrowserRouter>
  );
});
