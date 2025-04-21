export function filterMoviesByGenre(movies, genreId) {
  return movies.filter(movie =>
    movie.genre_ids?.includes(Number(genreId))
  );
}

export function filterPeopleByGenre(people, genreId) {
  return people.filter(person =>
    person.known_for?.some(media =>
      media.genre_ids?.includes(Number(genreId))
    )
  );
}

export function filterPeopleByName(people, query) {
  return people.filter(person =>
    person.name?.toLowerCase().includes(query.toLowerCase())
  );
}

export function filterConfirmedPeople(people, query = '') {
  return people
    .filter(p =>
      p.known_for?.length > 0 &&
      p.profile_path &&
      p.name.toLowerCase().startsWith(query.toLowerCase())
    );
}

export function sortByPopularityDescending(people) {
  return [...people].sort((a, b) => b.popularity - a.popularity);
}