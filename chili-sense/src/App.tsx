import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  CloudSun,
  Droplets,
  Leaf,
  Search,
  Settings2,
  SunMedium,
  Thermometer,
  Wifi,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Sidebar } from './components/Sidebar';
import {
  DEFAULT_THRESHOLDS,
  demoAlerts,
  demoDeviceStatus,
  generateDemoHistory,
} from './data/demoData';
import { evaluateStatus, formatDateTime } from './lib/sensor';
import type { AlertItem, DeviceStatus, SensorReading, SensorStatus, ThresholdConfig } from './types';
import './App.css';

const chartWindowOptions = ['1 Jam', '6 Jam', '24 Jam', '7 Hari', '30 Hari'];

const getStatusColor = (status: SensorStatus | string) => {
  if (status === 'AMAN') return 'green';
  if (status === 'WASPADA') return 'amber';
  if (status === 'BAHAYA') return 'red';
  return 'slate';
};

const getAlertTone = (level: AlertItem['level']) => {
  if (level === 'success') return 'success';
  if (level === 'warning') return 'warning';
  if (level === 'danger') return 'danger';
  return 'neutral';
};

function App() {
  const [thresholds, setThresholds] = useState<ThresholdConfig>(DEFAULT_THRESHOLDS);
  const [mode, setMode] = useState<'DEMO' | 'LIVE'>('DEMO');
  const [selectedWindow, setSelectedWindow] = useState('24 Jam');
  const [history] = useState<SensorReading[]>(() => generateDemoHistory());
  const [alerts] = useState<AlertItem[]>(demoAlerts);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>(demoDeviceStatus);

  const latestReading = useMemo(() => {
    const base = history[history.length - 1] ?? {
      id: 'demo-latest',
      device_id: 'CHILI-001',
      temperature: 28.4,
      humidity: 70,
      light: 24000,
      light_unit: 'lux',
      timestamp: new Date().toISOString(),
      sensor_valid: true,
    };

    const evaluated = evaluateStatus(base, thresholds);
    return {
      ...base,
      ...evaluated,
      status: evaluated.status,
      reason: evaluated.reason,
    };
  }, [history, thresholds]);

  const chartData = useMemo(
    () =>
      history.map((item) => ({
        label: new Date(item.timestamp).toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        temperature: item.temperature,
        humidity: item.humidity,
        light: item.light / 1000,
      })),
    [history],
  );

  const summary = useMemo(() => {
    const count = history.length || 1;
    const avgTemp = history.reduce((sum, item) => sum + item.temperature, 0) / count;
    const avgHumidity = history.reduce((sum, item) => sum + item.humidity, 0) / count;
    const avgLight = history.reduce((sum, item) => sum + item.light, 0) / count;
    const warningCount = history.filter((item) => evaluateStatus(item, thresholds).status === 'WASPADA').length;
    const dangerCount = history.filter((item) => evaluateStatus(item, thresholds).status === 'BAHAYA').length;

    return {
      avgTemp: avgTemp.toFixed(1),
      avgHumidity: avgHumidity.toFixed(0),
      avgLight: avgLight.toFixed(0),
      warningCount,
      dangerCount,
    };
  }, [history, thresholds]);

  const metrics = [
    {
      title: 'Suhu Udara',
      value: `${latestReading.temperature.toFixed(1)}°C`,
      icon: Thermometer,
      tone: 'orange',
      status:
        latestReading.temperature >= thresholds.temperatureMin &&
        latestReading.temperature <= thresholds.temperatureMax
          ? 'Normal'
          : 'Tidak optimal',
      updatedAt: formatDateTime(latestReading.timestamp),
    },
    {
      title: 'Kelembapan Udara',
      value: `${latestReading.humidity}% RH`,
      icon: Droplets,
      tone: 'cyan',
      status:
        latestReading.humidity >= thresholds.humidityMin &&
        latestReading.humidity <= thresholds.humidityMax
          ? 'Normal'
          : 'Tidak optimal',
      updatedAt: formatDateTime(latestReading.timestamp),
    },
    {
      title: 'Intensitas Cahaya',
      value: `${Math.round(latestReading.light).toLocaleString()} lux`,
      icon: SunMedium,
      tone: 'green',
      status:
        latestReading.light >= thresholds.lightMin && latestReading.light <= thresholds.lightMax
          ? 'Normal'
          : 'Tidak optimal',
      updatedAt: formatDateTime(latestReading.timestamp),
    },
    {
      title: 'Status Tanaman',
      value: latestReading.status ?? 'AMAN',
      icon: Leaf,
      tone: getStatusColor(latestReading.status ?? 'AMAN'),
      status: latestReading.reason ?? 'Semua parameter berada dalam rentang target.',
      updatedAt: formatDateTime(latestReading.timestamp),
    },
  ];

  const handleThresholdChange = (field: keyof ThresholdConfig, value: number) => {
    setThresholds((prev) => ({ ...prev, [field]: value }));
  };

  const handleModeToggle = () => {
    setMode((current) => (current === 'DEMO' ? 'LIVE' : 'DEMO'));
    setDeviceStatus((prev) => ({
      ...prev,
      mode: prev.mode === 'DEMO' ? 'LIVE' : 'DEMO',
      online: prev.mode === 'DEMO',
      wifi_status: prev.mode === 'DEMO' ? 'Connected' : 'Demo mode',
      server_status: prev.mode === 'DEMO' ? 'Connected' : 'Demo mode',
    }));
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-panel">
        <header className="topbar">
          <div className="search-box">
            <Search size={16} />
            <input type="text" placeholder="Cari kondisi tanaman..." aria-label="Cari" />
          </div>

          <div className="topbar-actions">
            <div className={`device-status ${deviceStatus.online ? 'online' : 'offline'}`}>
              <Wifi size={14} />
              <span>{deviceStatus.online ? 'Device online' : 'Offline'}</span>
            </div>

            <button type="button" className="ghost-button" onClick={handleModeToggle}>
              <span className="mode-dot" />
              {mode}
            </button>

            <button type="button" className="icon-button" aria-label="Notifikasi">
              <Bell size={16} />
            </button>

            <div className="user-profile">
              <div className="avatar">AH</div>
              <div>
                <strong>Ahmad Hadi</strong>
                <small>Operator Greenhouse</small>
              </div>
            </div>
          </div>
        </header>

        <section className="hero-section">
          <div>
            <p className="eyebrow">CHILI SENSE — Smart Chili Monitoring System</p>
            <h1>Dashboard kondisi tanaman cabai</h1>
            <p className="subtitle">
              Monitoring real-time suhu, kelembapan, dan intensitas cahaya untuk menjaga
              kondisi pertumbuhan optimal.
            </p>
          </div>

          <div className="hero-actions">
            <button type="button" className="primary-button">
              Lihat rekomendasi
            </button>
            <button type="button" className="secondary-button">
              Ekspor laporan
            </button>
          </div>
        </section>

        <section className="metrics-grid">
          {metrics.map(({ title, value, icon: Icon, tone, status, updatedAt }) => (
            <div key={title} className="metric-card">
              <div className="metric-topline">
                <div className={`metric-icon ${tone}`}>
                  <Icon size={18} />
                </div>
                <div className="metric-badge">{title === 'Status Tanaman' ? 'Status' : 'Normal'}</div>
              </div>
              <div className="metric-label">{title}</div>
              <div className="metric-value">{value}</div>
              <div className="metric-status-row">
                <span>{status}</span>
                <small>{updatedAt}</small>
              </div>
            </div>
          ))}
        </section>

        <section className="content-grid">
          <div className="panel chart-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow small">Kondisi lingkungan</p>
                <h2>Trend sensor</h2>
              </div>

              <div className="filter-group">
                {chartWindowOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={selectedWindow === option ? 'chip active' : 'chip'}
                    onClick={() => setSelectedWindow(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="chart-card">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="humidityFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#21b26a" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#21b26a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="temperature" stroke="#f59e0b" fill="url(#tempFill)" strokeWidth={3} />
                  <Area type="monotone" dataKey="humidity" stroke="#1f5138" fill="url(#humidityFill)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel plant-panel">
            <div className="panel-header compact">
              <div>
                <p className="eyebrow small">Visualisasi tanaman</p>
                <h2>Ringkasan kondisi</h2>
              </div>
            </div>

            <div className="plant-visual">
              <div className="plant-figure">
                <div className="plant-model">
                  <div className="stem" />
                  <div className="leaf leaf-one" />
                  <div className="leaf leaf-two" />
                  <div className="leaf leaf-three" />
                  <div className="fruit fruit-one" />
                  <div className="fruit fruit-two" />
                </div>
              </div>

              <div className="plant-insights">
                <div className="insight-item">
                  <span className="status-dot safe" />
                  <div>
                    <strong>Lingkungan</strong>
                    <small>{latestReading.reason}</small>
                  </div>
                </div>
                <div className="insight-item">
                  <span className="status-dot warning" />
                  <div>
                    <strong>Rekomendasi</strong>
                    <small>Periksa ventilasi dan penyesuaian naungan saat intensitas cahaya berlebihan.</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="secondary-grid">
          <div className="panel">
            <div className="panel-header compact">
              <div>
                <p className="eyebrow small">Sistem notifikasi</p>
                <h2>Event terkini</h2>
              </div>
            </div>

            <div className="alert-list">
              {alerts.map((alert) => (
                <div key={`${alert.title}-${alert.timestamp}`} className={`alert-item ${getAlertTone(alert.level)}`}>
                  <div className="alert-icon">
                    {alert.level === 'danger' ? (
                      <AlertTriangle size={16} />
                    ) : alert.level === 'warning' ? (
                      <CloudSun size={16} />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                  </div>
                  <div className="alert-copy">
                    <div className="alert-topline">
                      <strong>{alert.title}</strong>
                      <span>
                        {new Date(alert.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p>{alert.detail}</p>
                    <small>{alert.recommendation}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header compact">
              <div>
                <p className="eyebrow small">Data historis</p>
                <h2>Ringkasan analitik</h2>
              </div>
            </div>

            <div className="stats-summary">
              <div className="stat-box">
                <span>Rata-rata suhu</span>
                <strong>{summary.avgTemp}°C</strong>
              </div>
              <div className="stat-box">
                <span>Rata-rata RH</span>
                <strong>{summary.avgHumidity}%</strong>
              </div>
              <div className="stat-box">
                <span>Rata-rata cahaya</span>
                <strong>{summary.avgLight} lux</strong>
              </div>
              <div className="stat-box">
                <span>WASPADA</span>
                <strong>{summary.warningCount}</strong>
              </div>
              <div className="stat-box">
                <span>BAHAYA</span>
                <strong>{summary.dangerCount}</strong>
              </div>
            </div>

            <div className="chart-card mini-chart">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="light" stroke="#1f5138" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="settings-panel panel">
          <div className="panel-header compact">
            <div>
              <p className="eyebrow small">Pengaturan sensor</p>
              <h2>Threshold prototipe</h2>
            </div>
            <button type="button" className="icon-button small-btn" aria-label="Pengaturan">
              <Settings2 size={16} />
            </button>
          </div>

          <div className="settings-grid">
            <label>
              <span>Suhu min</span>
              <input
                type="number"
                value={thresholds.temperatureMin}
                onChange={(e) => handleThresholdChange('temperatureMin', Number(e.target.value))}
              />
            </label>
            <label>
              <span>Suhu max</span>
              <input
                type="number"
                value={thresholds.temperatureMax}
                onChange={(e) => handleThresholdChange('temperatureMax', Number(e.target.value))}
              />
            </label>
            <label>
              <span>RH min</span>
              <input
                type="number"
                value={thresholds.humidityMin}
                onChange={(e) => handleThresholdChange('humidityMin', Number(e.target.value))}
              />
            </label>
            <label>
              <span>RH max</span>
              <input
                type="number"
                value={thresholds.humidityMax}
                onChange={(e) => handleThresholdChange('humidityMax', Number(e.target.value))}
              />
            </label>
            <label>
              <span>Cahaya min</span>
              <input
                type="number"
                value={thresholds.lightMin}
                onChange={(e) => handleThresholdChange('lightMin', Number(e.target.value))}
              />
            </label>
            <label>
              <span>Cahaya max</span>
              <input
                type="number"
                value={thresholds.lightMax}
                onChange={(e) => handleThresholdChange('lightMax', Number(e.target.value))}
              />
            </label>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
