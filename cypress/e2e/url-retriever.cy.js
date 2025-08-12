/// <reference types="cypress" />

import songNames from "../../liked-spotify.json";

describe("URL Retriever", () => {
  const allUrls = [];

  songNames.forEach((sName) => {
    it(`Downloading: ${sName}`, () => {
      cy.visit("https://www.youtube.com");
      cy.get(".yt-searchbox-input").type(sName);
      cy.get(".ytSearchboxComponentSearchButton").click();

      cy.get("iframe")
        .first()
        .then(($iframe) => {
          cy.wrap($iframe)
            .get('a[id="video-title"]')
            .first()
            .invoke("attr", "href")
            .then((videoUrl) => {
              const params = new URLSearchParams(videoUrl.split("?")[1]);
              const videoId = params.get("v");
              const fullUrl = `https://www.youtube.com/watch?v=${videoId}`;
              allUrls.push(fullUrl);
            });
        });
    });
  });

  it('Saving all URLs to "liked-yt-urls.txt"', () => {
    cy.writeFile("liked-yt-urls.txt", allUrls.join("\n"), "utf8");
  });
});
