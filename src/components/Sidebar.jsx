import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  LayoutDashboard, 
  ClipboardList, 
  BookOpen, 
  ShieldCheck, 
  Leaf, 
  LogOut,
  UserCheck,
  Award,
  Megaphone
} from 'lucide-react';

const Sidebar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    userPoints, 
    userRole, 
    currentUser, 
    logout,
    openAuthModal,
    setShowReportForm,
    setIsPrivacyModalOpen
  } = useContext(AppContext);

  // Define menus dynamically based on role
  const getMenuItems = () => {
    if (userRole === 'admin') {
      return [
        { id: 'admin_reports', name: 'Kelola Laporan', icon: ClipboardList },
        { id: 'admin_education', name: 'Kelola Artikel & Kuis', icon: BookOpen },
        { id: 'admin_announcements', name: 'Kelola Pengumuman', icon: Megaphone }
      ];
    } else {
      return [
        { id: 'dashboard', name: 'Dashboard Desa', icon: LayoutDashboard },
        { id: 'reports', name: 'Layanan Laporan', icon: ClipboardList },
        { id: 'education', name: 'Edukasi & Kuis', icon: BookOpen },
        { id: 'leaderboard', name: 'Papan Peringkat', icon: Award }
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="sidebar">
      {/* Brand Header (Click to return to guest dashboard or logout admin) */}
      <div 
        className="sidebar-brand brand-clickable" 
        onClick={logout}
        title="Kembali ke Dashboard Utama / Logout"
      >
        <div className="brand-logo">
          <Leaf className="logo-icon" size={28} />
        </div>
        <div className="brand-text">
          <h2>SmartVillage</h2>
          <span>Desa Hijau Digital</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-menu">
        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  className={`menu-link ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowReportForm(false);
                  }}
                >
                  <Icon size={20} className="menu-icon" />
                  <span className="menu-text">{item.name}</span>
                  {isActive && <div className="active-indicator" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Stats Card / Admin Info & Role Switching */}
      <div className="sidebar-footer">
        {userRole === 'admin' ? (
          // Admin Sidebar Footer Controls
          <div className="admin-status-card">
            <div className="admin-status-header">
              <ShieldCheck className="text-red" size={16} />
              <span>Sesi Admin Aktif</span>
            </div>
            <p className="admin-status-role">Role: Perangkat Desa</p>
            <div className="admin-footer-actions">
              <button className="btn-sidebar-action" onClick={logout} title="Beralih ke Portal Warga">
                <UserCheck size={14} />
                <span>Portal Warga</span>
              </button>
              <button className="btn-sidebar-action btn-sidebar-logout" onClick={logout} title="Keluar Otorisasi">
                <LogOut size={14} />
                <span>Keluar Otorisasi</span>
              </button>
            </div>
          </div>
        ) : currentUser ? (
          // Authenticated Warga Sidebar Footer
          <>
            <div className="points-card animate-fade-in">
              <div className="points-header">
                <Award className="points-icon" size={18} />
                <span>{currentUser.name}</span>
              </div>
              <div className="points-value">
                {userPoints} <span className="points-unit">PTS</span>
              </div>
              <div className="points-progress-bar">
                <div 
                  className="points-progress-fill" 
                  style={{ width: `${Math.min((userPoints / 300) * 100, 100)}%` }}
                />
              </div>
              <span className="points-level">
                Status: {userPoints >= 250 ? 'Pahlawan Hijau' : userPoints >= 150 ? 'Pecinta Lingkungan' : 'Warga Peduli'}
              </span>
            </div>
            
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={logout} 
              style={{ marginTop: '0.75rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <LogOut size={12} />
              <span>Keluar Akun</span>
            </button>
          </>
        ) : (
          // Guest Warga Sidebar Footer
          <div className="guest-footer-card animate-fade-in" style={{ padding: '0.5rem 0' }}>
            <button 
              className="btn btn-primary btn-block" 
              onClick={() => openAuthModal('login')} 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.65rem 1rem' }}
            >
              <UserCheck size={15} />
              <span>Masuk Akun Warga</span>
            </button>
          </div>
        )}
        
        {/* Kebijakan Privasi Link */}
        <div style={{ textAlign: 'center', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
          <button 
            onClick={() => setIsPrivacyModalOpen(true)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              fontSize: '0.72rem', 
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--emerald)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ShieldCheck size={12} />
            <span>Kebijakan Privasi & Ketentuan</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
