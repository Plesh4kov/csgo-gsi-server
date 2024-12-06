const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware для обработки JSON
app.use(bodyParser.json());

// Переменная для хранения последних данных GSI
let latestGSIData = {};

// Корневой маршрут
app.get('/', (req, res) => {
  console.log('GET / - Root endpoint hit');
  res.status(200).json({
    message: 'Welcome to the CS:GO GSI Server!',
    endpoints: {
      gsi: '/api/gsi',
      scoreboard: '/api/scoreboard'
    }
  });
});

// Маршрут для получения GSI-данных (без проверки токена)
app.post('/api/gsi', (req, res) => {
  // Логирование данных для отладки
  console.log('POST /api/gsi - GSI Data Received:', req.body);

  // Сохранение данных GSI
  latestGSIData = req.body;

  res.status(200).json({ success: true, message: 'Data received' });
});

// Маршрут для получения таблицы результатов (Scoreboard)
app.get('/api/scoreboard', (req, res) => {
  console.log('GET /api/scoreboard hit');

  if (!latestGSIData || !latestGSIData.allplayers) {
    console.log('GET /api/scoreboard - No scoreboard data available');
    return res.status(404).json({ error: 'No scoreboard data available' });
  }

  const scoreboard = Object.values(latestGSIData.allplayers).map((player) => ({
    name: player.name,
    kills: player.match_stats.kills,
    deaths: player.match_stats.deaths,
    assists: player.match_stats.assists,
    score: player.match_stats.score
  }));

  console.log('GET /api/scoreboard - Scoreboard data:', scoreboard);

  res.status(200).json({ scoreboard });
});

// Экспорт приложения для использования в Vercel
module.exports = app;
