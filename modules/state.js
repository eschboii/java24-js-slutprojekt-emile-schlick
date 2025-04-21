export let currentResults = [];
export let currentType = 'movie';

export function setResults(results, type = 'movie') {
  currentResults = results;
  currentType = type;
}

export function hasResults() {
  return currentResults.length > 0;
}

export function getResults() {
  return currentResults;
}

export function getCurrentType() {
  return currentType;
}
