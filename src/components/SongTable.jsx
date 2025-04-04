import React from "react";
import styles from "@/assets/scss/Tables.module.scss";
import editIcon from "../assets/image/edit.png";
import deleteIcon from "../assets/image/trash.png";

const SongTable = ({ songs, handleEditClick, handleDeleteClick }) => {
  return (
    <div className={`table-responsive ${styles.table_wrapper}`}>
      <table className={`table ${styles.table}`}>
        <thead className={`text-primary thead ${styles.thead}`}>
          <tr>
            <td>Cover image</td>
            <td>Title</td>
            <td>Artist</td>
            <td>Duration</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody className={`tbody ${styles.tbody}`}>
          {songs.map((song, index) => (
            <tr key={index}>
              <td>
                <img
                  src={song?.coverImage}
                  alt="Cover"
                  style={{ width: "50px", height: "50px" }}
                />
              </td>
              <td>{song?.title}</td>
              <td>
                {console.log("artist in song list",song.artist)}
                {Array.isArray(song?.artist)
                  ? song.artist.map((a, index) => (
                      <span key={index}>
                        {a}
                        {index !== song.artist.length - 1 && ", "}
                      </span>
                    ))
                  : song.artist || "Unknown Artist"}
              </td>
              <td>
                {Math.floor(song?.duration)}:
                {String(Math.floor(song?.duration % 60)).padStart(2, "0")}{" "}
                <span style={{ fontSize: "0.8em", opacity: 0.6 }}>min</span>
              </td>
              <td>
                <button onClick={() => handleEditClick(song)}>
                  <img src={editIcon} alt="Edit" />
                </button>
                <button onClick={() => handleDeleteClick(song)}>
                  <img src={deleteIcon} alt="Delete" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SongTable;
