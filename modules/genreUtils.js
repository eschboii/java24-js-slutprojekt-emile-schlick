export let genreMap = {};

export function setGenreMap(genres) {
  genreMap = Object.fromEntries(genres.map(g => [g.id, g.name]));
}

export function getGenreNameById(id) {
  return genreMap[id] || 'Okänd';
}
