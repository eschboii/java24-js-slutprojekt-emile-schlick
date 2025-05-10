/** 
 * Klassen samlar eventlistners som triggas när vi klickar på filkar, submitar i sökfältet eller sorterar resultat.
 * Den skickar sedan vidare händelsen till metod som hanterar vad som ska hända. Exempel, fritextssökning skickar till
 * performSearch i searchLogic 
 * 
 * Exporterar initUiEvents
 * Anropar browsLogic, searchLogic, results och uiUtils
 **/
import {
  loadPopularMovies,
  loadTopRatedMovies,
  loadPopularPeople,
  loadMoviesByGenre,
  loadPeopleByGenre
} from './browseLogic.js';

import { performSearch } from './searchLogic.js';
import { performSort } from './results.js';
import { hideError } from './uiUtils.js';

export function initUIEvents(config) {
  const {
    form,
    input,
    typeSelect,
    genreSelect,
    sortSelect,
    btnPopular,
    btnTopRated,
    btnPopularPeople
  } = config;

  const tabs = [btnPopular, btnTopRated, btnPopularPeople];

  const setActiveTab = (btn) =>
    tabs.forEach(t => t.classList.toggle('active', t === btn));

  btnPopular.addEventListener('click', () => {
    hideError();
    setActiveTab(btnPopular);
    loadPopularMovies();
  });

  btnTopRated.addEventListener('click', () => {
    hideError();
    setActiveTab(btnTopRated);
    loadTopRatedMovies();
  });

  btnPopularPeople.addEventListener('click', () => {
    hideError();
    setActiveTab(btnPopularPeople);
    loadPopularPeople();
  });


  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideError();

    const query = input.value.trim();
    const type = typeSelect.value;
    const genreId = genreSelect.value;

    if (!query && !genreId) {
      if (type === 'person') {
        setActiveTab(btnPopularPeople);
        loadPopularPeople();
      } else {
        setActiveTab(btnPopular);
        loadPopularMovies();
      }
      return;
    }

    if (!query && genreId) {
      if (type === 'person') {
        setActiveTab(btnPopularPeople);
        loadPeopleByGenre(genreId);
      } else {
        setActiveTab(btnPopular);
        loadMoviesByGenre(genreId);
      }
      return;
    }

    tabs.forEach(t => t.classList.remove('active'));
    performSearch(query, type, genreId, tabs);
  });


  sortSelect.addEventListener('change', () => {
    hideError();
    performSort(sortSelect.value);
  });
}
