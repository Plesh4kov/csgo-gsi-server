const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware для обработки JSON
app.use(bodyParser.json());

// Корневой маршрут (для отображения статуса сервера)
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is ready to receive GSI data!' });
});

// Обработка маршрута для GSI данных
app.post('/api/gsi', (req, res) => {
  const token = req.body.auth?.token;

  // Проверка наличия токена
  if (!token) {
    console.error('Token not provided');
    return res.status(400).json({ error: 'Token not provided' });
  }

  // Проверка корректности токена
  if (token !== 'your-secret-token') {
    console.error('Invalid token:', token);
    return res.status(403).json({ error: 'Invalid token' });
  }

  // Логирование данных для отладки
  console.log('GSI Data Received:', req.body);

  // Ответ клиенту
  res.status(200).json({ success: true, data: req.body });
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
