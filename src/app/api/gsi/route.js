const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware для обработки JSON
app.use(bodyParser.json());

// Хранилище для последних данных GSI
let latestGSIData = {};

// Корневой маршрут
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the CS:GO GSI Server!',
    endpoints: {
      gsi: '/api/gsi',
      scoreboard: '/api/scoreboard'
    }
  });
});

// Принимаем GSI данные
app.post('/api/gsi', (req, res) => {
  console.log('POST /api/gsi - Data received:', req.body);
  latestGSIData = req.body; // Сохраняем данные
  res.status(200).json({ success: true, message: 'Data received' });
});

// API для фронтенда: Скорборд
app.get('/api/scoreboard', (req, res) => {
  if (!latestGSIData || !latestGSIData.allplayers) {
    return res.status(404).json({ error: 'No data available' });
  }

  // Формируем данные для скорборда
  const scoreboard = {
    team1: latestGSIData.map.team_ct || 'Counter-Terrorists',
    team2: latestGSIData.map.team_t || 'Terrorists',
    T: [],
    CT: []
  };

  Object.values(latestGSIData.allplayers).forEach((player) => {
    const playerData = {
      name: player.name,
      kills: player.match_stats.kills,
      deaths: player.match_stats.deaths,
      assists: player.match_stats.assists,
      score: player.match_stats.score,
      damage: player.match_stats.damage || 0
    };

    if (player.team === 'T') {
      scoreboard.T.push(playerData);
    } else if (player.team === 'CT') {
      scoreboard.CT.push(playerData);
    }
  });

  res.status(200).json(scoreboard);
});

// Экспорт приложения для использования в Vercel
module.exports = app;
