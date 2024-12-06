import React, { useEffect, useState } from 'react';

const MatchInfo = () => {
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    // Получаем данные с backend
    fetch('/api/gsi')
      .then(response => response.json())
      .then(data => setMatchData(data))
      .catch(error => console.error('Error loading match data:', error));
  }, []);

  if (!matchData) return <div>Loading...</div>;

  return (
    <div className="match-info">
      {matchData.map((match, index) => (
        <div key={index} className="match">
          <h2>Map: {match.map} | Round: {match.round}</h2>
          <h3>Phase: {match.phase}</h3>
          <div className="teams">
            <div className="team">
              <h4>{match.teams.ct.name} - {match.teams.ct.score}</h4>
            </div>
            <div className="team">
              <h4>{match.teams.t.name} - {match.teams.t.score}</h4>
            </div>
          </div>

          <h3>Players:</h3>
          <div className="players">
            {match.players.map(player => (
              <div key={player.steamid} className="player">
                <h4>{player.name} ({player.team})</h4>
                <p>Kills: {player.kills} | Deaths: {player.deaths} | Score: {player.score}</p>
                <p>Weapons: {player.weapons.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchInfo;
