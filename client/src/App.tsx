import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import VideoDetail from './components/VideoDetail';

const extractVideoId = (url: string): string | null => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|.*[?&]v=)?([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const App = () => {
  const [videoId, setVideoId] = useState<string | null>(null);
  // const [array, setArray] = useState([]);
  const [link, setLink] = useState('');

  // const fetchAPI = async () => {
  //   const response = await axios.get("http://localhost:8080/api/users");
  //   // console.log(response.data.users);
  //   setArray(response.data.users);
  // };

  const handleUrlVideoSearch = (url: string) => {
    // setVideoMeta(() => ({
    //   src: null,
    //   mimeType: null,
    //   isUploading: true,
    // }));

    axios
      .get('/api/load_video', {
        params: {
          url: url,
        },
        baseURL: import.meta.env.VITE_API_ENDPOINT,
      })
      .then((response: AxiosResponse) => {
        console.log(response);
        setLink(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  // useEffect(() => {
  //   fetchAPI();
  // }, []);

  const onSearch = (url: string) => {
    const id = extractVideoId(url);
    setVideoId(id);
  };

  return (
    <div>
      <div className='ui container'>
        <SearchBar onSearch={onSearch} />
        {videoId && <VideoDetail videoId={videoId} />}
      </div>
      <button
        onClick={() =>
          handleUrlVideoSearch('https://www.youtube.com/watch?v=tomUWcQ0P3k')
        }
      >
        Click to get link
      </button>
      <p>{link}</p>
    </div>
  );
};

export default App;
