// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [audio] = useState(new Audio());
  const [tracks, setTracks] = useState([]);

  const playAudio = (url) => {
    if (url) {
      audio.src = url;
      audio.play().catch((error) => console.error('Error playing audio:', error));
    } else {
      console.log('No audio URL available');
    }
  };

  const stopAudio = () => {
    audio.pause();
    audio.currentTime = 0; // Reset the audio to the beginning
  };

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/api/playlist/1313621735`);
        console.log("data:", JSON.stringify(response.data));

        let responseData = response.data.tracks.data
          .filter(track => track.preview.length > 0)
          .slice(0, 50) // Get only the top 10 tracks
          .map((track, index) => ({
            key: index,
            id: track.id,
            audio: track.preview,
            title: track.title,
            artist: track.artist.name,
            image: track.album.cover
          }));

        console.log("responseData:", responseData);

        // Set the tracks with audio, title, and artist
        setTracks(responseData);
      } catch (error) {
        console.error("Error fetching playlist data: ", error);
      }
    };

    fetchPlaylistData();
  }, []);

  return (
    <div className="App">
      <h1>Deezer Audio Proxy</h1>
      {tracks.map((track, index) => (
        <div key={index}>
          <p>Audio URL: {track.audio}</p>
          <p>Title: {track.title}</p>
          <p>Artist: {track.artist}</p>
          <button onClick={() => playAudio(track.audio)}>Play Audio {index + 1}</button>
        </div>
      ))}
      <button onClick={stopAudio}>Stop Audio</button>
    </div>
  );
}

export default App;