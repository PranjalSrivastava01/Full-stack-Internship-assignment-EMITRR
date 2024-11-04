import React, { useState, useEffect } from 'react';
import "../App.css";
function LeaderBoard({ userName, points }) {
  const [leaderBoardData, setLeaderBoardData] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = () => {
    fetch('https://backend-emittr2-h3ou.onrender.com/api/leaderboard')
      .then((response) => response.json())
      .then((data) => {
        setLeaderBoardData(data);
        const existingUser = data.find((user) => user.username === userName);
        setCurrentUserData(
          existingUser ? existingUser : { username: userName, points, rank: data.length + 1 }
        );
      })
      .catch((error) => console.error('Leaderboard data loading error:', error));
  };

  const resetGame = () => {
    window.location.reload();
  };

  return (
    <div className="leaderboard-section">
      <h2 className="leaderboard-title">Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>User</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderBoardData.slice(0, 5).map((user, index) => (
            <tr key={user.username} className={user.username === userName ? 'highlighted' : ''}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.points}</td>
            </tr>
          ))}
          {currentUserData && currentUserData.rank > 5 && (
            <tr className="highlighted">
              <td>{currentUserData.rank}</td>
              <td>{currentUserData.username}</td>
              <td>{currentUserData.points}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="new-game-btn-container">
        <button
          onClick={resetGame}
          className="new-game-button"
        >
          Start New Game
        </button>
      </div>
    </div>
  );
}

export default LeaderBoard;
