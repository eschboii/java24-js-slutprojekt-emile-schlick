export function sortResults(data, sortValue) {
    const sorted = [...data];
    
    switch (sortValue) {
      case 'name-asc':
        sorted.sort((a, b) => (a.name || a.title).localeCompare(b.name || b.title));
        break;
      case 'name-desc':
        sorted.sort((a, b) => (b.name || b.title).localeCompare(a.name || a.title));
        break;
      case 'popularity-asc':
        sorted.sort((a, b) => a.popularity - b.popularity);
        break;
      case 'popularity-desc':
        sorted.sort((a, b) => b.popularity - a.popularity);
        break;
    }
  
    return sorted;
  }
  