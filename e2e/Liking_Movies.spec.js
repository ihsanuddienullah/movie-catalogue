/* eslint-disable no-undef */
const assert = require("assert");

Feature("Liking Movies");

Before(({ I }) => {
  I.amOnPage("/#/like");
});

Scenario("showing empty liked movies", ({ I }) => {
  I.seeElement("#query");
  I.see("Tidak ada film untuk ditampilkan", ".movie-item__not__found");
});

Scenario("liking one movie", async ({ I }) => {
  I.see("Tidak ada film untuk ditampilkan", ".movie-item__not__found");

  I.amOnPage("/");

  I.waitForElement(".movie__title a", 3);
  I.seeElement(".movie__title a");

  const firstFilm = locate(".movie__title a").first();
  const firstFilmTitle = await I.grabTextFrom(firstFilm);
  I.click(firstFilm);

  I.waitForElement("#likeButton", 3);
  I.seeElement("#likeButton");
  I.click("#likeButton");

  I.amOnPage("/#/like");
  I.waitForElement(".movie-item", 3);
  I.seeElement(".movie-item");

  const likedFilmTitle = await I.grabTextFrom(".movie__title");
  assert.strictEqual(firstFilmTitle, likedFilmTitle);
});

Scenario("searching movies", async ({ I }) => {
  I.see("Tidak ada film untuk ditampilkan", ".movie-item__not__found");

  I.amOnPage("/");

  I.waitForElement(".movie__title a", 3);
  I.seeElement(".movie__title a");

  const titles = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= 3; i++) {
    I.click(locate(".movie__title a").at(i));
    I.waitForElement("#likeButton", 3);
    I.seeElement("#likeButton");
    I.click("#likeButton");
    I.waitForElement(".movie__title", 3);
    // eslint-disable-next-line no-await-in-loop
    titles.push(await I.grabTextFrom(".movie__title"));
    I.amOnPage("/");
  }

  I.amOnPage("/#/like");
  I.seeElement("#query");

  const searchQuery = titles[1].substring(1, 3);
  const matchingMovies = titles.filter(
    (title) => title.indexOf(searchQuery) !== -1
  );

  I.fillField("#query", searchQuery);
  I.pressKey("Enter");

  const visibleLikedMovies = await I.grabNumberOfVisibleElements(".movie-item");
  assert.strictEqual(matchingMovies.length, visibleLikedMovies);

  matchingMovies.forEach(async (title, index) => {
    const visibleTitle = await I.grabTextFrom(
      locate(".movie__title").at(index + 1)
    );
    assert.strictEqual(title, visibleTitle);
  });
});
