/** 
 * Hanterar fritextssökning, tar emot en sträng som har triggats av submiten. Hämtar data från API-anrop som filtreras och 
 * sparar detta i vår cache och får sedan dom att rendera vårt sökresultat
 * Vi anropar metoderna vi importer
 **/
import { searchTMDB } from './api.js';
import {
    filterMoviesByGenre,
    filterPeopleByGenre,
    filterPeopleWithProfileAndKnownFor,
    sortByPopularityDescending
} from './filters.js';
import { setResults } from './results.js';
import { renderMovies, renderPeople } from './dom.js';
import { showError, hideError } from './uiUtils.js';

export async function performSearch(query, type, genreId) {
    hideError();
    try {
        const { results } = await searchTMDB(query, type);

        if (type === 'movie') {
            processMovieResults(results, genreId);
        } else {
            processPersonResults(results, genreId);
        }
    } catch {
        showError('Det gick inte att hämta data – kontrollera din anslutning.');
    }
}

function processMovieResults(results, genreId) {
    let filtered = genreId
        ? filterMoviesByGenre(results, genreId)
        : results;

    if (filtered.length === 0) {
        showError('Inga filmer hittades.');
        return;
    }

    setResults(filtered, 'movie');
    renderMovies(filtered);
}

function processPersonResults(results, genreId) {
    let filtered = filterPeopleWithProfileAndKnownFor(results);
    filtered = sortByPopularityDescending(filtered);
    if (genreId) filtered = filterPeopleByGenre(filtered, genreId);

    if (filtered.length === 0) {
        showError('Inga personer hittades.');
        return;
    }

    setResults(filtered, 'person');
    renderPeople(filtered);
}
