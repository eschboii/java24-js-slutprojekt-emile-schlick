const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMzBmYzE4ODlmNmM4MjgwOGU4YzUzYTgwMmYxNmYzNSIsIm5iZiI6MTc0NDc5MDU3My45ODcsInN1YiI6IjY3ZmY2NDJkODNjNmU1NjdjN2Q5MmI2NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OvaOUmpFAd0AHEF2eEf4VrpgYV_cFPhUPxKWvKeemwc';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const fetchOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`
  }
};

const language = 'en-US';

export async function fetchPopularMovies() {
    const res = await fetch(`${BASE_URL}/movie/popular?language=${language}&page=1`, fetchOptions);
    if (!res.ok) throw new Error('Kunde inte hämta populära filmer');
    return await res.json();
  }
  
  export async function fetchTopRatedMovies() {
    const res = await fetch(`${BASE_URL}/movie/top_rated?language=${language}&page=1`, fetchOptions);
    if (!res.ok) throw new Error('Kunde inte hämta topprankade filmer');
    return await res.json();
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
  
