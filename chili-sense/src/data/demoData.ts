import type { AlertItem, DeviceStatus, SensorReading, ThresholdConfig } from '../types';

export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  temperatureMin: 24,
  temperatureMax: 30,
  humidityMin: 60,
  humidityMax: 85,
  lightMin: 10000,
  lightMax: 50000,
};

const now = Date.now();

export const generateDemoHistory = (): SensorReading[] => {
  const data: SensorReading[] = [];
  const points = 30;

  for (let i = points; i >= 0; i -= 1) {
    const time = new Date(now - i * 60 * 60 * 1000).toISOString();
    const temperature = 27 + Math.sin(i / 3) * 2.7 + (i % 5 === 0 ? 2.8 : 0);
    const humidity = 72 + Math.cos(i / 4) * 9 + (i % 3 === 0 ? -7 : 0);
    const light = 24000 + Math.sin(i / 2) * 12000 + (i % 4 === 0 ? 6000 : 0);

    data.push({
      id: `demo-${i}`,
      device_id: 'CHILI-001',
      temperature: Number(temperature.toFixed(1)),
      humidity: Number(humidity.toFixed(0)),
      light: Number(light.toFixed(0)),
      light_unit: 'lux',
      timestamp: time,
      sensor_valid: true,
    });
  }

  return data;
};

export const demoLatestReading: SensorReading = {
  id: 'demo-latest',
  device_id: 'CHILI-001',
  temperature: 31.8,
  humidity: 58,
  light: 68000,
  light_unit: 'lux',
  timestamp: new Date().toISOString(),
  sensor_valid: true,
};

export const demoDeviceStatus: DeviceStatus = {
  device_id: 'CHILI-001',
  online: false,
  wifi_status: 'Demo mode',
  server_status: 'Demo mode',
  last_read: new Date().toISOString(),
  sensor_valid: true,
  mode: 'DEMO',
};

export const demoAlerts: AlertItem[] = [
  {
    level: 'warning',
    title: 'Suhu melebihi ambang',
    detail: 'Suhu 31.8°C berada di atas ambang ideal.',
    recommendation: 'Tingkatkan ventilasi dan pertimbangkan naungan sementara.',
    timestamp: new Date().toISOString(),
  },
  {
    level: 'danger',
    title: 'Kelembapan terlalu rendah',
    detail: 'Kelembapan 58% RH di bawah rentang optimal.',
    recommendation: 'Sesuaikan jadwal penyiraman dan pantau lingkungan sekitar.',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
];
