import { MovieCard } from './classes/MovieCard.js';
import { PersonCard } from './classes/PersonCard.js';

export function renderMovies(movieArray) {
  const container = document.querySelector('#movie-list');
  container.innerHTML = '';

  movieArray.forEach(movie => {
    const card = new MovieCard(movie);
    container.appendChild(card.render());
  });
}

export function renderPeople(peopleArray) {
  const container = document.querySelector('#movie-list');
  container.innerHTML = '';

  peopleArray.forEach(person => {
    const card = new PersonCard(person);
    container.appendChild(card.render());
  });
}

export function renderGenreDropdown(genres, selectElement) {
  selectElement.innerHTML = '';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '-- Välj --';
  selectElement.appendChild(defaultOption);
  
  genres.forEach(g => {
    const option = document.createElement('option');
    option.value = g.id;
    option.textContent = g.name;
    selectElement.appendChild(option);
  });
}

