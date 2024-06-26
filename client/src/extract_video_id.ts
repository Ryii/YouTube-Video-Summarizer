export const extractVideoId = (url: string): string | null => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?youtu(\.)?be(?:\.com)?\/(?:watch\?v=|embed\/|v\/|.*[?&]v=)?([^&\n?#]+)/;
  const match = url.match(regex);
  console.log('match', url, match);
  const video_id = match ? match[match.length - 1] : null;
  return video_id;
};
