import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SearchBar = ({ query = '', searchCallback }) => {
  const handleSearch = event => {
    searchCallback(event.target.value);
  };

  const clearSearch = () => {
    searchCallback('');
  };

  return (
    <div className="search-bar">
      <input
        autoFocus
        type="text"
        value={query}
        className="hl-input"
        onChange={handleSearch}
        placeholder="Search"
      />

      {query ? (
        <button className="hl-primary-btn-red" onClick={clearSearch}>
          <FontAwesomeIcon icon="times" />
        </button>
      ) : (
        <button className="hl-primary-btn-blue">
          <FontAwesomeIcon icon="search" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
