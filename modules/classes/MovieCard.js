import { fetchOptions, buildTrailerUrl } from '../api.js';
import { getGenreNameById } from '../genreUtils.js';

export class MovieCard {
  constructor(movie) {
    this.id = movie.id;
    this.title = movie.title;
    this.releaseDate = movie.release_date;
    this.popularity = movie.popularity;
    this.voteAverage = movie.vote_average;
    this.posterPath = movie.poster_path;
    this.trailerLoaded = false;
    this.genres = movie.genre_ids?.map(getGenreNameById).filter(Boolean);
  }

  render() {
    const article = document.createElement('article');
    article.classList.add('movie-card');

    const imageUrl = this.posterPath
      ? `https://image.tmdb.org/t/p/w500${this.posterPath}`
      : 'https://via.placeholder.com/500x750?text=Ingen+bild';

    article.innerHTML = `
      <a href="https://www.themoviedb.org/movie/${this.id}" target="_blank" style="text-decoration: none; color: inherit;">
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
    `;

    this.#addHoverEvents(article, imageUrl);

    return article;
  }

  #renderGenreBadges() {
    if (!this.genres || this.genres.length === 0) return '<span>Okänd</span>';

    return this.genres.map(genre => `<span class="badge">${genre}</span>`).join('');
  }

  #addHoverEvents(article, imageUrl) {
    const mediaContainer = article.querySelector('.media-container');
    const img = article.querySelector('.movie-poster');
    let hoverTimeout;

    article.addEventListener('mouseenter', () => {
      if (!this.trailerLoaded) {
        hoverTimeout = setTimeout(() => {
          this.#loadTrailer(mediaContainer);
          this.trailerLoaded = true;
        }, 2000);
      }
    });

    article.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimeout);
      mediaContainer.innerHTML = '';
      mediaContainer.appendChild(img.cloneNode());
      this.trailerLoaded = false;
    });
  }

  async #loadTrailer(container) {
    const url = buildTrailerUrl(this.id);

    try {
      const response = await fetch(url, fetchOptions);
      const data = await response.json();

      const trailer = data.results.find(video =>
        video.type === 'Trailer' && video.site === 'YouTube'
      );

      container.innerHTML = trailer
        ? `
          <iframe width="100%" height="315"
            src="https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1"
            frameborder="0" allow="autoplay" allowfullscreen>
          </iframe>
        `
        : `<p>Ingen tillgänglig trailer.</p>`;

    } catch (err) {
      console.error('Kunde inte hämta trailer:', err.message);
      container.innerHTML = `<p>Fel vid hämtning av trailer.</p>`;
    }
  }
}
