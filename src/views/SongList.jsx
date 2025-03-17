import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";

const SongList = ({ songs }) => {
  const [hoveredSongId, setHoveredSongId] = useState(null);
  const [playingSongId, setPlayingSongId] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);
  const seekbarRef = useRef(null);

  useEffect(() => {
    if (playingSongId && audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [playingSongId]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  const handleMouseEnter = (songId) => {
    setHoveredSongId(songId);
  };

  const handleMouseLeave = () => {
    setHoveredSongId(null);
  };

  const handlePlayPause = (songId) => {
    if (playingSongId === songId) {
      setPlayingSongId(null);
    } else {
      setPlayingSongId(songId);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const seekTime = (e.target.value / audioRef.current.duration) * audioRef.current.duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleMuteToggle = () => {
    setMuted(!muted);
  };

  return (
    <>
      <ul
        style={{
          listStyleType: "none",
          padding: 0,
          marginTop: "20px",
          marginBottom: "80px", // Add space for sticky player
        }}
      >
        {songs?.map((song) => (
          <li
            key={song._id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "15px",
              borderBottom: "1px solid #f0f0f0",
              transition: "background-color 0.3s ease",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8f8f8")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => handleMouseEnter(song._id)}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={song.coverImage}
                alt={song.title}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "5px",
                  marginRight: "15px",
                  objectFit: "cover",
                }}
              />
              {hoveredSongId === song._id && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    borderRadius: "50%",
                    padding: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() => handlePlayPause(song._id)}
                >
                  {playingSongId === song._id ? (
                    <FaPause style={{ color: "white", fontSize: "1.2rem" }} />
                  ) : (
                    <FaPlay style={{ color: "white", fontSize: "1.2rem" }} />
                  )}
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#333" }}>
                {song.title}
              </h3>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                Duration: {Math.floor(song.duration)}:
                {String(Math.floor((song.duration % 60))).padStart(2, "0")}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {playingSongId && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: "#f0f0f0",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            zIndex:"999",
            justifyContent: "center",
            boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          <audio
            ref={audioRef}
            src={songs.find((song) => song._id === playingSongId)?.audioUrls.low}
            onTimeUpdate={handleTimeUpdate}
            style={{ display: "none" }}
          />

          <div style={{ display: "flex", alignItems: "center" }}>
            <button onClick={() => handlePlayPause(playingSongId)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem", marginRight: "10px" }}>
              {audioRef.current?.paused ? <FaPlay /> : <FaPause />}
            </button>
            <input
              type="range"
              ref={seekbarRef}
              min="0"
              max={audioRef.current?.duration || 100}
              value={currentTime}
              onChange={handleSeek}
              style={{ width: "300px", marginRight: "10px" }}
            />
            <span>
              {Math.floor(currentTime / 60)}:
              {String(Math.floor(currentTime % 60)).padStart(2, "0")}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <button onClick={handleMuteToggle} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", marginRight: "5px" }}>
              {muted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              style={{ width: "100px" }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SongList;