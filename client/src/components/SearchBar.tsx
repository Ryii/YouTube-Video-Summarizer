import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (url: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [url, setUrl] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(url);
  };

  return (
    <form onSubmit={handleSearch}>
      <TextField label='YouTube URL' variant='filled' onChange={handleChange} />
      <Button variant='outlined' type='submit'>
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
