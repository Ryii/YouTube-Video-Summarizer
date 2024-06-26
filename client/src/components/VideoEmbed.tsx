import Box from '@mui/material/Box';
import React from 'react';
import { extractVideoId } from './extract_video_id';

interface VideoEmbedProps {
  videoUrl: string;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({ videoUrl }) => {
  const videoId = extractVideoId(videoUrl);
  const videoSrc = `https://www.youtube.com/embed/${videoId}`;

  return (
    <Box sx={{ height: 315, width: '100%' }}>
      {videoId && (
        <iframe
          title='video player'
          src={videoSrc}
          width='560'
          height='315'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        />
      )}
    </Box>
  );
};

export default VideoEmbed;
