const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware для обработки JSON
app.use(bodyParser.json());

// Корневой маршрут
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is ready to receive GSI data!' });
});

// Обработка GSI данных
app.post('/api/gsi', (req, res) => {
  const token = req.body.auth?.token;

  if (!token) {
    return res.status(400).json({ error: 'Token not provided' });
  }

  if (token !== 'your-secret-token') {
    return res.status(403).json({ error: 'Invalid token' });
  }

  console.log('GSI Data Received:', req.body);

  res.status(200).json({ success: true, data: req.body });
});

module.exports = app;
