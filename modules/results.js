import { renderMovies, renderPeople } from './dom.js';
import { hideError } from './uiUtils.js';

let currentResults = [];
let currentType = '';

export function setResults(results, type) {
  currentResults = results;
  currentType = type;
}

export function getResults() { return currentResults; }
export function getCurrentType() { return currentType; }

export function sortResults(data, sortValue) {
  const sorted = [...data];

  switch (sortValue) {
    case 'name-asc':
      sorted.sort((a, b) =>
        (a.name || a.title).localeCompare(b.name || b.title)
      );
      break;
    case 'name-desc':
      sorted.sort((a, b) =>
        (b.name || b.title).localeCompare(a.name || a.title)
      );
      break;
    case 'popularity-asc':
      sorted.sort((a, b) => a.popularity - b.popularity);
      break;
    case 'popularity-desc':
      sorted.sort((a, b) => b.popularity - a.popularity);
      break;
    default:
      break;
  }
  return sorted;
}

export function performSort(sortValue) {
  if (!currentResults.length) return;

  const sorted = sortResults(currentResults, sortValue);

  hideError();

  currentType === 'person'
    ? renderPeople(sorted)
    : renderMovies(sorted);
}
