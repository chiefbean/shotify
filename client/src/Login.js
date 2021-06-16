import React from "react"
import { Container } from "react-bootstrap"

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=97a04a9367884987bc1c00c11913e2f9&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

export default function Login() {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="info-wrapper">
          <div className="info-card">
            <h3>How to Play Shotify</h3>
            <br/>
            <ul>
              <li>Search for a playlist using the search bar at the top.</li>
              <li>While a song plays, see if you can guess the song.</li>
              <li>Click the button to show the song title and artist.</li>
              <li>Click the &#10004; if you were correct or the &#10060; if you were wrong.</li>
              <li>Play with your friends to see who can score the highest!</li>
            </ul>
            <p style={{fontSize: 11}}>*NOTE* Currently, the playlist doesn't start playing shuffled. The game with shuffle for you once you skip the first song.</p>
            <br/>
            <div className="text-center">
              <a className="btn btn-success btn-lg" href={AUTH_URL} style={{background: '#1db954', borderRadius: "100vw"}}>
                Login With Spotify
              </a>
            </div>
          </div>
        </div>
    </Container>
  )
}
