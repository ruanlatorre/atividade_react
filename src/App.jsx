import { useEffect, useMemo, useState } from 'react';

import './components/style.css';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';
import ToggleFavoritesButton from './favorites/index.jsx'
import moviesData from './data/movies.json';
import YearFilter from './YearFilter/index.jsx';


export default function App() {
  const [movies, setMovies] = useState([]);
  const [term, setTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem('favorites');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [showFavorites, setShowFavorites] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setMovies(moviesData);
    } catch (err) {
      console.error(err);
      setError('Falha ao carregar os dados dos filmes.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const availableYears = useMemo(() => {
    const years = new Set(moviesData.map(m => m.Year));
    return ['Todos os anos', ...Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))];
  }, []);

  const moviesToDisplay = useMemo(() => {
    let sourceList = showFavorites ? favorites : movies;

    if (yearFilter) {
      sourceList = sourceList.filter(m => m.Year === yearFilter);
    }
    
    if (term) {
      const lowercasedTerm = term.toLowerCase();
      sourceList = sourceList.filter(m =>
        m.Title.toLowerCase().includes(lowercasedTerm)
      );
    }

    return sourceList;
  }, [term, yearFilter, movies, favorites, showFavorites]);

  function handleSearch(t) {
    setTerm(t);
  }

  function toggleFavorite(movie) {
    setFavorites(prev => {
      const exists = prev.some(f => f.imdbID === movie.imdbID);
      if (exists) return prev.filter(f => f.imdbID !== movie.imdbID);
      return [...prev, movie];
    });
  }

  const isFavorite = (movie) => favorites.some(f => f.imdbID === movie.imdbID);

  let emptyMessage = null;
  if (!loading && !error && moviesToDisplay.length === 0) {
    if (showFavorites) {
      emptyMessage = (term || yearFilter)
        ? `Nenhum favorito encontrado para os filtros aplicados.`
        : 'Sua lista de favoritos está vazia.';
    } else if (term || yearFilter) {
      emptyMessage = `Nenhum filme encontrado para os filtros aplicados.`;
    }
  }

  return (
    <>
      <div className="container">
        <div className="topbar">
          <h1>CatálogoFlix</h1>
          <ToggleFavoritesButton
            showFavorites={showFavorites}
            onToggle={() => setShowFavorites(prev => !prev)}
          />
          <div className="favs">Favoritos: <strong>{favorites.length}</strong></div>
        </div>
        
        <div className="filters-bar">
          <SearchBar onSearch={handleSearch} />
          <YearFilter 
            years={availableYears}
            selectedYear={yearFilter}
            onYearChange={setYearFilter}
          />
        </div>

        <div className="grid">
          {loading && <p className='loading'>Carregando…</p>}
          {!loading && error && <p className='empty-message'>{error}</p>}
          {!loading && !error && (
            <>
              {emptyMessage && <p className='empty-message'>{emptyMessage}</p>}
              {moviesToDisplay.map(movie => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  onDetails={setSelected}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={isFavorite(movie)}
                />
              ))}
            </>
          )}
        </div>

        <MovieModal movie={selected} onClose={() => setSelected(null)} />
      </div>
    </>
  );
}
