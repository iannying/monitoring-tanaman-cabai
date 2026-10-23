import express from 'express';
import cors from 'cors';

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const history = [
  {
    device_id: 'CHILI-001',
    temperature: 28.2,
    humidity: 72,
    light: 24800,
    light_unit: 'lux',
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    sensor_valid: true,
  },
  {
    device_id: 'CHILI-001',
    temperature: 29.1,
    humidity: 68,
    light: 26600,
    light_unit: 'lux',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    sensor_valid: true,
  },
  {
    device_id: 'CHILI-001',
    temperature: 27.6,
    humidity: 71,
    light: 23400,
    light_unit: 'lux',
    timestamp: new Date().toISOString(),
    sensor_valid: true,
  },
];

const deviceStatus = {
  device_id: 'CHILI-001',
  online: true,
  wifi_status: 'Connected',
  server_status: 'Connected',
  last_read: new Date().toISOString(),
  sensor_valid: true,
  mode: 'LIVE',
};

const buildAlert = (reading) => {
  const alerts = [];

  if (reading.temperature < 24 || reading.temperature > 30) {
    alerts.push({
      level: 'warning',
      title: 'Suhu tidak optimal',
      detail: `Suhu ${reading.temperature.toFixed(1)}°C berada di luar rentang target.`,
      recommendation: 'Periksa ventilasi dan naungan agar suhu tetap pada rentang 24–30°C.',
      timestamp: reading.timestamp,
    });
  }

  if (reading.humidity < 60 || reading.humidity > 85) {
    alerts.push({
      level: 'danger',
      title: 'Kelembapan lingkungan tidak optimal',
      detail: `Kelembapan ${reading.humidity}% RH berada di luar rentang ideal.`,
      recommendation: 'Sesuaikan waktu penyiraman dan tingkat ventilasi untuk menjaga RH stabil.',
      timestamp: reading.timestamp,
    });
  }

  if (reading.light < 10000 || reading.light > 50000) {
    alerts.push({
      level: 'warning',
      title: 'Cahaya tidak dalam rentang ideal',
      detail: `Intensitas cahaya ${reading.light.toLocaleString()} lux di luar target.`,
      recommendation: 'Pantau paparan sinar matahari dan gunakan naungan jika intensitas terlalu tinggi.',
      timestamp: reading.timestamp,
    });
  }

  if (!reading.sensor_valid) {
    alerts.push({
      level: 'danger',
      title: 'Sensor tidak valid',
      detail: 'Data sensor tidak valid atau tidak lengkap.',
      recommendation: 'Periksa kabel sensor, koneksi DHT22/BH1750, dan restart perangkat IoT.',
      timestamp: reading.timestamp,
    });
  }

  return alerts;
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, status: 'API ready', timestamp: new Date().toISOString() });
});

app.post('/api/sensor-data', (req, res) => {
  const body = req.body || {};

  const reading = {
    device_id: body.device_id || 'CHILI-001',
    temperature: Number(body.temperature ?? 0),
    humidity: Number(body.humidity ?? 0),
    light: Number(body.light ?? 0),
    light_unit: body.light_unit || 'lux',
    timestamp: body.timestamp || new Date().toISOString(),
    sensor_valid: body.sensor_valid ?? true,
  };

  if (!Number.isFinite(reading.temperature) || !Number.isFinite(reading.humidity) || !Number.isFinite(reading.light)) {
    return res.status(400).json({ message: 'Data sensor tidak valid.' });
  }

  history.push(reading);
  deviceStatus.last_read = reading.timestamp;
  deviceStatus.sensor_valid = reading.sensor_valid;
  deviceStatus.online = true;

  res.status(201).json({ ok: true, data: reading });
});

app.get('/api/sensor-data/latest', (_req, res) => {
  const latest = history.at(-1) ?? null;
  res.json({ ok: true, data: latest });
});

app.get('/api/sensor-data/history', (_req, res) => {
  res.json({ ok: true, data: history });
});

app.get('/api/device/status', (_req, res) => {
  res.json({ ok: true, data: deviceStatus });
});

app.get('/api/alerts', (_req, res) => {
  const latest = history.at(-1);
  const allAlerts = latest ? buildAlert(latest) : [];
  res.json({ ok: true, data: allAlerts });
});

app.listen(port, () => {
  console.log(`CHILI SENSE API running on http://localhost:${port}`);
});
