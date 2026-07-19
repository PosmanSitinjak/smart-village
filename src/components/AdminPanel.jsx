import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  ShieldAlert, 
  Trash2, 
  Edit3, 
  CheckSquare, 
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Compass,
  AlertCircle,
  Plus,
  FileText,
  Video,
  BookOpen,
  ArrowLeft,
  Settings
} from 'lucide-react';

const AdminPanel = () => {
  const { 
    reports, 
    updateReportStatus, 
    deleteReport, 
    resetData,
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    activeTab
  } = useContext(AppContext);

  // --- State for Announcements Management ---
  const [announcementInput, setAnnouncementInput] = useState('');
  const [selectedAnnId, setSelectedAnnId] = useState(null);

  const handleSaveAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementInput.trim()) {
      alert('Isi pengumuman tidak boleh kosong!');
      return;
    }

    if (selectedAnnId) {
      updateAnnouncement(selectedAnnId, announcementInput);
      alert('Pengumuman berhasil diperbarui!');
    } else {
      addAnnouncement(announcementInput);
      alert('Pengumuman baru berhasil ditambahkan!');
    }

    setAnnouncementInput('');
    setSelectedAnnId(null);
  };

  const handleEditAnnClick = (ann) => {
    setSelectedAnnId(ann.id);
    setAnnouncementInput(ann.text);
  };

  const handleDeleteAnnClick = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
      deleteAnnouncement(id);
      if (selectedAnnId === id) {
        setSelectedAnnId(null);
        setAnnouncementInput('');
      }
    }
  };

  // --- State for Reports Management ---
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [shouldAwardPoints, setShouldAwardPoints] = useState(false);
  const [pointsToAward, setPointsToAward] = useState(15);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  const selectedReport = reports.find(r => r.id === selectedReportId);

  const filteredReports = reports.filter((rep) => {
    const matchesSearch = 
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      rep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.id.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'Semua' || rep.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditClick = (report) => {
    setSelectedReportId(report.id);
    setNewStatus(report.status);
    setAdminNote(report.adminNote || '');
    setShouldAwardPoints(false);
    setPointsToAward(15);
  };

  const handleSaveUpdate = (e) => {
    e.preventDefault();
    if (!selectedReportId) return;
    
    const awardAmount = (newStatus === 'Selesai' && shouldAwardPoints && !selectedReport.pointsAwarded)
      ? Number(pointsToAward)
      : 0;
    
    updateReportStatus(selectedReportId, newStatus, adminNote, awardAmount);
    setSelectedReportId(null);
    setNewStatus('');
    setAdminNote('');
    setShouldAwardPoints(false);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus laporan ${id}? Tindakan ini tidak dapat dibatalkan.`)) {
      deleteReport(id);
      if (selectedReportId === id) {
        setSelectedReportId(null);
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Selesai': return 'status-selesai';
      case 'Diproses': return 'status-diproses';
      case 'Menunggu': return 'status-menunggu';
      default: return 'status-secondary';
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Tinggi': return 'badge-danger';
      case 'Sedang': return 'badge-warning';
      case 'Rendah': return 'badge-info';
      default: return 'badge-secondary';
    }
  };


  // --- State for Articles Management (Edukasi & Kuis) ---
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [isAddingNewArticle, setIsAddingNewArticle] = useState(false);

  // Form inputs for article
  const [artTitle, setArtTitle] = useState('');
  const [artCategory, setArtCategory] = useState('Sampah');
  const [artReadTime, setArtReadTime] = useState('3 menit');
  const [artSummary, setArtSummary] = useState('');
  const [artImage, setArtImage] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artYoutubeId, setArtYoutubeId] = useState('');
  const [artSourceLabel, setArtSourceLabel] = useState('');
  const [artSourceUrl, setArtSourceUrl] = useState('');

  // 5 quiz questions
  const [artQuizQuestions, setArtQuizQuestions] = useState(
    Array(5).fill(null).map(() => ({
      question: '',
      options: ['', '', '', ''],
      answer: 0,
      explanation: ''
    }))
  );

  const selectedArticle = articles.find(a => a.id === selectedArticleId);

  const handleEditArticleClick = (art) => {
    setSelectedArticleId(art.id);
    setIsAddingNewArticle(false);
    setArtTitle(art.title);
    setArtCategory(art.category || 'Sampah');
    setArtReadTime(art.readTime || '3 menit');
    setArtSummary(art.summary || '');
    setArtImage(art.image || '');
    setArtContent(art.content || '');
    setArtYoutubeId(art.youtubeId || '');
    setArtSourceLabel(art.sourceLabel || '');
    setArtSourceUrl(art.sourceUrl || '');

    if (art.quizQuestions && art.quizQuestions.length === 5) {
      setArtQuizQuestions(JSON.parse(JSON.stringify(art.quizQuestions)));
    } else {
      setArtQuizQuestions(
        Array(5).fill(null).map(() => ({
          question: '',
          options: ['', '', '', ''],
          answer: 0,
          explanation: ''
        }))
      );
    }
  };

  const handleAddNewArticleClick = () => {
    setSelectedArticleId(null);
    setIsAddingNewArticle(true);
    setArtTitle('');
    setArtCategory('Sampah');
    setArtReadTime('3 menit');
    setArtSummary('');
    setArtImage('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=60');
    setArtContent('');
    setArtYoutubeId('');
    setArtSourceLabel('');
    setArtSourceUrl('');
    setArtQuizQuestions(
      Array(5).fill(null).map(() => ({
        question: '',
        options: ['', '', '', ''],
        answer: 0,
        explanation: ''
      }))
    );
  };

  const handleSaveArticle = (e) => {
    e.preventDefault();

    if (!artTitle.trim() || !artContent.trim() || !artSummary.trim()) {
      alert('Judul, Ringkasan, dan Isi Artikel wajib diisi!');
      return;
    }

    // Validate quiz questions
    for (let i = 0; i < 5; i++) {
      const q = artQuizQuestions[i];
      if (!q.question.trim()) {
        alert(`Pertanyaan Kuis nomor ${i + 1} wajib diisi!`);
        return;
      }
      for (let j = 0; j < 4; j++) {
        if (!q.options[j].trim()) {
          alert(`Pilihan jawaban ${String.fromCharCode(65 + j)} pada Pertanyaan ${i + 1} wajib diisi!`);
          return;
        }
      }
    }

    const payload = {
      title: artTitle,
      category: artCategory,
      readTime: artReadTime,
      summary: artSummary,
      image: artImage || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=60',
      content: artContent,
      youtubeId: artYoutubeId || undefined,
      sourceLabel: artSourceLabel || undefined,
      sourceUrl: artSourceUrl || undefined,
      quizQuestions: artQuizQuestions
    };

    if (isAddingNewArticle) {
      addArticle(payload);
      alert('Artikel baru berhasil ditambahkan!');
    } else {
      updateArticle(selectedArticleId, payload);
      alert('Artikel berhasil diperbarui!');
    }

    setSelectedArticleId(null);
    setIsAddingNewArticle(false);
  };

  const handleDeleteArticleClick = (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"? Kuis terkait artikel ini juga akan terhapus secara permanen.`)) {
      deleteArticle(id);
      if (selectedArticleId === id) {
        setSelectedArticleId(null);
      }
    }
  };


  return (
    <div className="admin-container">
      {/* Page Header */}
      <header className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div className="header-title">
          <div className="admin-badge">
            <ShieldAlert size={14} />
            <span>Akses Staf Pemerintah Desa</span>
          </div>
          <h1>Panel Kontrol Admin</h1>
          <p>Kelola laporan aduan prasarana warga desa, serta kelola konten edukasi video dan kuis lingkungan hidup.</p>
        </div>
        <div>
          <button 
            className="btn btn-sm btn-danger" 
            onClick={() => {
              if (window.confirm("Apakah Anda yakin ingin MENGHAPUS BERSIH seluruh database (laporan aduan & artikel edukasi akan di-reset ke awal)?")) {
                resetData();
              }
            }}
            style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '0.5rem 1rem' }}
            title="Kosongkan database laporan secara total"
          >
            Reset Semua Data
          </button>
        </div>
      </header>

      {/* VIEW CONDITIONAL 1: REPORTS MANAGEMENT */}
      {activeTab === 'admin_reports' && (
        <>
          {/* Visual Analytics Dashboard */}
          <section className="admin-analytics-grid animate-fade-in" style={{ marginBottom: '2rem' }}>
            <div className="analytics-card card">
              <div className="card-header-slim">
                <h3>Sebaran Kategori Aduan</h3>
              </div>
              <div className="analytics-body">
                {['Sampah', 'Jalan Rusak', 'Penerangan Jalan', 'Fasilitas Umum'].map(cat => {
                  const count = reports.filter(r => r.category === cat).length;
                  const pct = reports.length > 0 ? Math.round((count / reports.length) * 100) : 0;
                  return (
                    <div key={cat} className="analytics-row">
                      <div className="analytics-label">
                        <span>{cat}</span>
                        <strong>{count} Laporan</strong>
                      </div>
                      <div className="analytics-bar-track">
                        <div className={`analytics-bar-fill progress-fill-${cat.toLowerCase().replace(' ', '-')}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="analytics-card card">
              <div className="card-header-slim">
                <h3>Analisis Urgensi Masalah</h3>
              </div>
              <div className="analytics-body">
                {['Tinggi', 'Sedang', 'Rendah'].map(sev => {
                  const count = reports.filter(r => r.severity === sev).length;
                  const pct = reports.length > 0 ? Math.round((count / reports.length) * 100) : 0;
                  const fillStyle = sev === 'Tinggi' ? 'rgba(239, 68, 68, 0.85)' : sev === 'Sedang' ? 'rgba(245, 158, 11, 0.85)' : 'rgba(59, 130, 246, 0.85)';
                  return (
                    <div key={sev} className="analytics-row">
                      <div className="analytics-label">
                        <span>Prioritas {sev}</span>
                        <strong>{count} Laporan</strong>
                      </div>
                      <div className="analytics-bar-track">
                        <div className="analytics-bar-fill" style={{ width: `${pct}%`, backgroundColor: fillStyle }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Grid Layout: Left Table (1fr), Right Editor Form (380px) */}
          <div className="admin-layout-grid">
            <section className="admin-table-card card">
              <div className="card-header admin-table-header">
                <h2>Daftar Semua Laporan Warga</h2>
                
                <div className="admin-table-controls">
                  <div className="admin-search">
                    <Search size={14} />
                    <input 
                      type="text" 
                      placeholder="Cari ID, judul, pelapor..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="admin-filter">
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="Semua">Semua Status</option>
                      <option value="Menunggu">Menunggu</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="card-body no-padding table-responsive">
                {filteredReports.length === 0 ? (
                  <p className="empty-table-text">Tidak ada laporan warga yang cocok dengan filter.</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Judul Masalah</th>
                        <th>Kategori</th>
                        <th>Urgensi</th>
                        <th>Pelapor</th>
                        <th>Status</th>
                        <th className="text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.map((rep) => (
                        <tr key={rep.id} className={selectedReportId === rep.id ? 'row-selected' : ''}>
                          <td><span className="table-report-id">{rep.id}</span></td>
                          <td className="table-title-cell">
                            <strong>{rep.title}</strong>
                            <span>{new Date(rep.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</span>
                          </td>
                          <td><span className="table-category">{rep.category}</span></td>
                          <td>
                            <span className={`badge-severity ${getSeverityBadge(rep.severity)}`}>
                              {rep.severity}
                            </span>
                          </td>
                          <td>{rep.reporterName}</td>
                          <td>
                            <span className={`status-text-badge ${getStatusClass(rep.status)}`}>
                              {rep.status}
                            </span>
                          </td>
                          <td className="text-right actions-cell">
                            <button 
                              type="button"
                              className="btn-action-icon btn-edit" 
                              onClick={() => handleEditClick(rep)}
                              title="Ubah Status & Tanggapan"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              type="button"
                              className="btn-action-icon btn-delete" 
                              onClick={() => handleDeleteClick(rep.id)}
                              title="Hapus Laporan"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            <section className="admin-editor-card">
              {selectedReport ? (
                <div className="card editor-active animate-fade-in">
                  <div className="card-header">
                    <h2>Kelola Laporan {selectedReport.id}</h2>
                    <button type="button" className="btn-close-small" onClick={() => setSelectedReportId(null)}>Tutup</button>
                  </div>
                  <form onSubmit={handleSaveUpdate} className="card-body editor-form">
                    <div className="editor-info-summary">
                      <h4>{selectedReport.title}</h4>
                      <p className="text-sm">{selectedReport.description.substring(0, 150)}...</p>
                      <div className="editor-reporter-box">
                        <span>Pelapor: <strong>{selectedReport.reporterName}</strong></span>
                        <span>Urgensi: <strong className={`text-urgency-${selectedReport.severity.toLowerCase()}`}>{selectedReport.severity}</strong></span>
                      </div>
                    </div>

                    <hr className="editor-divider" />

                    <div className="form-group">
                      <label htmlFor="editStatus">Perbarui Status Penanganan</label>
                      <select 
                        id="editStatus"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        <option value="Menunggu">Menunggu Verifikasi</option>
                        <option value="Diproses">Sedang Diproses/Diperbaiki</option>
                        <option value="Selesai">Selesai Ditangani</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="editNote">Tanggapan & Catatan Resmi Desa</label>
                      <p className="field-help">Catatan ini akan langsung tampil di linimasa pelacakan warga.</p>
                      <textarea 
                        id="editNote"
                        rows="5"
                        placeholder="Contoh: Petugas dinas perhubungan desa telah menjadwalkan perbaikan bohlam lampu jalan ini pada sore hari."
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                      />
                    </div>

                    {newStatus === 'Selesai' && (
                      <div className="form-group admin-points-awarding">
                        <label>Penghargaan Poin Warga</label>
                        {selectedReport.pointsAwarded ? (
                          <div className="points-already-awarded animate-fade-in">
                            <CheckCircle size={14} className="text-emerald" />
                            <span>Poin telah diberikan: <strong>+{selectedReport.pointsAwarded} PTS</strong></span>
                          </div>
                        ) : (
                          <div className="points-award-controls animate-fade-in">
                            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                              <input 
                                type="checkbox"
                                checked={shouldAwardPoints}
                                onChange={(e) => setShouldAwardPoints(e.target.checked)}
                                style={{ width: 'auto', cursor: 'pointer' }}
                              />
                              <span>Berikan Eco-Points ke pelapor</span>
                            </label>
                            
                            {shouldAwardPoints && (
                              <div className="points-select-wrapper animate-fade-in" style={{ marginTop: '0.5rem' }}>
                                <select
                                  value={pointsToAward}
                                  onChange={(e) => setPointsToAward(Number(e.target.value))}
                                  style={{ padding: '0.5rem' }}
                                >
                                  <option value={15}>+15 PTS (Laporan Standar)</option>
                                  <option value={25}>+25 PTS (Laporan Berdampak)</option>
                                  <option value={50}>+50 PTS (Laporan Sangat Penting)</option>
                                </select>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="editor-actions">
                      <button type="button" className="btn btn-secondary" onClick={() => setSelectedReportId(null)}>
                        Batal
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Simpan Perubahan
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="card editor-empty">
                  <ShieldAlert size={36} className="text-gray-500" />
                  <h3>Pilih Laporan Warga</h3>
                  <p>Klik tombol pensil (<Edit3 size={12} />) pada baris tabel laporan di sebelah kiri untuk memperbarui status penanganan atau tanggapan resmi.</p>
                </div>
              )}
            </section>
          </div>
        </>
      )}

      {/* VIEW CONDITIONAL 2: ARTICLES & QUIZ MANAGEMENT */}
      {activeTab === 'admin_education' && (
        <div className="admin-education-section animate-fade-in" style={{ width: '100%' }}>
          
          {/* CASE 2A: TABLE LIST VIEW (FULL-WIDTH & SPACIOUS) */}
          {!selectedArticleId && !isAddingNewArticle ? (
            <section className="admin-table-card card" style={{ width: '100%', padding: '1rem' }}>
              <div className="card-header admin-table-header" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.5rem 1rem 1rem 1rem',
                borderBottom: '1px solid #f1f5f9'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Daftar Artikel Edukasi Warga</h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                    Kelola materi bacaan, video penjelas YouTube, dan 5 soal kuis pendamping untuk masing-masing artikel.
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleAddNewArticleClick}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.65rem 1.15rem', borderRadius: '8px' }}
                >
                  <Plus size={16} />
                  <span>Tambah Artikel Baru</span>
                </button>
              </div>

              <div className="card-body no-padding table-responsive" style={{ padding: '0.75rem 1rem' }}>
                {articles.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <BookOpen size={40} className="text-gray-400" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Belum ada artikel edukasi desa yang terbuat.</p>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddNewArticleClick} style={{ marginTop: '0.75rem' }}>
                      Mulai Tambah Artikel Pertama
                    </button>
                  </div>
                ) : (
                  <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '90px' }}>Sampul</th>
                        <th>Judul Materi</th>
                        <th>Kategori</th>
                        <th>Waktu Baca</th>
                        <th>Video YouTube</th>
                        <th>Jumlah Soal</th>
                        <th className="text-right" style={{ width: '120px' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((art) => (
                        <tr key={art.id}>
                          <td>
                            <img 
                              src={art.image} 
                              alt={art.title} 
                              style={{ width: '65px', height: '42px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                            />
                          </td>
                          <td className="table-title-cell" style={{ maxWidth: '350px' }}>
                            <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-primary)' }}>{art.title}</strong>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {art.id}</span>
                          </td>
                          <td>
                            <span className="table-category" style={{ 
                              textTransform: 'uppercase',
                              background: '#e0f2fe',
                              color: '#0369a1',
                              padding: '0.25rem 0.55rem',
                              borderRadius: '20px',
                              fontSize: '0.72rem',
                              fontWeight: 800
                            }}>{art.category}</span>
                          </td>
                          <td>{art.readTime}</td>
                          <td>
                            {art.youtubeId ? (
                              <span style={{ color: 'var(--emerald)', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Video size={12} /> <code>{art.youtubeId}</code>
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Tidak ada</span>
                            )}
                          </td>
                          <td>
                            <span style={{ 
                              fontWeight: 700,
                              background: '#f0fdf4',
                              color: 'var(--emerald)',
                              padding: '0.25rem 0.55rem',
                              borderRadius: '20px',
                              fontSize: '0.72rem',
                              display: 'inline-block'
                            }}>
                              {art.quizQuestions ? art.quizQuestions.length : 0} Pertanyaan
                            </span>
                          </td>
                          <td className="text-right actions-cell">
                            <button 
                              type="button"
                              className="btn-action-icon btn-edit" 
                              onClick={() => handleEditArticleClick(art)}
                              title="Edit Artikel & Kuis"
                              style={{ marginRight: '0.4rem' }}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              type="button"
                              className="btn-action-icon btn-delete" 
                              onClick={() => handleDeleteArticleClick(art.id, art.title)}
                              title="Hapus Artikel"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          ) : (
            
            /* CASE 2B: FULL-WIDTH CENTERED EDITOR FORM (MAX-WIDTH 900PX, EXTREMELY SPACIOUS & NEAT) */
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '3rem' }}>
              <section className="card animate-fade-in" style={{ width: '100%', maxWidth: '850px', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)', borderRadius: '16px', overflow: 'hidden' }}>
                
                {/* Editor Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderBottom: '1px solid #f1f5f9',
                  padding: '1.25rem 2rem',
                  backgroundColor: '#ffffff'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button 
                      type="button" 
                      onClick={() => {
                        setSelectedArticleId(null);
                        setIsAddingNewArticle(false);
                      }}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      <ArrowLeft size={14} />
                      <span>Kembali</span>
                    </button>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                      {isAddingNewArticle ? 'Tambah Materi Edukasi' : `Edit Materi: ${artTitle}`}
                    </h2>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, background: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald)', padding: '0.35rem 0.8rem', borderRadius: '20px' }}>
                    Editor Konten Desa
                  </span>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSaveArticle} className="card-body" style={{ padding: '2.25rem' }}>
                  
                  {/* SECTION A: ARTICLE DATA */}
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--emerald)', borderBottom: '2px solid rgba(16, 185, 129, 0.2)', paddingBottom: '0.4rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FileText size={16} /> <span>A. DATA UTAMA MATERI BACAAN</span>
                    </h3>

                    {/* Judul */}
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>Judul Artikel</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Mengolah Kompos Alami dengan Metode Takakura"
                        value={artTitle}
                        onChange={(e) => setArtTitle(e.target.value)}
                        required
                        style={{ padding: '0.65rem 0.85rem', borderRadius: '8px' }}
                      />
                    </div>

                    {/* 3-Column Grid: Kategori, Waktu Baca, URL Gambar */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div className="form-group">
                        <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>Kategori Lingkungan</label>
                        <select 
                          value={artCategory}
                          onChange={(e) => setArtCategory(e.target.value)}
                          style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', width: '100%' }}
                        >
                          <option value="Sampah">Sampah (Kebersihan)</option>
                          <option value="Energi">Energi (Ketenagalistrikan)</option>
                          <option value="Banjir">Banjir (Saluran Air)</option>
                          <option value="Fasilitas Umum">Fasilitas Umum</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>Estimasi Waktu Baca</label>
                        <input 
                          type="text" 
                          placeholder="Contoh: 3 menit"
                          value={artReadTime}
                          onChange={(e) => setArtReadTime(e.target.value)}
                          required
                          style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', width: '100%' }}
                        />
                      </div>

                      <div className="form-group">
                        <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>URL Gambar Sampul</label>
                        <input 
                          type="url" 
                          placeholder="https://images.unsplash.com/..."
                          value={artImage}
                          onChange={(e) => setArtImage(e.target.value)}
                          style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', width: '100%' }}
                        />
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>Ringkasan Pendek</label>
                      <p className="field-help" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Kalimat pendek yang tampil di kartu pratinjau utama.</p>
                      <textarea 
                        rows="2"
                        placeholder="Tulis ringkasan singkat mengenai esensi materi..."
                        value={artSummary}
                        onChange={(e) => setArtSummary(e.target.value)}
                        required
                        style={{ padding: '0.65rem 0.85rem', borderRadius: '8px' }}
                      />
                    </div>

                    {/* Content Body */}
                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>Teks Lengkap Edukasi</label>
                      <p className="field-help" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Gunakan enter baru untuk memisahkan paragraf agar rapi dibaca warga.</p>
                      <textarea 
                        rows="8"
                        placeholder="Ketik seluruh materi edukasi secara detail di sini..."
                        value={artContent}
                        onChange={(e) => setArtContent(e.target.value)}
                        required
                        style={{ padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.88rem', lineHeight: '1.6' }}
                      />
                    </div>
                  </div>

                  {/* SECTION B: VIDEO EMBED INFO */}
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--emerald)', borderBottom: '2px solid rgba(16, 185, 129, 0.2)', paddingBottom: '0.4rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Video size={16} /> <span>B. TRANSISI VIDEO PENJELAS (YOUTUBE EMBED)</span>
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>YouTube Video ID (11 Karakter)</label>
                        <p className="field-help" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>watch?v=**Ahqoabpllc4**</p>
                        <input 
                          type="text" 
                          placeholder="Misal: Ahqoabpllc4"
                          maxLength={11}
                          value={artYoutubeId}
                          onChange={(e) => setArtYoutubeId(e.target.value)}
                          style={{ padding: '0.65rem 0.85rem', borderRadius: '8px' }}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>Label Link Sumber</label>
                        <p className="field-help" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Nama/Sumber Penerbit Video</p>
                        <input 
                          type="text" 
                          placeholder="Misal: Edukasi Kompos BKN"
                          value={artSourceLabel}
                          onChange={(e) => setArtSourceLabel(e.target.value)}
                          style={{ padding: '0.65rem 0.85rem', borderRadius: '8px' }}
                        />
                      </div>

                      <div className="form-group">
                        <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>URL Tonton Youtube Asli</label>
                        <p className="field-help" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Tautan lengkap video asli</p>
                        <input 
                          type="url" 
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={artSourceUrl}
                          onChange={(e) => setArtSourceUrl(e.target.value)}
                          style={{ padding: '0.65rem 0.85rem', borderRadius: '8px' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION C: 5 MINI-QUIZ QUESTIONS */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--emerald)', borderBottom: '2px solid rgba(16, 185, 129, 0.2)', paddingBottom: '0.4rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <BookOpen size={16} /> <span>C. SOAL KUIS MINI PENDAMPING (WAJIB TEPAT 5 SOAL)</span>
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '-0.75rem', marginBottom: '1.5rem', lineHeight: 1.4 }}>
                      Soal kuis ini akan diselesaikan oleh warga sesaat setelah selesai membaca artikel untuk mencairkan +15 Eco-Points.
                    </p>

                    {/* Loop exactly 5 questions */}
                    {artQuizQuestions.map((q, idx) => (
                      <div 
                        key={idx} 
                        className="quiz-question-edit-card" 
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '1.5rem',
                          marginBottom: '1.5rem',
                          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.01)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--emerald)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span>❓ Soal Pertanyaan {idx + 1}</span>
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Soal {idx + 1} dari 5</span>
                        </div>

                        {/* Question Input */}
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                          <label style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>Teks Pertanyaan</label>
                          <input 
                            type="text" 
                            placeholder={`Contoh Soal: Apa bahan dasar utama pembuatan bio-enzim?`}
                            value={q.question} 
                            onChange={(e) => {
                              const updated = [...artQuizQuestions];
                              updated[idx].question = e.target.value;
                              setArtQuizQuestions(updated);
                            }}
                            required
                            style={{ padding: '0.55rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}
                          />
                        </div>

                        {/* Options 2x2 Grid Layout */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                          <div className="form-group">
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Pilihan A (Jawaban Index 0)</label>
                            <input 
                              type="text" 
                              placeholder="Opsi A"
                              value={q.options[0]} 
                              onChange={(e) => {
                                const updated = [...artQuizQuestions];
                                updated[idx].options[0] = e.target.value;
                                setArtQuizQuestions(updated);
                              }}
                              required
                              style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.82rem' }}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Pilihan B (Jawaban Index 1)</label>
                            <input 
                              type="text" 
                              placeholder="Opsi B"
                              value={q.options[1]} 
                              onChange={(e) => {
                                const updated = [...artQuizQuestions];
                                updated[idx].options[1] = e.target.value;
                                setArtQuizQuestions(updated);
                              }}
                              required
                              style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.82rem' }}
                            />
                          </div>

                          <div className="form-group">
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Pilihan C (Jawaban Index 2)</label>
                            <input 
                              type="text" 
                              placeholder="Opsi C"
                              value={q.options[2]} 
                              onChange={(e) => {
                                const updated = [...artQuizQuestions];
                                updated[idx].options[2] = e.target.value;
                                setArtQuizQuestions(updated);
                              }}
                              required
                              style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.82rem' }}
                            />
                          </div>

                          <div className="form-group">
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Pilihan D (Jawaban Index 3)</label>
                            <input 
                              type="text" 
                              placeholder="Opsi D"
                              value={q.options[3]} 
                              onChange={(e) => {
                                const updated = [...artQuizQuestions];
                                updated[idx].options[3] = e.target.value;
                                setArtQuizQuestions(updated);
                              }}
                              required
                              style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.82rem' }}
                            />
                          </div>
                        </div>

                        {/* Correct Answer index & Explanation row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                          <div className="form-group">
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', display: 'block' }}>Jawaban Benar</label>
                            <select 
                              value={q.answer}
                              onChange={(e) => {
                                const updated = [...artQuizQuestions];
                                updated[idx].answer = Number(e.target.value);
                                setArtQuizQuestions(updated);
                              }}
                              style={{ padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem', width: '100%', cursor: 'pointer' }}
                            >
                              <option value={0}>Pilihan A</option>
                              <option value={1}>Pilihan B</option>
                              <option value={2}>Pilihan C</option>
                              <option value={3}>Pilihan D</option>
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', display: 'block' }}>Pembahasan / Penjelasan Jawaban</label>
                            <input 
                              type="text" 
                              placeholder="Contoh: Bahan dasarnya adalah sisa buah, sayuran segar, air, dan gula tebu."
                              value={q.explanation} 
                              onChange={(e) => {
                                const updated = [...artQuizQuestions];
                                updated[idx].explanation = e.target.value;
                                setArtQuizQuestions(updated);
                              }}
                              style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Submit Actions panel */}
                  <div className="editor-actions" style={{ 
                    marginTop: '2.5rem', 
                    borderTop: '1px solid #f1f5f9', 
                    paddingTop: '1.5rem',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '1rem'
                  }}>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => {
                        setSelectedArticleId(null);
                        setIsAddingNewArticle(false);
                      }}
                      style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      style={{ padding: '0.65rem 2rem', borderRadius: '8px', fontWeight: 700 }}
                    >
                      Simpan Artikel & Kuis
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}
        </div>
      )}

      {/* VIEW CONDITIONAL 3: ANNOUNCEMENTS MANAGEMENT */}
      {activeTab === 'admin_announcements' && (
        <div className="admin-layout-grid animate-fade-in" style={{ width: '100%' }}>
          
          {/* Left Column: Announcements List */}
          <section className="admin-table-card card">
            <div className="card-header admin-table-header" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Daftar Pengumuman Aktif</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                  Seluruh pengumuman di bawah akan bergulir secara otomatis pada papan berjalan halaman utama warga.
                </p>
              </div>
            </div>

            <div className="card-body no-padding table-responsive" style={{ padding: '0.75rem 1rem' }}>
              {announcements.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                  <p>Belum ada pengumuman desa. Gunakan form di sebelah kanan untuk menambahkan.</p>
                </div>
              ) : (
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th>Isi Pengumuman Desa</th>
                      <th className="text-right" style={{ width: '120px' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.map((ann) => (
                      <tr key={ann.id} className={selectedAnnId === ann.id ? 'row-selected' : ''}>
                        <td style={{ fontSize: '0.85rem', lineHeight: '1.5', padding: '1rem' }}>
                          {ann.text}
                        </td>
                        <td className="text-right actions-cell" style={{ padding: '1rem' }}>
                          <button 
                            type="button"
                            className="btn-action-icon btn-edit" 
                            onClick={() => handleEditAnnClick(ann)}
                            title="Edit Pengumuman"
                            style={{ marginRight: '0.4rem' }}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            type="button"
                            className="btn-action-icon btn-delete" 
                            onClick={() => handleDeleteAnnClick(ann.id)}
                            title="Hapus Pengumuman"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* Right Column: Announcement Creator / Editor */}
          <section className="admin-editor-card">
            <div className="card editor-active">
              <div className="card-header" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {selectedAnnId ? '✏️ Edit Pengumuman' : '📢 Tambah Pengumuman'}
                </h3>
                {selectedAnnId && (
                  <button 
                    type="button" 
                    className="btn-close-small" 
                    onClick={() => {
                      setSelectedAnnId(null);
                      setAnnouncementInput('');
                    }}
                    style={{ fontSize: '0.72rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveAnnouncement} className="card-body editor-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label htmlFor="annTextInput" style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.4rem', display: 'block' }}>Teks Pengumuman</label>
                  <p className="field-help" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                    Tuliskan pengumuman secara padat dan jelas. Gunakan emoji dekoratif di awal teks (seperti 🌿, 🗑️, ⚡, 📢) agar menarik perhatian warga.
                  </p>
                  <textarea 
                    id="annTextInput"
                    rows="6"
                    placeholder="Tulis pengumuman di sini..."
                    value={announcementInput}
                    onChange={(e) => setAnnouncementInput(e.target.value)}
                    required
                    style={{ padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.5' }}
                  />
                </div>

                <div className="editor-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setSelectedAnnId(null);
                      setAnnouncementInput('');
                    }}
                    style={{ padding: '0.5rem 1.25rem', borderRadius: '6px' }}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1.5rem', borderRadius: '6px', fontWeight: 700 }}
                  >
                    {selectedAnnId ? 'Simpan Perubahan' : 'Tambah Pengumuman'}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
