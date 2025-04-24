const genreMap = new Map();

export function setGenreMap(genres) {
  genres.forEach(({ id, name }) => {
    genreMap.set(id, name);
  });
}

export function getGenreName(id) {
  return genreMap.get(Number(id)) || '';
}

export function filterMoviesByGenre(movies, genreId) {
  const gid = Number(genreId);
  return movies.filter(movie =>
    Array.isArray(movie.genre_ids) && movie.genre_ids.includes(gid)
  );
}

export function filterPeopleByGenre(people, genreId) {
  const gid = Number(genreId);
  return people.filter(person =>
    Array.isArray(person.known_for) &&
    person.known_for.some(item =>
      Array.isArray(item.genre_ids) && item.genre_ids.includes(gid)
    )
  );
}

export function filterPeopleByName(people, query) {
  const q = query.toLowerCase();
  return people.filter(person =>
    typeof person.name === 'string' &&
    person.name.toLowerCase().includes(q)
  );
}

export function filterPeopleWithProfileAndKnownFor(people, query = '') {
  const q = query.toLowerCase();
  return people.filter(person =>
    Array.isArray(person.known_for) &&
    person.known_for.length > 0 &&
    person.profile_path &&
    person.name.toLowerCase().startsWith(q)
  );
}

export function sortByPopularityDescending(items) {
  return [...items].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
}
