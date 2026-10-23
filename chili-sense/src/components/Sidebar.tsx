import {
  Activity,
  Bell,
  Gauge,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Sprout,
  TimerReset,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Monitoring Sensor', icon: Activity },
  { label: 'Analisis Lingkungan', icon: Gauge },
  { label: 'Riwayat Data', icon: TimerReset },
  { label: 'Status Tanaman', icon: Sprout },
  { label: 'Pengaturan', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-row">
        <div className="brand-icon"><ShieldCheck size={18} /></div>
        <div>
          <div className="brand-name">CHILI SENSE</div>
          <div className="brand-subtitle">Smart Chili Monitoring</div>
        </div>
      </div>

      <nav className="nav-menu" aria-label="Sidebar navigation">
        {navItems.map(({ label, icon: Icon }) => (
          <button type="button" key={label} className={`nav-item ${label === 'Dashboard' ? 'active' : ''}`}>
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="system-card">
        <div className="system-label">Notifikasi</div>
        <div className="notification-pill">
          <Bell size={15} />
          <span>3 peringatan aktif</span>
        </div>
      </div>
    </aside>
  );
}
