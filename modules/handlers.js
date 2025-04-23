import {
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchPopularPeople,
  searchTMDB,
  fetchByGenre
} from './api.js';
import { renderMovies, renderPeople } from './dom.js';
import { showError, hideError } from './error.js';
import { sortResults } from './sort.js';
import { setResults, getCurrentType, getResults } from './state.js';
import {
  filterMoviesByGenre,
  filterPeopleByGenre,
  filterPeopleWithProfileNKnownFor,
  sortByPopularityDescending
} from './filters.js';

let sortSelect;
let allHeaderButtons = [];

function setActiveHeaderButton(btnToActivate) {
  allHeaderButtons.forEach(btn =>
    btn.classList.toggle('active', btn === btnToActivate)
  );
}

export function initHandlers(config) {
  sortSelect = config.sortSelect;

  allHeaderButtons = [
    config.btnPopular,
    config.btnTopRated,
    config.btnPopularPeople
  ];

  config.form.addEventListener('submit', e => handleSearchSubmit(e, config));

  config.btnPopular.addEventListener('click', () => {
    setActiveHeaderButton(config.btnPopular);
    handlePopularClick();
  });

  config.btnTopRated.addEventListener('click', () => {
    setActiveHeaderButton(config.btnTopRated);
    handleTopRatedClick();
  });

  config.btnPopularPeople.addEventListener('click', () => {
    setActiveHeaderButton(config.btnPopularPeople);
    handlePopularPeopleClick();
  });

  sortSelect.addEventListener('change', handleSortChange);
}

function handleSortChange() {
  const results = getResults();
  if (results.length > 0) sortAndRender(results);
}

function clearActiveButtons(...buttons) {
  buttons.forEach(btn => btn.classList.remove('active'));
}

function handleSearchSubmit(e, config) {
  e.preventDefault();
  hideError();

  clearActiveButtons(
    config.btnPopular,
    config.btnTopRated,
    config.btnPopularPeople
  );

  const query = config.input.value.trim();
  const type = config.typeSelect.value;
  const genreId = config.genreSelect.value;

  const noQuery = !query;
  const noGenre = !genreId;

  if (type === 'movie' && noQuery && noGenre) return handlePopularClick();
  if (type === 'person' && noQuery && noGenre) return handlePopularPeopleClick();
  if (type === 'person' && noQuery && genreId) return handleFetchPopularPeopleByGenre(genreId);
  if (type === 'movie' && noQuery && genreId) return handleGenreSearch(genreId);

  if (!query) {
    showError('Skriv något i sökfältet eller välj ett alternativ.');
    return;
  }

  handleSearch(query, type, genreId);
}

function handleSearch(query, type, genreId) {
  searchTMDB(query, type)
    .then(data => {
      if (type === 'movie') {
        handleMovieSearchResults(data, genreId);
      } else {
        handlePersonSearchResults(data, genreId);
      }
    })
    .catch(() => {
      showError('Det gick inte att hämta data – kontrollera din anslutning.');
    });
}

function extractResults(data) {
  return data.results;
}

function applyGenreFilter(results, genreId, filterFn) {
  return genreId ? filterFn(results, genreId) : results;
}

function ensureNonEmpty(results, emptyMessage) {
  if (results.length === 0) {
    showError(emptyMessage);
    return false;
  }
  return true;
}

function updateState(results, type) {
  setResults(results, type);
}

function sortAndShow(results) {
  sortAndRender(results);
}

function handleMovieSearchResults(data, genreId) {
  let results = extractResults(data);

  results = applyGenreFilter(results, genreId, filterMoviesByGenre);

  if (!ensureNonEmpty(results, 'Inga filmer hittades.')) return;

  updateState(results, 'movie');
  sortAndShow(results);
}

function preparePersonResults(data, genreId) {
  let results = filterPeopleWithProfileNKnownFor(data.results);
  results = sortByPopularityDescending(results);
  results = applyGenreFilter(results, genreId, filterPeopleByGenre);
  return results;
}

function handlePersonSearchResults(data, genreId) {
  const results = preparePersonResults(data, genreId);
  if (!ensureNonEmpty(results, 'Inga personer hittades.')) return;
  updateState(results, 'person');
  sortAndShow(results);
}

function handleGenreSearch(genreId) {
  fetchByGenre(genreId)
    .then(data => {
      const results = data.results;

      if (results.length === 0) {
        showError('Inga filmer hittades för vald genre.');
        return;
      }
      setResults(results, 'movie');
      sortAndRender(results);
    })
    .catch(() => {
      showError('Kunde inte hämta filmer för vald genre.');
    });
}

function handleGenericFetch(fetchFunction, type, transformFn, errorMessage) {
  hideError();
  fetchFunction()
    .then(data => {
      let results = data.results;

      if (transformFn) results = transformFn(results);

      if (!results || results.length === 0) {
        showError(`Inga ${type === 'movie' ? 'filmer' : 'personer'} hittades.`);
        return;
      }

      setResults(results, type);
      sortAndRender(results);
    })
    .catch(() => {
      showError(errorMessage);
    });
}

function handlingPopularPeople(results) {
  return sortByPopularityDescending(filterPeopleWithProfileNKnownFor(results));
}

export function handlePopularClick() {
  handleGenericFetch(fetchPopularMovies, 'movie', null, 'Kunde inte hämta populära filmer.');
}

export function handleTopRatedClick() {
  handleGenericFetch(fetchTopRatedMovies, 'movie', null, 'Kunde inte hämta topprankade filmer.');
}

export function handlePopularPeopleClick() {
  handleGenericFetch(fetchPopularPeople, 'person', handlingPopularPeople, 'Kunde inte hämta populära personer.');
}

export function handleFetchPopularPeopleByGenre(genreId) {
  hideError();

  fetchPopularPeople()
    .then(data => {
      let results = data.results;
      results = filterPeopleWithProfileNKnownFor(results);
      results = filterPeopleByGenre(results, genreId);

      if (results.length === 0) {
        showError('Inga personer hittades för den genren.');
        return;
      }

      setResults(results, 'person');
      sortAndRender(results);
    })
    .catch(() => {
      showError('Kunde inte hämta populära personer.');
    });
}

function sortAndRender(data) {
  const sorted = sortResults(data, sortSelect.value);
  hideError();
  getCurrentType() === 'person' ? renderPeople(sorted) : renderMovies(sorted);
}
