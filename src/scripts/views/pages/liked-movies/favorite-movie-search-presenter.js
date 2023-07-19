/* eslint-disable implicit-arrow-linebreak */
class FavoriteMovieSearchPresenter {
  constructor({ favoriteMovies, view }) {
    this._view = view;
    this._favoriteMovies = favoriteMovies;
    this._listenToSearchRequestByUser();
  }

  _listenToSearchRequestByUser() {
    this._view.runWhenUserIsSearching((latestQuery) => {
      this._searchMovies(latestQuery);
    });
  }

  async _searchMovies(latestQuery) {
    this._latestQuery = latestQuery.trim();

    let foundMovies;
    if (this.latestQuery.length > 0) {
      foundMovies = await this._favoriteMovies.searchMovies(this.latestQuery);
    } else {
      foundMovies = await this._favoriteMovies.getAllMovies();
    }

    this._showFoundMovies(foundMovies);
  }

  // eslint-disable-next-line class-methods-use-this
  _showFoundMovies(movies) {
    if (!movies) return;

    this._view.showFavoriteMovies(movies);
  }

  get latestQuery() {
    return this._latestQuery;
  }
}

export default FavoriteMovieSearchPresenter;
