const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware для обработки JSON
app.use(bodyParser.json());

// Переменная для хранения последнего GSI JSON
let latestGSIData = {};

// Маршрут для получения GSI данных
app.post('/api/gsi', (req, res) => {
  // Логирование для проверки поступающих данных
  console.log('GSI Data Received:', JSON.stringify(req.body, null, 2));

  // Сохраняем полученные данные
  latestGSIData = req.body;

  res.status(200).json({
    success: true,
    message: 'GSI data received',
    data: req.body // Отправляем обратно для проверки
  });
});

// Маршрут для отображения последнего GSI JSON
app.get('/api/latest', (req, res) => {
  if (Object.keys(latestGSIData).length === 0) {
    return res.status(404).json({ error: 'No GSI data available yet' });
  }
  res.status(200).json(latestGSIData);
});

// Экспорт приложения для Vercel
module.exports = app;
