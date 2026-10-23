import type { SensorReading, SensorStatus, ThresholdConfig } from '../types';

export const evaluateStatus = (
  reading: Pick<SensorReading, 'temperature' | 'humidity' | 'light'>,
  config: ThresholdConfig,
): { status: SensorStatus; reason: string } => {
  const issues: string[] = [];

  if (reading.temperature < config.temperatureMin) {
    issues.push(`Suhu terlalu rendah, yaitu ${reading.temperature.toFixed(1)}°C`);
  } else if (reading.temperature > config.temperatureMax) {
    issues.push(`Suhu terlalu tinggi, yaitu ${reading.temperature.toFixed(1)}°C`);
  }

  if (reading.humidity < config.humidityMin) {
    issues.push(`Kelembapan terlalu rendah, yaitu ${reading.humidity}% RH`);
  } else if (reading.humidity > config.humidityMax) {
    issues.push(`Kelembapan terlalu tinggi, yaitu ${reading.humidity}% RH`);
  }

  if (reading.light < config.lightMin) {
    issues.push(`Intensitas cahaya terlalu rendah, yaitu ${Math.round(reading.light).toLocaleString()} lux`);
  } else if (reading.light > config.lightMax) {
    issues.push(`Intensitas cahaya terlalu tinggi, yaitu ${Math.round(reading.light).toLocaleString()} lux`);
  }

  if (issues.length === 0) {
    return {
      status: 'AMAN',
      reason: 'Semua parameter berada dalam rentang target.',
    };
  }

  if (issues.length === 1) {
    return {
      status: 'WASPADA',
      reason: issues[0],
    };
  }

  return {
    status: 'BAHAYA',
    reason: issues.slice(0, 2).join(' dan '),
  };
};

export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

export const formatShortDate = (value: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  }).format(new Date(value));
