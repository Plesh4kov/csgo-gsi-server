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
  const token = req.body.auth?.token;

  // Проверка токена
  if (!token) {
    return res.status(400).json({ error: 'Token not provided' });
  }

  if (token !== 'your-secret-token') {
    return res.status(403).json({ error: 'Invalid token' });
  }

  // Сохранение данных GSI
  console.log('GSI Data Received:', req.body);
  latestGSIData = req.body;

  res.status(200).json({ success: true, message: 'Data received' });
});

// Маршрут для получения таблицы результатов (Scoreboard)
app.get('/api/scoreboard', (req, res) => {
  if (!latestGSIData || !latestGSIData.map || !latestGSIData.allplayers) {
    return res.status(404).json({ error: 'No scoreboard data available' });
  }

  // Извлекаем названия команд и счёт
  const team1 = latestGSIData.map.team_ct?.name || 'Counter-Terrorists';
  const team2 = latestGSIData.map.team_t?.name || 'Terrorists';
  const scoreCT = latestGSIData.map.team_ct?.score || 0;
  const scoreT = latestGSIData.map.team_t?.score || 0;

  // Формируем данные для скорборда
  const scoreboard = {
    team1: {
      name: team1,
      score: scoreCT,
    },
    team2: {
      name: team2,
      score: scoreT,
    },
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
      damage: player.state?.round_totaldmg || 0,
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
