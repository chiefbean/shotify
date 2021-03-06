import React from "react"

export default function PlaylistSearchResult({ playlist, choosePlaylist }) {
  function handlePlay() {
    choosePlaylist(playlist)
  }

  return (
    <div
      className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      <img src={playlist.playlistUri} style={{ height: "64px", width: "64px" }} />
      <div className="ml-3">
        <div>{playlist.title}</div>
        <div className="text-muted">{playlist.artist}</div>
      </div>
    </div>
  )
}
