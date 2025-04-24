/** 
 * En klass som hanterar data från api, sprar resultaten och skapar korten genom card-klasserna
 **/
import {
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchPopularPeople,
    fetchByGenre
} from './api.js';
import { setResults } from './results.js';
import { renderMovies, renderPeople } from './dom.js';
import { showError, hideError } from './uiUtils.js';
import {
    filterPeopleByGenre,
    filterPeopleWithProfileAndKnownFor,
    sortByPopularityDescending
} from './filters.js';

export async function loadPopularMovies() {
    hideError();
    try {
        const { results } = await fetchPopularMovies();
        if (!results.length) {
            showError('Inga populära filmer hittades.');
            return;
        }
        setResults(results, 'movie');
        renderMovies(results);
    } catch {
        showError('Kunde inte hämta populära filmer.');
    }
}

export async function loadTopRatedMovies() {
    hideError();
    try {
        const { results } = await fetchTopRatedMovies();
        if (!results.length) {
            showError('Inga topprankade filmer hittades.');
            return;
        }
        setResults(results, 'movie');
        renderMovies(results);
    } catch {
        showError('Kunde inte hämta topprankade filmer.');
    }
}

export async function loadPopularPeople() {
    hideError();
    try {
        const { results: raw } = await fetchPopularPeople();
        const filtered = sortByPopularityDescending(
            filterPeopleWithProfileAndKnownFor(raw)
        );
        if (!filtered.length) {
            showError('Inga populära personer hittades.');
            return;
        }
        setResults(filtered, 'person');
        renderPeople(filtered);
    } catch {
        showError('Kunde inte hämta populära personer.');
    }
}

export async function loadMoviesByGenre(genreId) {
    hideError();
    try {
        const { results } = await fetchByGenre(genreId);
        if (!results.length) {
            showError('Inga filmer hittades för vald genre.');
            return;
        }
        setResults(results, 'movie');
        renderMovies(results);
    } catch {
        showError('Kunde inte hämta filmer för vald genre.');
    }
}

export async function loadPeopleByGenre(genreId) {
    hideError();
    try {
        const { results: raw } = await fetchPopularPeople();

        const filtered = filterPeopleByGenre(
            filterPeopleWithProfileAndKnownFor(raw),
            genreId
        );

        if (!filtered.length) {
            showError('Inga personer hittades för vald genre.');
            return;
        }

        setResults(filtered, 'person');
        renderPeople(sortByPopularityDescending(filtered));
    } catch {
        showError('Kunde inte hämta personer för vald genre.');
    }
}

