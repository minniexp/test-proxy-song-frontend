   // src/App.js
   import React, { useState, useEffect } from 'react';
   import axios from 'axios';

   function App() {
     const [audio] = useState(new Audio());
     const [audioUrl, setAudioUrl] = useState('');

     const playAudio = () => {
       if (audioUrl) {
         audio.src = audioUrl;
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
          const response = await axios.get(`${process.env.SERVER}/api/playlist/1313621735`); // Specify the full URL with port 3003
          console.log("data:", JSON.stringify(response.data));

          let responseData = response.data.tracks.data.filter(track => track.preview.length > 0).map((track, index) => ({
            key: index,
            id: track.id,
            audio: track.preview,
            title: track.title,
            artist: track.artist.name,
            image: track.album.cover
          }));

          console.log("responseData:", responseData);

          // Set the audio URL of the first track
          if (responseData.length > 0) {
            setAudioUrl(responseData[0].audio);
          }
        } catch (error) {
          console.error("Error fetching playlist data: ", error);
        }
      };
    
      fetchPlaylistData();
    }, []);
     return (
       <div className="App">
         <h1>Deezer Audio Proxy</h1>
         <button onClick={playAudio}>Play Audio</button>
         <button onClick={stopAudio}>Stop Audio</button>
       </div>
     );
   }

   export default App;
