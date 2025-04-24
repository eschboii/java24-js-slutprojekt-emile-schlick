import { openModalWithContent } from './uiUtils.js';
import { MovieCard } from './classes/MovieCard.js';
import { PersonCard } from './classes/PersonCard.js';
import { buildTrailerUrl, fetchOptions } from './api.js';

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

  genres.forEach(({ id, name }) => {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = name;
    selectElement.appendChild(option);
  });
}

export async function openTrailerModal(movieId) {
  const body = openModalWithContent('<p>Hämtar trailer…</p>');

  try {
    const url = buildTrailerUrl(movieId);
    const res = await fetch(url, fetchOptions);
    if (!res.ok) throw new Error('Inget svar från servern');

    const { results } = await res.json();
    const trailer = results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

    if (trailer) {
      body.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1"
          frameborder="0"
          allow="autoplay; fullscreen"
          allowfullscreen>
        </iframe>
      `;
    } else {
      body.innerHTML = `<p>Ingen trailer tillgänglig.</p>`;
    }
  } catch (err) {
    console.error('Trailer-fel:', err);
    body.innerHTML = `<p>Fel vid hämtning: ${err.message}</p>`;
  }
}