import Box from '@mui/material/Box';
import React from 'react';
import { extractVideoId } from './utils';

interface VideoEmbedProps {
  videoUrl: string;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({ videoUrl }) => {
  const videoId = extractVideoId(videoUrl);
  const videoSrc = `https://www.youtube.com/embed/${videoId}`;

  return (
    <Box sx={{ height: 315, maxWidth: 560, margin: 'auto' }}>
      {videoId && (
        <iframe
          src={videoSrc}
          width='100%'
          height='100%'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        />
      )}
    </Box>
  );
};

export default VideoEmbed;
