import { useState } from 'react';

function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(term.trim());
  }

  return (
    <form className="topbar" onSubmit={handleSubmit}>
      <input
        placeholder="Busque por título…"
        value={term}
        className='input-search'
        onChange={(e) => setTerm(e.target.value)}
      />
      <button className="buttonSearch" type="submit">Buscar</button>
    </form>
  );
}

export default SearchBar