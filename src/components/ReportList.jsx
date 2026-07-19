import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import MapView from './MapView';
import ReportForm from './ReportForm';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  User, 
  AlertOctagon, 
  ChevronRight, 
  X,
  FileImage,
  ArrowLeft,
  CheckCircle,
  Clock,
  Compass,
  Award
} from 'lucide-react';

const ReportList = () => {
  const { reports, currentUser, openAuthModal, showReportForm, setShowReportForm } = useContext(AppContext);
  
  // Navigation states
  const [selectedReport, setSelectedReport] = useState(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');

  // Hanya tampilkan laporan milik user yang sedang login, kecuali laporan SOS yang sudah selesai
  const myReports = currentUser
    ? reports.filter(rep => {
        const isOwner = rep.reporterName.toLowerCase() === currentUser.name.toLowerCase();
        const isResolvedSos = rep.category === 'Darurat SOS' && rep.status === 'Selesai';
        return isOwner && !isResolvedSos;
      })
    : [];

  // Filtered reports
  const filteredReports = myReports.filter((rep) => {
    const matchesSearch = 
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      rep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.id.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === 'Semua' || rep.category === selectedCategory;
    const matchesStatus = selectedStatus === 'Semua' || rep.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ['Semua', 'Sampah', 'Jalan Rusak', 'Penerangan Jalan', 'Fasilitas Umum'];
  const statuses = ['Semua', 'Menunggu', 'Diproses', 'Selesai'];

  // Helper to determine severity color
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Tinggi': return 'badge-danger';
      case 'Sedang': return 'badge-warning';
      case 'Rendah': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  // Helper to determine status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Selesai': return <CheckCircle size={16} className="text-green" />;
      case 'Diproses': return <Compass size={16} className="text-blue animate-spin-slow" />;
      case 'Menunggu': return <Clock size={16} className="text-orange" />;
      default: return null;
    }
  };

  return (
    <div className="reports-container">
      {showReportForm ? (
        <ReportForm 
          onCancel={() => setShowReportForm(false)} 
          onSuccess={() => setShowReportForm(false)} 
        />
      ) : (
        <>
          {/* Page Header */}
          <header className="page-header">
            <div className="header-title">
              <h1>Layanan Laporan Warga</h1>
              <p>Pantau laporan warga sekitar desa atau buat laporan baru jika melihat kendala.</p>
            </div>
            <button 
              className="btn btn-primary" 
              onClick={() => {
                if (!currentUser) {
                  openAuthModal('login');
                } else {
                  setShowReportForm(true);
                }
              }}
            >
              Laporkan Masalah Baru
            </button>
          </header>

          {/* Search and Filters Bar */}
          <section className="filters-card card">
            <div className="filters-bar">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Cari berdasarkan judul, nama warga, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-dropdowns">
                <div className="filter-group">
                  <Filter size={14} className="text-gray-400" />
                  <span>Kategori:</span>
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="filter-group">
                  <span>Status:</span>
                  <select 
                    value={selectedStatus} 
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    {statuses.map(st => <option key={st} value={st}>{st === 'Semua' ? 'Semua Status' : st}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Reports Grid */}
          <section className="reports-list-section">
            <h3 className="section-title">
              {currentUser
                ? `Menampilkan ${filteredReports.length} dari ${myReports.length} laporan Anda`
                : 'Menampilkan 0 laporan'}
            </h3>

            {!currentUser ? (
              <div className="empty-state-card card">
                <AlertOctagon size={48} className="text-gray-500" />
                <h3>Belum Masuk Akun</h3>
                <p>Silakan masuk akun warga untuk melihat dan melacak laporan aduan Anda.</p>
                <button className="btn btn-primary" onClick={() => openAuthModal('login')} style={{ marginTop: '0.5rem' }}>
                  Masuk Akun Warga
                </button>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="empty-state-card card">
                <AlertOctagon size={48} className="text-gray-500" />
                <h3>Belum ada laporan</h3>
                <p>Anda belum pernah membuat laporan. Klik tombol <strong>Laporkan Masalah Baru</strong> untuk mulai melapor.</p>
              </div>
            ) : (
              <div className="reports-grid">
                {filteredReports.map((report) => (
                  <div key={report.id} className="report-card card hover-lift" onClick={() => setSelectedReport(report)}>
                    {/* Header */}
                    <div className="report-card-header">
                      <span className={`badge-category`}>{report.category}</span>
                      <span className={`badge-severity ${getSeverityBadge(report.severity)}`}>
                        {report.severity}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <div className="report-card-body">
                      <span className="report-id">{report.id}</span>
                      <h3>{report.title}</h3>
                      <p>{report.description.substring(0, 120)}...</p>

                      {/* Image Thumbnail (If exist) */}
                      {report.image && (
                        <div className="report-thumbnail-wrapper">
                          <FileImage size={14} className="text-gray-400" />
                          <span>Mempunyai lampiran foto</span>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="report-card-footer">
                      <div className="footer-left">
                        <span className="reporter-meta"><User size={12} /> {report.reporterName}</span>
                        <span className="date-meta"><Calendar size={12} /> {new Date(report.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                      </div>
                      <div className="footer-right">
                        <span className={`status-text-badge status-${report.status.toLowerCase()}`}>
                          {getStatusIcon(report.status)}
                          <span>{report.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Report Detail Modal */}
          {selectedReport && (
            <div className="modal-backdrop">
              <div className="modal-content card">
                {/* Modal Header */}
                <div className="modal-header">
                  <div className="modal-header-title">
                    <span className="report-id">{selectedReport.id}</span>
                    <h2>{selectedReport.title}</h2>
                  </div>
                  <button className="btn-close-modal" onClick={() => setSelectedReport(null)}>
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                  <div className="modal-layout-grid">
                    {/* Left Column - Details */}
                    <div className="modal-details-col">
                      <div className="detail-meta-box">
                        <div className="meta-item">
                          <User size={16} />
                          <div>
                            <span>Pelapor</span>
                            <strong>{selectedReport.reporterName}</strong>
                          </div>
                        </div>

                        <div className="meta-item">
                          <Calendar size={16} />
                          <div>
                            <span>Tanggal Melapor</span>
                            <strong>{new Date(selectedReport.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>
                          </div>
                        </div>

                        <div className="meta-item">
                          <AlertOctagon size={16} />
                          <div>
                            <span>Urgensi</span>
                            <strong className={`text-urgency-${selectedReport.severity.toLowerCase()}`}>{selectedReport.severity}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Stepper Status */}
                      <div className="status-stepper-box">
                        <h4>Status Penanganan</h4>
                        <div className="stepper">
                          <div className={`step ${selectedReport.status === 'Menunggu' || selectedReport.status === 'Diproses' || selectedReport.status === 'Selesai' ? 'step-active' : ''}`}>
                            <div className="step-number">1</div>
                            <span className="step-title">Menunggu</span>
                          </div>
                          <div className={`step-line ${selectedReport.status === 'Diproses' || selectedReport.status === 'Selesai' ? 'line-active' : ''}`} />
                          <div className={`step ${selectedReport.status === 'Diproses' || selectedReport.status === 'Selesai' ? 'step-active' : ''}`}>
                            <div className="step-number">2</div>
                            <span className="step-title">Diproses</span>
                          </div>
                          <div className={`step-line ${selectedReport.status === 'Selesai' ? 'line-active' : ''}`} />
                          <div className={`step ${selectedReport.status === 'Selesai' ? 'step-active' : ''}`}>
                            <div className="step-number">3</div>
                            <span className="step-title">Selesai</span>
                          </div>
                        </div>

                        {/* User-friendly status details helper card */}
                        <div className="status-explanation-card" style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--border-glass)',
                          borderRadius: '10px',
                          padding: '1rem 1.25rem',
                          marginTop: '1.25rem',
                          textAlign: 'left'
                        }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>Detail Penjelasan Status</span>
                          <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                            {selectedReport.status === 'Menunggu' && 'Laporan Anda telah berhasil masuk ke sistem desa dan berada dalam antrean peninjauan. Perangkat desa akan segera datang untuk memeriksa lokasi kejadian.'}
                            {selectedReport.status === 'Diproses' && 'Perangkat desa telah memverifikasi laporan. Saat ini, tim teknis atau petugas kebersihan lapangan sedang melakukan pengerjaan perbaikan di lokasi.'}
                            {selectedReport.status === 'Selesai' && 'Masalah telah selesai ditangani dan divalidasi oleh desa. Poin penghargaan dan lencana peduli lingkungan telah dikirimkan ke akun pelapor. Terima kasih!'}
                          </p>
                        </div>
                      </div>

                      <div className="detail-description">
                        <h4>Deskripsi Laporan</h4>
                        <p>{selectedReport.description}</p>
                      </div>

                      {/* Photo Attachment */}
                      {selectedReport.image && (
                        <div className="detail-photo-attachment">
                          <h4>Foto Bukti Terlampir</h4>
                          <img src={selectedReport.image} alt="Bukti Kejadian" className="modal-attached-photo" />
                        </div>
                      )}

                      {/* Admin Note Section */}
                      <div className="detail-admin-note-section">
                        <h4>Tanggapan Pemerintah Desa</h4>
                        
                        {selectedReport.pointsAwarded > 0 && (
                          <div className="points-rewarded-toast animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.25)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            <Award size={16} className="text-gold" />
                            <span><strong>+{selectedReport.pointsAwarded} Eco-Points</strong> telah ditambahkan ke akun Anda oleh Admin atas penyelesaian masalah ini.</span>
                          </div>
                        )}

                        {selectedReport.adminNote ? (
                          <div className={`admin-note-box note-status-${selectedReport.status.toLowerCase()}`}>
                            <p>"{selectedReport.adminNote}"</p>
                            <span className="note-author">Ditanggapi oleh: <strong>Pemerintah Desa SmartVillage</strong></span>
                          </div>
                        ) : (
                          <div className="admin-note-empty">
                            <p>Belum ada tanggapan resmi dari perangkat desa. Laporan Anda sedang dalam antrean verifikasi.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column - Map Location */}
                    <div className="modal-map-col">
                      <h4>Peta Lokasi Kejadian</h4>
                      <div className="modal-map-container">
                        <MapView 
                          reports={[selectedReport]} 
                          center={[selectedReport.latitude, selectedReport.longitude]} 
                          zoom={16}
                          height="280px"
                        />
                      </div>
                      <div className="location-coordinates">
                        <MapPin size={14} />
                        <span>Koordinat: <strong>{selectedReport.latitude.toFixed(6)}, {selectedReport.longitude.toFixed(6)}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setSelectedReport(null)}>
                    Tutup Detail
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportList;
