const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3002;

app.post('/notify', (req, res) => {
  const { deviceId, message } = req.body;
  if (!deviceId || !message) {
    return res.status(400).json({ error: 'Faltan deviceId o message' });
  }

  // Simulación de envío de notificación
  console.log(`✅ [Notificador] Notificando al dispositivo ${deviceId}: "${message}"`);
  // Normalmente aquí iría la lógica real de un push (Firebase, APNs, etc.)
  res.json({ status: 'ok', deliveredTo: deviceId });
});

app.listen(PORT, () => {
  console.log(`🚀 Notificador corriendo en http://0.0.0.0:${PORT}`);
});
