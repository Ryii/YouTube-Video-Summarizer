import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';
import './App.css';
import VideoEmbed from './components/VideoEmbed';

const App = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const handleSummarizeVideo = () => {
    setIsLoading(true);
    axios
      .get('/api/transcribe_summarize_video', {
        params: { url: videoUrl },
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='h4' sx={{ pb: 2 }}>
        Video Summarizer
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, pb: 2 }}>
        <TextField
          label='YouTube URL'
          variant='filled'
          onChange={handleChange}
        />
        <Button onClick={handleSummarizeVideo} variant='outlined'>
          Transcribe & Summarize
        </Button>
      </Box>
      <Box sx={{ pb: 2 }}>
        <VideoEmbed videoUrl={videoUrl} />
      </Box>
      {isLoading ? (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ pt: 2 }}>Video analysis in progress! 🚀</Typography>
        </Box>
      ) : (
        <Box>
          {summary && (
            <Box>
              <Divider sx={{ pb: 2 }} />
              <Typography variant='h6'>Summary</Typography>
              <Typography>{summary}</Typography>
            </Box>
          )}
          {transcript && (
            <Box>
              <Divider sx={{ pb: 2 }} />
              <Typography variant='h6'>Transcript</Typography>
              <Typography>{transcript}</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default App;
