import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SearchBar = ({ query, handleSearch }) => (
  <div className="search-bar">
    <input
      autoFocus
      type="text"
      value={query}
      className="hl-input"
      onChange={handleSearch}
      placeholder="Search"
    />

    <button className="hl-primary-btn-blue">
      <FontAwesomeIcon icon="search" />
    </button>
  </div>
);

export default SearchBar;
