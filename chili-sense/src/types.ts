export type SensorStatus = 'AMAN' | 'WASPADA' | 'BAHAYA';

export type SensorReading = {
  id: string;
  device_id: string;
  temperature: number;
  humidity: number;
  light: number;
  light_unit: string;
  timestamp: string;
  sensor_valid: boolean;
  status?: SensorStatus;
  statusReason?: string;
};

export type DeviceStatus = {
  device_id: string;
  online: boolean;
  wifi_status: string;
  server_status: string;
  last_read: string;
  sensor_valid: boolean;
  mode: 'DEMO' | 'LIVE';
};

export type AlertItem = {
  level: 'success' | 'warning' | 'danger' | 'neutral';
  title: string;
  detail: string;
  recommendation: string;
  timestamp: string;
};

export type ThresholdConfig = {
  temperatureMin: number;
  temperatureMax: number;
  humidityMin: number;
  humidityMax: number;
  lightMin: number;
  lightMax: number;
};
