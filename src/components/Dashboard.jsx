import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import MapView from './MapView';
import SOSModal from './SOSModal';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  Flame,
  Award,
  Leaf
} from 'lucide-react';

const Dashboard = () => {
  const { reports, setActiveTab, userPoints, users, currentUser, openAuthModal, setShowReportForm, announcements } = useContext(AppContext);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);

  // Statistics calculation
  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === 'Menunggu').length;
  const inProgressReports = reports.filter(r => r.status === 'Diproses').length;
  const resolvedReports = reports.filter(r => r.status === 'Selesai').length;

  const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;

  // Recent resolved reports or active activities (Filter out resolved SOS reports)
  const recentActivities = reports
    .filter(r => !(r.category === 'Darurat SOS' && r.status === 'Selesai'))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // Sort users for the leaderboard
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  // Category counts for the breakdown chart
  const categories = ['Sampah', 'Jalan Rusak', 'Penerangan Jalan', 'Fasilitas Umum'];
  const categoryStats = categories.map(cat => {
    const count = reports.filter(r => r.category === cat).length;
    const percentage = totalReports > 0 ? Math.round((count / totalReports) * 100) : 0;
    return { name: cat, count, percentage };
  });

  return (
    <div className="dashboard-container">
      {/* Top Welcome Header */}
      <header className="page-header">
        <div className="header-title">
          <h1>Selamat Datang di SmartVillage</h1>
          <p>Kanal digital pelaporan masalah fasilitas umum dan kelestarian lingkungan Desa.</p>
        </div>
        <div className="header-date">
          <span>Hari ini: <strong>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
        </div>
      </header>

      {/* Scrolling Announcement Ticker */}
      <div className="announcement-ticker">
        <div className="ticker-label">
          <span>📢</span>
          <span>PENGUMUMAN</span>
        </div>
        <div className="ticker-track-wrapper">
          <div className="ticker-track">
            {announcements.length === 0 ? (
              <span className="ticker-item">Belum ada pengumuman desa terbaru hari ini.</span>
            ) : (
              <>
                {/* Render announcements */}
                {announcements.map((ann) => (
                  <React.Fragment key={ann.id}>
                    <span className="ticker-item">{ann.text}</span>
                    <span className="ticker-sep">•</span>
                  </React.Fragment>
                ))}
                {/* Duplicate announcements for seamless looping animation */}
                {announcements.map((ann) => (
                  <React.Fragment key={`dup-${ann.id}`}>
                    <span className="ticker-item">{ann.text}</span>
                    <span className="ticker-sep">•</span>
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Map Section with Floating HUD */}
      <section className="dashboard-map-section card">
        <div className="card-header">
          <div>
            <h2>Peta Pemetaan Laporan & Kondisi Desa</h2>
            <p>Klik penanda lokasi di bawah untuk melihat laporan prasarana atau tumpukan sampah yang dilaporkan warga.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              className="btn btn-sm" 
              onClick={() => {
                if (!currentUser) {
                  openAuthModal('login');
                } else {
                  setIsSosOpen(true);
                }
              }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.45rem', 
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                color: '#fff', 
                border: 'none',
                fontWeight: 700,
                borderRadius: '8px',
                padding: '0.45rem 1rem',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.25)';
              }}
            >
              <span>🚨 SOS Darurat</span>
            </button>
            <button 
              className="btn btn-primary btn-sm" 
              onClick={() => {
                if (!currentUser) {
                  openAuthModal('login');
                } else {
                  setShowReportForm(true);
                  setActiveTab('reports');
                }
              }}
            >
              Buat Laporan Baru
            </button>
          </div>
        </div>
        <div className="card-body relative-map-container" style={{ position: 'relative', padding: 0, height: '420px' }}>
          {/* Active SOS Danger Banner HUD */}
          {(() => {
            const activeSosReport = reports.find(r => r.category === 'Darurat SOS' && r.status !== 'Selesai');
            if (!activeSosReport) return null;

            return (
              <div className="active-sos-hud animate-pulse" style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                right: '1rem',
                zIndex: 999,
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(185, 28, 28, 0.95) 100%)',
                color: '#ffffff',
                padding: '0.85rem 1.25rem',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(220, 38, 38, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.25rem', animation: 'bounce 1s infinite', display: 'inline-block' }}>🚨</span>
                  <div style={{ textAlign: 'left' }}>
                    <strong style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Peringatan Bahaya Aktif Terdeteksi!
                    </strong>
                    <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.78rem', opacity: 0.95, fontWeight: 500 }}>
                      {activeSosReport.title}: {activeSosReport.description.substring(0, 65)}...
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setMapCenter([activeSosReport.latitude, activeSosReport.longitude])}
                  style={{
                    background: '#ffffff',
                    color: '#dc2626',
                    border: 'none',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Pusatkan Peta ke Bahaya 🔍
                </button>
              </div>
            );
          })()}
          <MapView 
            reports={reports.filter(r => !(r.category === 'Darurat SOS' && r.status === 'Selesai'))} 
            center={mapCenter ? mapCenter : undefined} 
            height="100%" 
          />
        </div>
      </section>

      {/* Main Grid: Left (Recent Activities), Right (Stats & Leaderboard) */}
      <div className="dashboard-content-grid">
        {/* Recent Activities */}
        <section className="recent-activities card">
          <div className="card-header">
            <h2>Aktivitas Terbaru</h2>
            <button className="btn btn-text" onClick={() => { setShowReportForm(false); setActiveTab('reports'); }}>
              Lihat Semua Laporan <ArrowRight size={14} />
            </button>
          </div>
          <div className="card-body">
            {recentActivities.length === 0 ? (
              <p className="empty-text">Belum ada laporan masuk.</p>
            ) : (
              <div className="activity-list">
                {recentActivities.map((act) => (
                  <div key={act.id} className="activity-item">
                    <div className={`activity-status-dot status-${act.status.toLowerCase()}`} />
                    <div className="activity-details">
                      <div className="activity-meta">
                        <span className="activity-id">{act.id}</span>
                        <span className="activity-time">
                          {new Date(act.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <h4>{act.title}</h4>
                      <p className="activity-desc">{act.description.substring(0, 100)}...</p>
                      <div className="activity-footer">
                        <span className={`badge-category`}>{act.category}</span>
                        <span className={`badge-status status-${act.status.toLowerCase()}`}>{act.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Right-Hand Column Container */}
        <div className="dashboard-right-col" style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
          
          {/* Category breakdown */}
          <section className="category-stats card">
            <div className="card-header">
              <h2>Distribusi Laporan</h2>
              <p>Persentase jenis masalah yang dilaporkan.</p>
            </div>
            <div className="card-body">
              <div className="progress-list">
                {categoryStats.map((stat) => (
                  <div key={stat.name} className="progress-item">
                    <div className="progress-item-header">
                      <span>{stat.name}</span>
                      <strong>{stat.count} Laporan ({stat.percentage}%)</strong>
                    </div>
                    <div className="progress-bar-bg">
                      <div 
                        className={`progress-bar-fill progress-fill-${stat.name.toLowerCase().replace(' ', '-')}`} 
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="sustainability-tip-card">
                <div className="tip-header">
                  <Award size={18} className="text-emerald" />
                  <span>Tips Desa Berkelanjutan</span>
                </div>
                <p>Desa dengan tingkat penanganan sampah terbaik memiliki risiko banjir 80% lebih rendah. Yuk, aktif memilah sampah dan laporkan tumpukan sampah ilegal!</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* Modal SOS Panic Button Overlay */}
      <SOSModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
    </div>
  );
};

export default Dashboard;
