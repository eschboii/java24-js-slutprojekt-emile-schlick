import { getGenreName } from '../filters.js';
import { openTrailerModal } from '../dom.js';

export class MovieCard {
  constructor(movie) {
    this.id = movie.id;
    this.title = movie.title;
    this.releaseDate = movie.release_date;
    this.popularity = movie.popularity;
    this.voteAverage = movie.vote_average;
    this.posterPath = movie.poster_path;
    this.overview = movie.overview;
    this.genres = movie.genre_ids?.map(getGenreName).filter(Boolean);
  }

  render() {
    const article = document.createElement('article');
    article.classList.add('movie-card');

    const imageUrl = this.posterPath
      ? `https://image.tmdb.org/t/p/w500${this.posterPath}`
      : 'https://via.placeholder.com/500x750?text=Ingen+bild';

    article.innerHTML = `
      <a href="https://www.themoviedb.org/movie/${this.id}" target="_blank"
         style="text-decoration:none;color:inherit;">
        <div class="media-container">
          <img class="movie-poster" src="${imageUrl}" alt="${this.title}" />
        </div>
        <h2>${this.title}</h2>
        <p><strong>Premiär:</strong> ${this.releaseDate || 'Okänd'}</p>
        <p><strong>Popularitet:</strong> ${Math.round(this.popularity)}</p>
        <p><strong>Betyg:</strong> ${Math.round(this.voteAverage * 10) / 10 || 'Okänd'}</p>
        <div class="genre-badges">
          ${this.#renderGenreBadges()}
        </div>
      </a>

      <!-- Overlay med summary + knapp till modal -->
      <div class="summary-overlay">
        <p class="overview">${this.overview || 'Ingen beskrivning tillgänglig.'}</p>
        <button class="trailer-btn">Se trailer</button>
      </div>
    `;

    const btn = article.querySelector('.trailer-btn');
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openTrailerModal(this.id);
    });

    return article;
  }

  #renderGenreBadges() {
    if (!this.genres?.length) return '<span>Okänd</span>';
    return this.genres.map(g => `<span class="badge">${g}</span>`).join('');
  }
}
