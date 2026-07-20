import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Award, 
  Trophy, 
  Leaf, 
  UserCheck,
  Zap
} from 'lucide-react';

const Leaderboard = () => {
  const { users, currentUser, userPoints, openAuthModal } = useContext(AppContext);

  // Sort users by points descending
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  // Find current user's rank
  const myRank = currentUser 
    ? sortedUsers.findIndex(u => u.username === currentUser.username) + 1 
    : null;

  const getUserBadgeText = (points) => {
    if (points >= 250) return 'Pahlawan Hijau';
    if (points >= 150) return 'Pecinta Lingkungan';
    return 'Warga Peduli';
  };

  const getUserBadgeClass = (points) => {
    if (points >= 250) return 'badge-danger'; // Dark Red / pulsing green styled
    if (points >= 150) return 'badge-warning'; // Orange / Leaf
    return 'badge-info'; // Blue
  };

  return (
    <div className="leaderboard-container" style={{ paddingBottom: '3rem' }}>
      {/* Page Header */}
      <header className="page-header" style={{ marginBottom: '2.25rem' }}>
        <div className="header-title">
          <div className="admin-badge" style={{ background: 'rgba(16, 185, 129, 0.08)', color: 'var(--emerald)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Trophy size={14} />
            <span>Penghargaan Warga Aktif</span>
          </div>
          <h1>Papan Peringkat Eco-Warga</h1>
          <p>Apresiasi sosial bagi seluruh warga yang berkontribusi menjaga kelestarian, kebersihan, dan keselamatan desa.</p>
        </div>
      </header>

      {/* Grid: Top User Status card, Bottom Table list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* TOP STATUS CARD (User's Personal Achievement) */}
        {currentUser ? (
          <div className="card animate-fade-in" style={{ 
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(13, 148, 136, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.15)',
            borderRadius: '16px',
            padding: '1.75rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
              }}>
                <Award size={36} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Selamat, {currentUser.name}!
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                  Anda saat ini berada di peringkat <strong>#{myRank}</strong> di seluruh wilayah desa SmartVillage.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total Poin Anda
                </span>
                <strong style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--emerald)' }}>
                  {userPoints} <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>PTS</span>
                </strong>
              </div>

              <div style={{ width: '1px', height: '40px', backgroundColor: '#e2e8f0' }} />

              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>
                  Lencana Saat Ini
                </span>
                <span className={`badge-severity ${
                  userPoints >= 250 ? 'badge-danger' : userPoints >= 150 ? 'badge-warning' : 'badge-info'
                }`} style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  {getUserBadgeText(userPoints)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="card animate-fade-in" style={{ 
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.04) 0%, rgba(59, 130, 246, 0.04) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.12)',
            borderRadius: '16px',
            padding: '1.75rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Yuk, Ikut Berpartisipasi!</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                Masuk ke akun warga Anda untuk melihat peringkat pribadi, mengumpulkan Eco-Points, dan melestarikan desa bersama.
              </p>
            </div>
            <button 
              type="button"
              className="btn btn-primary"
              onClick={() => openAuthModal('login')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.6rem 1.25rem' }}
            >
              <UserCheck size={16} />
              <span>Masuk Akun Warga</span>
            </button>
          </div>
        )}

        {/* BOTTOM: MAIN RANKINGS LIST */}
        <div className="leaderboard-grid">
          
          {/* Rank table */}
          <section className="card" style={{ padding: '1rem 1.5rem 1.5rem 1.5rem' }}>
            <div className="card-header" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Peringkat Keaktifan Warga</h3>
            </div>
            <div className="card-body no-padding table-responsive">
              <table className="admin-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: '80px', textAlign: 'center' }}>Posisi</th>
                    <th>Nama Warga</th>
                    <th>Gelar Kontributor</th>
                    <th className="text-right" style={{ width: '140px' }}>Total Poin</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user, idx) => {
                    const isMe = currentUser && user.username === currentUser.username;
                    const rank = idx + 1;
                    
                    return (
                      <tr key={user.username} className={isMe ? 'row-selected' : ''} style={{
                        backgroundColor: isMe ? 'rgba(16, 185, 129, 0.06)' : 'transparent',
                        fontWeight: isMe ? 700 : 400
                      }}>
                        <td style={{ textAlign: 'center', fontSize: '1rem' }}>
                          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : (
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>#{rank}</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <span style={{ fontSize: '0.88rem' }}>{user.name}</span>
                            {isMe && (
                              <span style={{ 
                                fontSize: '0.65rem', 
                                background: 'var(--emerald)', 
                                color: '#ffffff', 
                                padding: '0.1rem 0.4rem', 
                                borderRadius: '4px',
                                fontWeight: 800
                              }}>ANDA</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`badge-severity ${getUserBadgeClass(user.points)}`} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', fontWeight: 700 }}>
                            {getUserBadgeText(user.points)}
                          </span>
                        </td>
                        <td className="text-right" style={{ fontSize: '0.95rem' }}>
                          <strong style={{ color: isMe ? 'var(--emerald)' : 'var(--text-primary)' }}>{user.points}</strong> <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>PTS</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Right Info sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Guide Card: How to earn points */}
            <section className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                <Zap size={16} style={{ color: '#eab308', fill: '#eab308' }} />
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, margin: 0 }}>Cara Mendapatkan Poin</h4>
              </div>
              <ul style={{ paddingLeft: '1.15rem', margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <li>
                  📸 <strong>Buat Laporan Aduan (+15 PTS)</strong>: Laporkan masalah sampah liar atau sarana jalan yang rusak secara valid.
                </li>
                <li>
                  📝 <strong>Selesaikan Kuis Artikel (+15 PTS)</strong>: Baca artikel edukasi dan selesaikan kuis mini di bagian bawah bacaan dengan skor sempurna (5/5).
                </li>
                <li>
                  🏆 <strong>Kuis Pengetahuan Utama (+50 PTS)</strong>: Kerjakan kuis utama 30 soal di halaman Edukasi dan peroleh skor minimal 25 jawaban benar.
                </li>
              </ul>
            </section>

            {/* Title Info Card */}
            <section className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                <Leaf size={16} style={{ color: 'var(--emerald)' }} />
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, margin: 0 }}>Daftar Gelar Kehormatan</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <span className="badge-severity badge-danger" style={{ fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.45rem' }}>Pahlawan Hijau</span>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                    Diberikan kepada warga berdedikasi tinggi dengan kepemilikan poin <strong>250 PTS atau lebih</strong>.
                  </p>
                </div>
                <div>
                  <span className="badge-severity badge-warning" style={{ fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.45rem' }}>Pecinta Lingkungan</span>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                    Diberikan kepada warga yang aktif berpartisipasi dengan kepemilikan poin <strong>150 hingga 249 PTS</strong>.
                  </p>
                </div>
                <div>
                  <span className="badge-severity badge-info" style={{ fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.45rem' }}>Warga Peduli</span>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                    Status awal keikutsertaan warga desa dengan poin <strong>kurang dari 150 PTS</strong>.
                  </p>
                </div>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
