import { fetchGenres } from './modules/api.js';
import { loadPopularMovies } from './modules/browseLogic.js';
import { showError } from './modules/uiUtils.js';
import { setGenreMap } from './modules/filters.js';
import { initUIEvents } from './modules/uiEvents.js';
import { renderGenreDropdown } from './modules/dom.js';

const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');
const typeSelect = document.querySelector('#search-type');
const sortSelect = document.querySelector('#sort-select');
const genreSelect = document.querySelector('#genre-select');
const btnPopular = document.querySelector('#btn-popular');
const btnTopRated = document.querySelector('#btn-toprated');
const btnPopularPeople = document.querySelector('#btn-popular-people');

initUIEvents({
  form,
  input,
  typeSelect,
  sortSelect,
  genreSelect,
  btnPopular,
  btnTopRated,
  btnPopularPeople
});

fetchGenres()
  .then(genres => {
    setGenreMap(genres);
    renderGenreDropdown(genres, genreSelect);
    loadPopularMovies();
  })
  .catch(err => {
    console.error('Kunde inte ladda in några genrer:', err.message);
    showError('Kunde inte ladda genrer.');
  });