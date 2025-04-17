import { fetchPopularMovies, fetchTopRatedMovies, searchTMDB } from './modules/api.js';
import { renderMovies, renderPeople } from './modules/dom.js';
import { showError, hideError } from './modules/error.js';
import { sortResults } from './modules/sort.js';
import { confirmedPersonResults } from './modules/searchUtils.js';

const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');
const typeSelect = document.querySelector('#search-type');
const sortSelect = document.querySelector('#sort-select');
const btnPopular = document.querySelector('#btn-popular');
const btnTopRated = document.querySelector('#btn-toprated');

let currentResults = [];
let currentType = 'movie';


form.addEventListener('submit', handleSearchSubmit);
sortSelect.addEventListener('change', () => {
  if (currentResults.length > 0) sortAndRender(currentResults);
});
btnPopular.addEventListener('click', handlePopularClick);
btnTopRated.addEventListener('click', handleTopRatedClick);

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

function sortAndRender(data) {
  const sorted = sortResults(data, sortSelect.value);
  hideError();
  currentType === 'person' ? renderPeople(sorted) : renderMovies(sorted);
}
