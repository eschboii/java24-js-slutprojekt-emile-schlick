export class PersonCard {
  constructor(person) {
    this.id = person.id;
    this.name = person.name;
    this.profilePath = person.profile_path;
    this.popularity = person.popularity;
    this.department = person.known_for_department;
    this.knownFor = person.known_for || [];
  }

  render() {
    const article = document.createElement('article');
    article.classList.add('movie-card');

    const imageUrl = this.profilePath
      ? `https://image.tmdb.org/t/p/w500${this.profilePath}`
      : 'https://via.placeholder.com/300x450?text=Ingen+bild';

    article.innerHTML = `
      <a href="https://www.themoviedb.org/person/${this.id}" target="_blank" style="text-decoration: none; color: inherit;">
        <div class="media-container">
          <img class="movie-poster" src="${imageUrl}" alt="${this.name}" />
        </div>
        <h2>${this.name}</h2>
        <p><strong>Popularitet:</strong> ${Math.round(this.popularity)}</p>
        <p><strong>Avdelning:</strong> ${this.department || 'Okänd'}</p>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${this.#renderKnownFor()}
        </ul>
      </a>
    `;

    return article;
  }

  #renderKnownFor() {
    return this.knownFor.map(item => {
      const type = item.media_type === 'tv' ? 'TV' : 'Movie';
      const title = item.title || item.name || 'Okänd titel';
      return `<li>${type}: ${title}</li>`;
    }).join('');
  }
}
