import {
  fetchGenres
} from './modules/api.js';

import { showError } from './modules/error.js';
import { setGenreMap } from './modules/genreUtils.js';
import { initHandlers } from './modules/handlers.js';
import { renderGenreDropdown } from './modules/dom.js';

const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');
const typeSelect = document.querySelector('#search-type');
const sortSelect = document.querySelector('#sort-select');
const genreSelect = document.querySelector('#genre-select');
const btnPopular = document.querySelector('#btn-popular');
const btnTopRated = document.querySelector('#btn-toprated');
const btnPopularPeople = document.querySelector('#btn-popular-people');

initHandlers({
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
  })
  .catch(err => {
    console.error('Kunde inte ladda in några genrer:', err.message);
    showError('Kunde inte ladda genrer.');
  });