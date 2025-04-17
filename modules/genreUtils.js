export let genreMap = {};

export function setGenreMap(genres) {
  genreMap = Object.fromEntries(genres.map(g => [g.id, g.name]));
}
