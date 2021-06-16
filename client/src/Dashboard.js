import { useState, useEffect } from "react"
import useAuth from "./useAuth"
import Player from "./Player"
import PlaylistSearchResult from "./PlaylistSearchResult"
import { Container, Form } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import "./index.css"

const spotifyApi = new SpotifyWebApi({
  clientId: "97a04a9367884987bc1c00c11913e2f9",
})

export default function Dashboard({ code }) {
  const accessToken = useAuth(code)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [playlist, setPlaylist] = useState()
  const [playerState, setPlayerState] = useState()
  const [playingTrack, setPlayingTrack] = useState()
  const [score, setScore] = useState(0)
  const [shuffle, setShuffle] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [guess, setGuess] = useState(false)
  const [blurFilter, setBlurFilter] = useState('blur(0px)')

  function choosePlaylist(curPlaylist) {
    setPlaylist(curPlaylist)
    setSearch("")
  }

  function playingCallback(state) {
    setPlayerState(state)
    if (playerState?.isPlaying && !shuffle) {
      setShuffle(true)
      spotifyApi.setShuffle(true)
      spotifyApi.skipToNext()
    }
  }

  function handleClick(pass) {
    if (pass) setScore(score+1)
    setGuess(false)
    spotifyApi.skipToNext()
  }

  useEffect(() => {
    if (!playerState?.track?.name) return
    if (!accessToken) return

    spotifyApi.getTrack(playerState?.track?.id).then(res => {      
      setPlayingTrack( () => {
        const largestImage = res.body.album.images.reduce(
          (largest, image) => {
            if (image.height > largest.height) return image
            return largest
          },
          res.body.album.images[0]
        )

        return {
          artist: res.body.artists[0].name,
          title: res.body.name,
          uri: res.body.uri,
          imageUrl: largestImage.url,
        }
      })
    })
  }, [playerState, accessToken])

  useEffect(() => {
    if (!playlist) return

  }, [playlist])

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if (!search) return setSearchResults([])
    if (!accessToken) return

    let cancel = false
    spotifyApi.searchPlaylists(search).then(res => {
      if (cancel) return
      setSearchResults(
        res.body.playlists.items.map(playlist => {
          const smallestImage = playlist.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image
              return smallest
            },
            playlist.images[0]
          )

          const largestImage = playlist.images.reduce(
            (largest, image) => {
              if (image.height > largest.height) return image
              return largest
            },
            playlist.images[0]
          )

          return {
            artist: playlist.owner.displayName,
            title: playlist.name,
            uri: playlist.uri,
            playlistUri: smallestImage?.url,
            largeImg: largestImage?.url
          }
        })
      )
    })

    return () => (cancel = true)
  }, [search, accessToken])

  return (
    <Container  style={{ height: "100vh" }}>
      <div className="d-flex flex-column py-2" style={{height: '100vh', filter: blurFilter}}>
        <Form.Control
          type="search"
          placeholder="Search Songs/Artists"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{background: '#212121', color: '#fff', border: 'none'}}
        />
        <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
          {searchResults.map(playlist => (
            <PlaylistSearchResult
              playlist={playlist}
              key={playlist.uri}
              choosePlaylist={choosePlaylist}
            />
          ))}
          {searchResults.length === 0 && (
            <div className="text-center" style={{ whiteSpace: "pre", height: '100%'}}>
              <div className="playlistImgBg px-4">
                <div style={{background: "inherit", backgroundImage: `url(${playingTrack?.imageUrl})`, filter: "blur(10px)", opacity: .75, position: "absolute", width: "100%", height: "100%"}}></div>
                <img className="playlistImg" src={playingTrack?.imageUrl} />
              </div>
            </div>
          )}
        </div>
        <div className="info text-center mb-5"><button className="btn btn-success btn-lg" style={{background: '#1db954', borderRadius: "100vw"}} onClick={() => {setShowInfo(true);setBlurFilter('blur(10px)')}}>How to play Shotify</button></div>
        {playingTrack && (<div className="d-flex flex-column text-center mb-5">
          <p><strong>Score:</strong> {score}</p>
          <div>
            {guess ? 
              <div>
                <p><strong>{playingTrack?.title}</strong> by <strong>{playingTrack?.artist}</strong></p>
                <button className="scoreButton mr-2" onClick={() => {handleClick(true)}}>&#10004;</button>
                <button className="scoreButton" onClick={() => {handleClick(false)}}>&#10060;</button> 
              </div>
              :
              <button className="btn btn-success btn-lg" style={{background: '#1db954', borderRadius: "100vw"}} onClick={() => {setGuess(true)}}>Show Answer</button>
            }
            </div>
        </div>)}
        <div>
          <Player callback={playingCallback} accessToken={accessToken} playlistUri={playlist?.uri} />
        </div>
      </div>
      {showInfo && (
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
              <button className="btn btn-success btn-lg" style={{background: '#1db954', borderRadius: "100vw"}} onClick={() => {setShowInfo(false); setBlurFilter('blur(0px)')}}>Back to Shotify</button>
              </div>
          </div>
        </div>
      )}
    </Container>
  )
}
