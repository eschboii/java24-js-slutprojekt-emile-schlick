export function confirmedPersonResults(results, query) {
    return results
      .filter(p =>
        p.known_for?.length > 0 &&
        p.profile_path &&
        p.name.toLowerCase().startsWith(query.toLowerCase())
      )
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 20);
  }
  