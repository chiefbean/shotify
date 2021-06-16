import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"
import './index.js'

export default function Player({ callback, accessToken, playlistUri }) {
  const [play, setPlay] = useState(false)

  useEffect(() => setPlay(true), [playlistUri])
  
  if (!accessToken) return null
  return (
      <SpotifyPlayer
        token={accessToken}
        callback={state => {
          if (!state.isPlaying) setPlay(false)
          callback(state)
        }}
        play={play}
        uris={playlistUri ? [playlistUri] : []}
        styles = {{ 
          color: '#fff',
          bgColor: '#212121',
          trackNameColor: '#212121',
          trackArtistColor: '#212121',
          sliderHandleColor: '#fff',
          sliderColor: '#1db954'
        }}
        className="player"
      />
  )
}
