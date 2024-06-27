import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';
import './App.css';
import VideoEmbed from './components/VideoEmbed';

const App = () => {
  const [videoUrl, setVideoUrl] = useState('');
  // const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSideBySide, setShowSideBySide] = useState(false);

  const handleSummarizeVideo = () => {
    setIsLoading(true);
    axios
      .get('/api/transcribe_summarize_video', {
        params: { url: videoUrl },
        baseURL: import.meta.env.VITE_API_ENDPOINT,
      })
      .then((response: AxiosResponse) => {
        // setTranscript(response.data.transcript);
        setSummary(response.data.summary);
        setShowSideBySide(true);
      })
      .catch((e: Error) => {
        console.log(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  // fix side by side
  // move env variables
  // vertical align summary, left align

  return (
    <Box
      sx={{
        p: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1200 }}>
        <Typography
          variant='h3'
          sx={{ pb: 2, textAlign: 'center', fontFamily: 'BavroRegular' }}
        >
          Video Summarizer
        </Typography>
        <Grid container spacing={4} justifyContent='center'>
          <Grid
            item
            xs={12}
            sm={showSideBySide ? 6 : 12}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <TextField
                fullWidth
                label='YouTube URL'
                variant='filled'
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              {isLoading ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ py: 2, color: 'white' }}>
                    Video analysis in progress! 🚀
                  </Typography>
                  <CircularProgress />
                </Box>
              ) : (
                <Button
                  onClick={handleSummarizeVideo}
                  variant='outlined'
                  sx={{ width: '100%' }}
                >
                  Transcribe & Summarize
                </Button>
              )}
              <Box sx={{ pt: 2 }}>
                <VideoEmbed videoUrl={videoUrl} />
              </Box>
            </Box>
          </Grid>
          {showSideBySide && (
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box sx={{ width: '100%' }}>
                {summary && (
                  <Box>
                    <Typography variant='h6'>Summary</Typography>
                    <Typography>{summary}</Typography>
                  </Box>
                )}
                {/* {transcript && (
                  <Box sx={{ pt: 2 }}>
                    <Divider />
                    <Typography variant='h6'>Transcript</Typography>
                    <Typography>{transcript}</Typography>
                  </Box>
                )} */}
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default App;
