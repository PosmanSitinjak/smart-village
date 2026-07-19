import React, { useContext, useState } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ReportList from './components/ReportList';
import Education from './components/Education';
import AdminPanel from './components/AdminPanel';
import RoleSelector from './components/RoleSelector';
import PrivacyModal from './components/PrivacyModal';
import Leaderboard from './components/Leaderboard';

import { 
  LayoutDashboard, 
  ClipboardList, 
  BookOpen, 
  Award, 
  Megaphone, 
  UserCheck, 
  LogOut, 
  Leaf,
  Menu,
  X
} from 'lucide-react';
import './App.css';

const MainAppContent = () => {
  const { 
    activeTab, 
    setActiveTab, 
    userRole, 
    isAuthModalOpen, 
    isPrivacyModalOpen, 
    setIsPrivacyModalOpen,
    currentUser, 
    userPoints, 
    logout, 
    openAuthModal 
  } = useContext(AppContext);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'reports':
        return <ReportList />;
      case 'education':
        return <Education />;
      case 'admin_reports':
      case 'admin_education':
      case 'admin_announcements':
        return <AdminPanel />;
      case 'leaderboard':
        return <Leaderboard />;
      default:
        return userRole === 'admin' ? <AdminPanel /> : <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      {/* Ambient background glowing blobs */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>
      <div className="ambient-glow glow-3"></div>

      {/* Mobile Top Header */}
      <div className="mobile-header-bar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setIsMobileMenuOpen(true)}
            title="Buka Menu"
          >
            <Menu size={18} />
          </button>
          <div className="mobile-header-logo">
            <div className="mobile-logo-circle">
              <Leaf size={14} color="#ffffff" fill="#ffffff" />
            </div>
            <span className="mobile-logo-text">SmartVillage</span>
          </div>
        </div>
        <div className="mobile-header-actions">
          {userRole === 'admin' ? (
            <button 
              className="btn-mobile-action btn-danger-mobile" 
              onClick={() => {
                if (window.confirm("Keluar dari Portal Admin?")) {
                  logout();
                }
              }}
            >
              <LogOut size={13} />
              <span>Keluar</span>
            </button>
          ) : currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
                <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--emerald)' }}>
                  {currentUser.name.split(' ')[0]}
                </span>
                <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                  {userPoints} PTS
                </span>
              </div>
              <button 
                className="btn-mobile-action btn-danger-mobile" 
                onClick={logout} 
                style={{ padding: '0.35rem 0.5rem' }}
                title="Keluar Akun"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <button className="btn-mobile-action" onClick={() => openAuthModal('login')}>
              <UserCheck size={13} />
              <span>Masuk</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sidebar (Desktop) */}
      <Sidebar />

      {/* Main Dynamic View Content */}
      <main className="app-main-content">
        <div className="view-wrapper animate-fade-in">
          {renderActiveView()}
        </div>
        {userRole === 'admin' ? (
          <footer className="admin-copyright-footer">
            <p>© {new Date().getFullYear()} <strong>@ayamgeprek</strong> • Panel Kontrol Admin SmartVillage</p>
          </footer>
        ) : (
          <footer className="site-copyright-footer">
            <div className="footer-main-grid">
              {/* Brand Column */}
              <div className="footer-brand-col">
                <div className="footer-brand-logo">
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Leaf size={18} color="#ffffff" />
                  </div>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
                    SmartVillage
                  </span>
                </div>
                <p className="footer-brand-tagline">
                  Kanal digital resmi pelaporan masalah fasilitas publik, respon darurat bencana, dan edukasi kelestarian lingkungan desa.
                </p>
                <div className="footer-status-badge">
                  <span className="pulse-green-dot"></span>
                  <span>Sistem Real-time Online</span>
                </div>
              </div>

              {/* Quick Links Column */}
              <div className="footer-links-col">
                <h4>Navigasi Portal</h4>
                <ul>
                  <li><button type="button" onClick={() => setActiveTab('dashboard')}>Beranda Utama</button></li>
                  <li><button type="button" onClick={() => setActiveTab('reports')}>Layanan Laporan</button></li>
                  <li><button type="button" onClick={() => setActiveTab('education')}>Edukasi & Kuis</button></li>
                  <li><button type="button" onClick={() => setActiveTab('leaderboard')}>Papan Peringkat</button></li>
                </ul>
              </div>

              {/* Copyright & Info Column */}
              <div className="footer-links-col">
                <h4>Hak Cipta & Info</h4>
                <p className="footer-copyright-text">
                  © {new Date().getFullYear()} <strong>@ayamgeprek</strong>.<br />
                  All rights reserved.
                </p>
                <div className="footer-tag-pills">
                  <span>Desa Digital</span>
                  <span>Eco-Smart</span>
                </div>
              </div>
            </div>

            <div className="footer-bottom-bar">
              <p>© {new Date().getFullYear()} @ayamgeprek. All rights reserved.</p>
              <div className="footer-bottom-links">
                <button type="button" onClick={() => setIsPrivacyModalOpen(true)}>Kebijakan Privasi</button>
                <span>•</span>
                <button type="button" onClick={() => openAuthModal('login')}>Portal Warga</button>
              </div>
            </div>
          </footer>
        )}
      </main>

      {/* Mobile Bottom Navigation Dock */}
      <div className="mobile-bottom-nav">
        {userRole === 'admin' ? (
          <>
            <button 
              className={`mobile-nav-item ${activeTab === 'admin_reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin_reports')}
            >
              <ClipboardList size={18} />
              <span>Laporan</span>
            </button>
            <button 
              className={`mobile-nav-item ${activeTab === 'admin_education' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin_education')}
            >
              <BookOpen size={18} />
              <span>Materi</span>
            </button>
            <button 
              className={`mobile-nav-item ${activeTab === 'admin_announcements' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin_announcements')}
            >
              <Megaphone size={18} />
              <span>Pengumuman</span>
            </button>
          </>
        ) : (
          <>
            <button 
              className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Beranda</span>
            </button>
            <button 
              className={`mobile-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <ClipboardList size={18} />
              <span>Layanan</span>
            </button>
            <button 
              className={`mobile-nav-item ${activeTab === 'education' ? 'active' : ''}`}
              onClick={() => setActiveTab('education')}
            >
              <BookOpen size={18} />
              <span>Edukasi</span>
            </button>
            <button 
              className={`mobile-nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('leaderboard')}
            >
              <Award size={18} />
              <span>Peringkat</span>
            </button>
          </>
        )}
      </div>

      {/* Mobile Sidebar Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="mobile-header-logo">
                <div className="mobile-logo-circle">
                  <Leaf size={16} color="#ffffff" fill="#ffffff" />
                </div>
                <span className="mobile-logo-text">SmartVillage</span>
              </div>
              <button 
                type="button" 
                className="btn-close-drawer" 
                onClick={() => setIsMobileMenuOpen(false)}
                title="Tutup Menu"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="mobile-drawer-body">
              <nav className="mobile-drawer-nav">
                {userRole === 'admin' ? (
                  <>
                    <div className="drawer-section-title">Menu Perangkat Desa</div>
                    <button 
                      type="button"
                      className={`drawer-nav-item ${activeTab === 'admin_reports' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('admin_reports'); setIsMobileMenuOpen(false); }}
                    >
                      <ClipboardList size={16} />
                      <span>Kelola Laporan</span>
                    </button>
                    <button 
                      type="button"
                      className={`drawer-nav-item ${activeTab === 'admin_education' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('admin_education'); setIsMobileMenuOpen(false); }}
                    >
                      <BookOpen size={16} />
                      <span>Kelola Artikel & Kuis</span>
                    </button>
                    <button 
                      type="button"
                      className={`drawer-nav-item ${activeTab === 'admin_announcements' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('admin_announcements'); setIsMobileMenuOpen(false); }}
                    >
                      <Megaphone size={16} />
                      <span>Kelola Pengumuman</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="drawer-section-title">Menu Portal Warga</div>
                    <button 
                      type="button"
                      className={`drawer-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                    >
                      <LayoutDashboard size={16} />
                      <span>Dashboard Desa</span>
                    </button>
                    <button 
                      type="button"
                      className={`drawer-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('reports'); setIsMobileMenuOpen(false); }}
                    >
                      <ClipboardList size={16} />
                      <span>Layanan Laporan</span>
                    </button>
                    <button 
                      type="button"
                      className={`drawer-nav-item ${activeTab === 'education' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('education'); setIsMobileMenuOpen(false); }}
                    >
                      <BookOpen size={16} />
                      <span>Edukasi & Kuis</span>
                    </button>
                    <button 
                      type="button"
                      className={`drawer-nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('leaderboard'); setIsMobileMenuOpen(false); }}
                    >
                      <Award size={16} />
                      <span>Papan Peringkat</span>
                    </button>
                  </>
                )}
              </nav>
            </div>
            
            <div className="mobile-drawer-footer">
              {userRole === 'admin' ? (
                <button 
                  type="button"
                  className="btn btn-danger btn-block" 
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  style={{ width: '100%', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
                >
                  <LogOut size={14} /> Keluar Admin
                </button>
              ) : currentUser ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                  <div className="drawer-user-info">
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>{currentUser.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{userPoints} Poin Terkumpul</span>
                  </div>
                  <button 
                    type="button"
                    className="btn btn-secondary btn-block" 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    style={{ width: '100%', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
                  >
                    <LogOut size={14} /> Keluar Akun
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  className="btn btn-primary btn-block" 
                  onClick={() => { openAuthModal('login'); setIsMobileMenuOpen(false); }}
                  style={{ width: '100%', fontWeight: 700, display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
                >
                  <UserCheck size={14} /> Masuk Akun Warga
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Auth Overlay */}
      {isAuthModalOpen && <RoleSelector />}

      {/* Modal Privacy Policy Overlay */}
      {isPrivacyModalOpen && <PrivacyModal />}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
