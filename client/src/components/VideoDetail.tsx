import React from 'react';

interface VideoDetailProps {
  videoId: string;
}

const VideoDetail: React.FC<VideoDetailProps> = ({ videoId }) => {
  const videoSrc = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div>
      <div className="ui embed">
        <iframe
          title="video player"
          src={videoSrc}
          width="560"
          height="315"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoDetail;