import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (url: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [url, setUrl] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(url);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={url}
        onChange={handleChange}
        placeholder="Enter YouTube video URL..."
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;