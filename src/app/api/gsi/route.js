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
  const team1 = latestGSIData.map.team_ct || 'Counter-Terrorists';
  const team2 = latestGSIData.map.team_t || 'Terrorists';
  const scoreCT = latestGSIData.map.team_ct_score || 0;
  const scoreT = latestGSIData.map.team_t_score || 0;

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

  // Проверка и обработка игроков
  if (latestGSIData.allplayers) {
    Object.values(latestGSIData.allplayers).forEach((player) => {
      const playerData = {
        name: player.name || 'Unknown',
        kills: player.match_stats.kills || 0,
        deaths: player.match_stats.deaths || 0,
        assists: player.match_stats.assists || 0,
        score: player.match_stats.score || 0,
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
  }

  res.status(200).json(scoreboard);
});

// Обработчик несуществующих маршрутов
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Экспорт приложения для использования в Vercel
module.exports = app;
