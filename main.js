// ===================================
// Imports
// ===================================
import {
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchPopularPeople,
    searchTMDB,
    fetchGenres,
    fetchByGenre
  } from './modules/api.js';
  
  import { renderMovies, renderPeople } from './modules/dom.js';
  import { showError, hideError } from './modules/error.js';
  import { sortResults } from './modules/sort.js';
  import { confirmedPersonResults } from './modules/searchUtils.js';
  import { setGenreMap } from './modules/genreUtils.js';
  

  const form = document.querySelector('#search-form');
  const input = document.querySelector('#search-input');
  const typeSelect = document.querySelector('#search-type');
  const sortSelect = document.querySelector('#sort-select');
  const genreSelect = document.querySelector('#genre-select'); 
  const btnPopular = document.querySelector('#btn-popular');
  const btnTopRated = document.querySelector('#btn-toprated');
  const btnPopularPeople = document.querySelector('#btn-popular-people');
  
  
  let currentResults = [];
  let currentType = 'movie';
  
  
  fetchGenres()
    .then(genres => {
      setGenreMap(genres);
      renderGenreDropdown(genres);
    })
    .catch(err => {
      console.error('Kunde inte ladda genrer:', err.message);
    });
  
  
  form.addEventListener('submit', handleSearchSubmit);
  sortSelect.addEventListener('change', () => {
    if (currentResults.length > 0) sortAndRender(currentResults);
  });
  btnPopular.addEventListener('click', handlePopularClick);
  btnTopRated.addEventListener('click', handleTopRatedClick);
  genreSelect.addEventListener('change', handleGenreChange);
  
  
  function handleSearchSubmit(e) {
    e.preventDefault();
    hideError();
  
    const query = input.value.trim();
    const type = typeSelect.value;
    currentType = type;
  
    if (!query) {
      showError('Skriv något i sökfältet.');
      return;
    }
  
    searchTMDB(query, type)
      .then(data => {
        if (type === 'person') {
          const cleaned = confirmedPersonResults(data.results, query);
          if (cleaned.length === 0) {
            showError('Inga personer med det namnet hittades.');
            return;
          }
          currentResults = cleaned;
          sortAndRender(cleaned);
        } else {
          const results = data.results.slice(0, 10);
          if (results.length === 0) {
            showError('Inga filmer hittades.');
            return;
          }
          currentResults = results;
          sortAndRender(results);
        }
      })
      .catch(err => {
        console.error(err.message);
        showError('Det gick inte att hämta data – kontrollera din anslutning.');
      });
  }
  
  function handlePopularClick() {
    hideError();
    genreSelect.value = '';
    fetchPopularMovies()
      .then(data => {
        currentResults = data.results.slice(0, 10);
        currentType = 'movie';
        sortAndRender(currentResults);
      })
      .catch(err => {
        console.error('Fel vid hämtning av populära filmer:', err.message);
        showError('Kunde inte hämta populära filmer.');
      });
  }
  
  function handleTopRatedClick() {
    hideError();
    genreSelect.value = '';
    fetchTopRatedMovies()
      .then(data => {
        currentResults = data.results.slice(0, 10);
        currentType = 'movie';
        sortAndRender(currentResults);
      })
      .catch(err => {
        console.error('Fel vid hämtning av topprankade filmer:', err.message);
        showError('Kunde inte hämta topprankade filmer.');
      });
  }

  btnPopularPeople.addEventListener('click', () => {
    hideError();
    fetchPopularPeople()
      .then(data => {
        const cleaned = confirmedPersonResults(data.results);
        currentResults = cleaned;
        currentType = 'person';
        sortAndRender(cleaned);
      })
      .catch(err => {
        console.error('Fel vid hämtning av populära personer:', err.message);
        showError('Kunde inte hämta populära personer.');
      });
  });
  
  function handleGenreChange() {
    const genreId = genreSelect.value;
    if (!genreId) return;
  
    hideError();
  
    fetchByGenre(genreId)
      .then(data => {
        currentResults = data.results.slice(0, 10);
        currentType = 'movie';
        sortAndRender(currentResults);
      })
      .catch(err => {
        console.error(err.message);
        showError('Kunde inte hämta filmer för vald genre.');
      });
  }
  
  
  function sortAndRender(data) {
    const sorted = sortResults(data, sortSelect.value);
    hideError();
    currentType === 'person' ? renderPeople(sorted) : renderMovies(sorted);
  }
  
  function renderGenreDropdown(genres) {
    genres.forEach(g => {
      const option = document.createElement('option');
      option.value = g.id;
      option.textContent = g.name;
      genreSelect.appendChild(option);
    });
  }
  