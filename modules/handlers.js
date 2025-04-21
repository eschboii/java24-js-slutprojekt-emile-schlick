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
    filterConfirmedPeople,
    sortByPopularityDescending
  } from './filters.js';
  
  let sortSelect;
  
  export function initHandlers(config) {
    sortSelect = config.sortSelect;
  
    config.form.addEventListener('submit', e => handleSearchSubmit(e, config));
    config.btnPopular.addEventListener('click', handlePopularClick);
    config.btnTopRated.addEventListener('click', handleTopRatedClick);
    config.btnPopularPeople.addEventListener('click', handlePopularPeopleClick);
    config.sortSelect.addEventListener('change', handleSortChange);
  }
  
  function handleSortChange() {
    const results = getResults();
    if (results.length > 0) {
      sortAndRender(results);
    }
  }

  function handleSearchSubmit(e, config) {
    e.preventDefault();
    hideError();
  
    const query = config.input.value.trim();
    const type = config.typeSelect.value;
    const genreId = config.genreSelect.value;
  
    const noQuery = !query;
    const noGenre = !genreId;
  
    if (type === 'movie' && noQuery && noGenre) return handlePopularClick();
    if (type === 'person' && noQuery && noGenre) return handlePopularPeopleClick();
    if (type === 'person' && noQuery && genreId) return fetchPeopleByGenre(genreId);
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
        } else if (type === 'person') {
          handlePersonSearchResults(data, query, genreId);
        }
      })
      .catch(() => {
        showError('Det gick inte att hämta data – kontrollera din anslutning.');
      });
  }
  
  function handleMovieSearchResults(data, genreId) {
    let results = data.results;
  
    if (genreId) {
      results = filterMoviesByGenre(results, genreId);
    }
  
    results = results.slice(0, 10);
  
    if (results.length === 0) {
      showError('Inga filmer hittades.');
      return;
    }
  
    setResults(results, 'movie');
    sortAndRender(results);
  }
  
  function handlePersonSearchResults(data, query, genreId) {
    let results = filterConfirmedPeople(data.results, query);
    results = sortByPopularityDescending(results);
  
    if (genreId) {
      results = filterPeopleByGenre(results, genreId);
    }
  
    results = results.slice(0, 20);
  
    if (results.length === 0) {
      showError('Inga personer hittades.');
      return;
    }
  
    setResults(results, 'person');
    sortAndRender(results);
  }
  
  function handleGenreSearch(genreId) {
    fetchByGenre(genreId)
      .then(data => {
        const results = data.results.slice(0, 10);
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
  
  function sortAndRender(data) {
    const sorted = sortResults(data, sortSelect.value);
    const currentType = getCurrentType();
    hideError();
    currentType === 'person' ? renderPeople(sorted) : renderMovies(sorted);
  }
  
  function handleGenericFetch(fetchFunction, type, confirmed, errorMessage) {
    hideError();
    fetchFunction()
      .then(data => {
        let results = data.results.slice(0, 10);
        if (confirmed) results = confirmed(results);
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
  
  function handlingPopularPeople(data) {
    const confirmed = filterConfirmedPeople(data);
    return sortByPopularityDescending(confirmed).slice(0, 20);
  }
  
  function handlePopularClick() {
    handleGenericFetch(fetchPopularMovies, 'movie', null, 'Kunde inte hämta populära filmer.');
  }
  
  function handleTopRatedClick() {
    handleGenericFetch(fetchTopRatedMovies, 'movie', null, 'Kunde inte hämta topprankade filmer.');
  }
  
  function handlePopularPeopleClick() {
    handleGenericFetch(fetchPopularPeople, 'person', handlingPopularPeople, 'Kunde inte hämta populära personer.');
  }
  
  function fetchPeopleByGenre(genreId) {
    hideError();
  
    fetchPopularPeople()
      .then(data => {
        let confirmed = filterConfirmedPeople(data.results);
        let filtered = filterPeopleByGenre(confirmed, genreId);
  
        if (filtered.length === 0) {
          showError('Inga personer hittades för den genren.');
          return;
        }
  
        setResults(filtered.slice(0, 20), 'person');
        sortAndRender(filtered);
      })
      .catch(() => {
        showError('Kunde inte hämta populära personer.');
      });
  }