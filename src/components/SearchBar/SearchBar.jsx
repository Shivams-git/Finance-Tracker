import React from 'react';
import { RiSearchLine, RiCloseLine } from 'react-icons/ri';
import './SearchBar.css';

export default function SearchBar({ value, onChange, placeholder = 'Search transactions...' }) {
  return (
    <div className="search-bar">
      <RiSearchLine className="search-icon" />
      <input
        className="search-input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')}>
          <RiCloseLine />
        </button>
      )}
    </div>
  );
}