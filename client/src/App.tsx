import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import VideoDetail from './components/VideoDetail';
import { extractVideoId } from './extract_video_id';

const App = () => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVideoSearch = (url: string) => {
    setIsLoading(true);
    axios
      .get('/api/load_video', {
        params: { url: url },
        baseURL: import.meta.env.VITE_API_ENDPOINT,
      })
      .then((response: AxiosResponse) => {
        console.log(response);
        setTranscript(response.data.transcript);
        setSummary(response.data.summary);
      })
      .catch((e: Error) => {
        console.log(e);
      });
    setIsLoading(false);
  };

  const handleSearch = (url: string) => {
    const id = extractVideoId(url);
    console.log('hi there', id, url);
    if (id) {
      setVideoId(id);
    }
  };

  return (
    <Box>
      <Typography variant='h4' sx={{ pb: 2 }}>
        Video Summarizer
      </Typography>
      {isLoading ? (
        <Box></Box>
      ) : (
        <Box className='ui container'>
          <SearchBar onSearch={handleSearch} />
          {videoId && <VideoDetail videoId={videoId} />}
        </Box>
      )}
      <Button
        onClick={
          () => console.log('clicked')
          // handleVideoSearch('https://www.youtube.com/watch?v=tomUWcQ0P3k')
        }
        variant='outlined'
      >
        Click to get link
      </Button>
      <Typography>{transcript}</Typography>
      <Typography>{summary}</Typography>
    </Box>
  );
};

export default App;
