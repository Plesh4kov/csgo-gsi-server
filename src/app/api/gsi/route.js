const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware для обработки JSON
app.use(bodyParser.json());

// Переменная для хранения последних данных GSI
let latestGSIData = {};

// Корневой маршрут
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the CS:GO GSI Server!',
    endpoints: {
      gsi: '/api/gsi',
      scoreboard: '/api/scoreboard',
    },
  });
});

// Маршрут для получения GSI-данных
app.post('/api/gsi', (req, res) => {
  console.log('Received GSI data:', req.body);

  // Сохранение данных GSI
  latestGSIData = req.body;

  res.status(200).json({ success: true, message: 'GSI data received' });
});

// Маршрут для получения таблицы результатов (Scoreboard)
app.get('/api/scoreboard', (req, res) => {
  if (!latestGSIData || !latestGSIData.map || !latestGSIData.allplayers) {
    return res.status(404).json({ error: 'No scoreboard data available' });
  }

  const team1 = latestGSIData.map.team_ct || 'Counter-Terrorists';
  const team2 = latestGSIData.map.team_t || 'Terrorists';
  const scoreCT = latestGSIData.map.team_ct_score || 0;
  const scoreT = latestGSIData.map.team_t_score || 0;

  const scoreboard = {
    team1: { name: team1, score: scoreCT },
    team2: { name: team2, score: scoreT },
    T: [],
    CT: [],
  };

  Object.values(latestGSIData.allplayers).forEach((player) => {
    const playerData = {
      name: player.name,
      kills: player.match_stats.kills,
      deaths: player.match_stats.deaths,
      assists: player.match_stats.assists,
      score: player.match_stats.score,
      damage: player.match_stats.damage || 0,
    };

    if (player.team === 'T') {
      scoreboard.T.push(playerData);
    } else if (player.team === 'CT') {
      scoreboard.CT.push(playerData);
    }
  });

  // Сортировка по убыванию damage
  scoreboard.T.sort((a, b) => b.damage - a.damage);
  scoreboard.CT.sort((a, b) => b.damage - a.damage);

  res.status(200).json(scoreboard);
});

// Экспорт приложения для использования в Vercel
module.exports = app;
