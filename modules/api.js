/**
 * Hanterar HTTP-anrop till API:et med hjälp av olika fetch-hjälpmetoder
 * Vi exporterar BASE_URL, fetchOptions, buildTrailerURL
 * Exporterna av fetchOptions och buildTrailerURL görs för att vi i dom.js ska kunna anropa API:et och skapa en trailer-länk till vald film
 *  **/

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMzBmYzE4ODlmNmM4MjgwOGU4YzUzYTgwMmYxNmYzNSIsIm5iZiI6MTc0NDc5MDU3My45ODcsInN1YiI6IjY3ZmY2NDJkODNjNmU1NjdjN2Q5MmI2NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OvaOUmpFAd0AHEF2eEf4VrpgYV_cFPhUPxKWvKeemwc';

export const BASE_URL = 'https://api.themoviedb.org/3';
export const fetchOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`
  }
}

const language = 'en-US';
const MOVIES_PER_PAGE = 10;
const PEOPLE_PER_PAGE = 20;

/** En funktion som hämtar JSON och endast returnerar antal bestämda träffar för filmer/personer**/
async function sliceResults(response, limit) {
  const data = await response.json();
  return { results: data.results.slice(0, limit) };
}

export async function searchTMDB(query, type) {
  const endpoint = type === 'person' ? '/search/person' : '/search/movie';
  const maxPages = 5;
  const allResults = [];

  for (let page = 1; page <= maxPages; page++) {
    const url = `${BASE_URL}${endpoint}?query=${encodeURIComponent(query)}&language=${language}&page=${page}`;
    const res = await fetch(url, fetchOptions);
    if (!res.ok) break;
    const data = await res.json();
    allResults.push(...data.results);
    if (data.total_pages <= page) break;
  }

  return { results: allResults };
}

export async function fetchPopularMovies() {
  const res = await fetch(`${BASE_URL}/movie/popular?language=${language}&page=1`, fetchOptions);
  if (!res.ok) throw new Error('Kunde inte hämta populära filmer');
  return sliceResults(res, MOVIES_PER_PAGE);
}

export async function fetchTopRatedMovies() {
  const res = await fetch(`${BASE_URL}/movie/top_rated?language=${language}&page=1`, fetchOptions);
  if (!res.ok) throw new Error('Kunde inte hämta topprankade filmer');
  return sliceResults(res, MOVIES_PER_PAGE);
}

export async function fetchPopularPeople() {
  const res = await fetch(`${BASE_URL}/person/popular?language=${language}&page=1`, fetchOptions);
  if (!res.ok) throw new Error('Kunde inte hämta populära personer');
  return sliceResults(res, PEOPLE_PER_PAGE);
}

export async function fetchGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?language=${language}`, fetchOptions);
  if (!res.ok) throw new Error('Kunde inte hämta genrer');
  const data = await res.json();
  return data.genres;
}

export async function fetchByGenre(genreId) {
  const res = await fetch(`${BASE_URL}/discover/movie?with_genres=${genreId}&language=${language}&page=1`, fetchOptions);
  if (!res.ok) throw new Error('Kunde inte hämta filmer för vald genre');
  return sliceResults(res, MOVIES_PER_PAGE);
}

export function buildTrailerUrl(movieId) {
  return `${BASE_URL}/movie/${movieId}/videos?language=${language}`;
}



