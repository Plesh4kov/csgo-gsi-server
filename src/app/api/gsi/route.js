const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware для обработки JSON
app.use(bodyParser.json());

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

// Обработка GSI данных
let latestGSIData = {}; // Хранение последних данных

app.post('/api/gsi', (req, res) => {
  const token = req.body.auth?.token;

  // Проверка токена
  if (!token) {
    return res.status(400).json({ error: 'Token not provided' });
  }

  if (token !== 'your-secret-token') {
    return res.status(403).json({ error: 'Invalid token' });
  }

  // Логирование данных для отладки
  console.log('GSI Data Received:', req.body);

  // Сохраняем последние данные GSI
  latestGSIData = req.body;

  res.status(200).json({ success: true, message: 'Data received' });
});

// Вывод данных Scoreboard
app.get('/api/scoreboard', (req, res) => {
  if (!latestGSIData || !latestGSIData.allplayers) {
    return res.status(404).json({ error: 'No scoreboard data available' });
  }

  const scoreboard = Object.values(latestGSIData.allplayers).map((player) => ({
    name: player.name,
    kills: player.match_stats.kills,
    deaths: player.match_stats.deaths,
    assists: player.match_stats.assists,
    score: player.match_stats.score
  }));

  res.status(200).json({ scoreboard });
});

// Экспорт для Vercel
module.exports = app;
