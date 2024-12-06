const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware для обработки JSON
app.use(bodyParser.json());

// Обработка маршрута для получения GSI данных
app.post('/api/gsi', (req, res) => {
  // Логируем запрос для отладки
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);

  // Проверка: Есть ли тело запроса
  if (!req.body) {
    console.error('No body found in request');
    return res.status(400).json({ error: 'Bad Request: No body found' });
  }

  // Извлечение токена из тела запроса
  const token = req.body.auth?.token;

  // Проверка токена
  if (!token) {
    console.error('Token not provided');
    return res.status(400).json({ error: 'Bad Request: Token not provided' });
  }

  if (token !== 'your-secret-token') {
    console.error('Invalid token:', token);
    return res.status(403).json({ error: 'Invalid token' });
  }

  // Логика обработки данных (вывод данных в консоль)
  console.log('GSI Data Received:', req.body);

  // Возвращаем успешный ответ
  res.status(200).json({ success: true, message: 'Data received successfully' });
});

// Обработка маршрута для проверки работоспособности сервера
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
