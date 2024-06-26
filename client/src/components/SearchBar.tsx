import Box from '@mui/material/Box';
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

  const handleSearch = () => {
    onSearch(url);
  };

  return (
    <Box>
      <TextField label='YouTube URL' variant='filled' onChange={handleChange} />
      <Button variant='outlined' onClick={handleSearch}>
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
