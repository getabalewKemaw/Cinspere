import React, { useState, useEffect } from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {
  const [inputValue, setInputValue] = useState(searchTerm);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue.trim());
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, setSearchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(inputValue.trim());
  };

  const handleClear = () => {
    setInputValue('');
    setSearchTerm('');
  };

  return (
    <div className="search">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center">
          <img src="./search.svg" alt="search icon" className="absolute left-3 size-5" />
          <input
            type="text"
            placeholder="Search for movies..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-10 pr-10 py-2 bg-dark-100 text-light-100 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-light-100/20"
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 text-light-100 hover:text-light-200"
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Search;