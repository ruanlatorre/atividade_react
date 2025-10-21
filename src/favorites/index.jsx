function ToggleFavoritesButton({ showFavorites, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`toggle-fav-btn ${showFavorites ? 'active' : 'inactive'}`}
    >
      {showFavorites ? 'Ver Todos' : 'Ver Favoritos'}
    </button>
  );
}

export default ToggleFavoritesButton