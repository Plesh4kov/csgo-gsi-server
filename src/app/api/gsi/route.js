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
  const teamCT = latestGSIData.map.team_ct || {};
  const teamT = latestGSIData.map.team_t || {};

  const scoreboard = {
    team1: {
      name: teamCT.name || 'Counter-Terrorists',
      score: teamCT.score || 0,
    },
    team2: {
      name: teamT.name || 'Terrorists',
      score: teamT.score || 0,
    },
    T: [],
    CT: [],
  };

  // Формируем список игроков
  Object.values(latestGSIData.allplayers).forEach((player) => {
    const playerData = {
      name: player.name || 'Unknown',
      kills: player.match_stats.kills || 0,
      deaths: player.match_stats.deaths || 0,
      assists: player.match_stats.assists || 0,
      score: player.match_stats.score || 0,
      damage: player.state.round_totaldmg || 0,
      money: player.state.money || 0,
      equipValue: player.state.equip_value || 0,
    };

    if (player.team === 'T') {
      scoreboard.T.push(playerData);
    } else if (player.team === 'CT') {
      scoreboard.CT.push(playerData);
    }
  });

  // Сортировка игроков по убыванию damage
  scoreboard.T.sort((a, b) => b.damage - a.damage);
  scoreboard.CT.sort((a, b) => b.damage - a.damage);

  res.status(200).json(scoreboard);
});

// Экспорт приложения для использования в Vercel
module.exports = app;
