import { act, render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { apiCall } from "../Utils/APIConnector";
import SearchResults from "./SearchResults";

jest.mock("../Utils/APIConnector");

it("should display results without pagination", async () => {
  // (apiCall as jest.Mock).mockResolvedValue( use when file will have .tsx extension
  apiCall.mockResolvedValue(
    new Promise((resolve) => {
      process.nextTick(() => resolve({
        ok: true,
        data: {
          results: [
            {
              published: "Tue, 04 Dec 2018 08:00:00 GMT",
              link: "https://www.express.co.uk/news/world/1053486/Donald-Trump-news-assassination-flip-limo-forklift-kill-president-north-dakota-attempt",
              title: "Test title",
              keywords: ["Murder", "Assault"],
              _id: "6242cbd6b20c19b08e00a57c",
              language: "en",
              preview: "Test Preview",
              region: "gb",
            }
          ],
          total_pages: 1,
          total_results: 1
        }
      }));
    })
  );

  await act(async () => render(
    // eslint-disable-next-line dot-notation
    <BrowserRouter basename={process.env["PUBLIC_URL"]}>
      <SearchResults />
    </BrowserRouter>
  ));

  // TODO: add asserts, to properly test rendering
});
