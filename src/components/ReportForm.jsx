import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import MapView from './MapView';
import { Camera, MapPin, AlertCircle, Check } from 'lucide-react';

const ReportForm = ({ onCancel, onSuccess }) => {
  const { addReport, addPoints, currentUser } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sampah');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Sedang');
  const [reporterName, setReporterName] = useState(currentUser ? currentUser.name : '');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [image, setImage] = useState('');
  
  // Map search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [mapCenter, setMapCenter] = useState([-6.354400, 106.789200]);

  // Status states
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Search location coordinates using Nominatim OpenStreetMap API
  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setSearchError('');

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);

        setMapCenter([newLat, newLng]);
        handleLocationSelect(newLat, newLng);
      } else {
        setSearchError('Lokasi tidak ditemukan. Coba masukkan nama jalan yang lebih spesifik.');
      }
    } catch (err) {
      console.error('Location search error:', err);
      setSearchError('Gagal mencari lokasi. Pastikan koneksi internet terhubung.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle image upload and convert to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Callback from MapView when clicked
  const handleLocationSelect = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
    // Clear map error if selected
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Judul laporan wajib diisi';
    if (!description.trim()) newErrors.description = 'Deskripsi detail wajib diisi';
    if (!reporterName.trim()) newErrors.reporterName = 'Nama pelapor wajib diisi';
    if (latitude === null || longitude === null) {
      newErrors.location = 'Harap tandai lokasi masalah pada peta di bawah';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const reportData = {
      title,
      category,
      description,
      severity,
      reporterName,
      latitude,
      longitude,
      image,
      status: 'Menunggu' // Default status is pending
    };

    addReport(reportData);

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      if (onSuccess) onSuccess();
    }, 2000);
  };

  return (
    <div className="report-form-container card">
      {isSuccess ? (
        <div className="form-success-overlay">
          <div className="success-icon-badge animate-bounce">
            <Check size={40} className="text-white" />
          </div>
          <h2>Laporan Berhasil Dikirim!</h2>
          <p>Terima kasih atas kepedulian Anda. Laporan Anda akan ditinjau oleh Admin untuk pemberian Eco-Points.</p>
          <p className="text-sm text-gray-400">Menghubungkan ke sistem desa...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="report-form">
          <div className="card-header">
            <h2>Buat Laporan Baru</h2>
            <p>Laporkan kendala fasilitas atau kebersihan agar segera ditindaklanjuti oleh petugas desa.</p>
          </div>

          <div className="card-body form-grid">
            {/* Left Column - Text Inputs */}
            <div className="form-left-col">
              <div className="form-group">
                <label htmlFor="reporterName">Nama Lengkap Pelapor</label>
                <input 
                  type="text" 
                  id="reporterName" 
                  value={reporterName}
                  readOnly
                  disabled
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', color: 'var(--text-muted)', cursor: 'not-allowed', border: '1px solid rgba(255,255,255,0.05)' }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="title">Judul Masalah / Laporan</label>
                <input 
                  type="text" 
                  id="title" 
                  placeholder="Contoh: Jalan lubang besar RT 02"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={errors.title ? 'input-error' : ''}
                />
                {errors.title && <span className="error-msg"><AlertCircle size={12} /> {errors.title}</span>}
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="category">Kategori Masalah</label>
                  <select 
                    id="category" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Sampah">Sampah</option>
                    <option value="Jalan Rusak">Jalan Rusak</option>
                    <option value="Penerangan Jalan">Penerangan Jalan</option>
                    <option value="Fasilitas Umum">Fasilitas Umum</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="severity">Tingkat Urgensi</label>
                  <select 
                    id="severity" 
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                  >
                    <option value="Rendah">Rendah (Dapat menunggu)</option>
                    <option value="Sedang">Sedang (Perlu segera)</option>
                    <option value="Tinggi">Tinggi (Membahayakan/Gawat)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Detail Deskripsi Masalah</label>
                <textarea 
                  id="description" 
                  rows="4"
                  placeholder="Jelaskan secara detail mengenai masalah yang terjadi di lapangan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={errors.description ? 'input-error' : ''}
                />
                {errors.description && <span className="error-msg"><AlertCircle size={12} /> {errors.description}</span>}
              </div>

              {/* Photo Upload Section */}
              <div className="form-group">
                <label>Foto Bukti Kejadian (Opsional)</label>
                <div className="photo-upload-zone">
                  {image ? (
                    <div className="photo-preview-container">
                      <img src={image} alt="Pratinjau Laporan" className="photo-preview" />
                      <button type="button" className="btn-remove-photo" onClick={() => setImage('')}>
                        Hapus Foto
                      </button>
                    </div>
                  ) : (
                    <label className="upload-placeholder">
                      <Camera size={24} className="text-gray-400" />
                      <span>Klik untuk unggah atau seret foto bukti</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Map Location Picker */}
            <div className="form-right-col">
              <div className="form-group">
                <label>Pilih Koordinat Lokasi pada Peta</label>
                <p className="field-help">
                  <MapPin size={12} /> Cari nama jalan atau klik peta di bawah untuk menempatkan penanda (pin) letak masalah terjadi secara presisi.
                </p>

                {/* Location Search Bar */}
                <div className="map-search-bar-wrapper" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Cari jalan, RT/RW, atau prasarana desa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ 
                      flex: 1, 
                      padding: '0.65rem 0.9rem', 
                      fontSize: '0.82rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.35)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleLocationSearch(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleLocationSearch}
                    disabled={searchLoading}
                    style={{ minWidth: '85px', padding: '0.65rem 1rem', fontSize: '0.82rem' }}
                  >
                    {searchLoading ? 'Mencari...' : 'Cari'}
                  </button>
                </div>
                {searchError && <span className="error-msg" style={{ display: 'block', marginBottom: '0.5rem' }}><AlertCircle size={12} /> {searchError}</span>}

                <div className="map-picker-container">
                  <MapView 
                    interactive={true} 
                    onLocationSelect={handleLocationSelect} 
                    selectedLocation={latitude && longitude ? { lat: latitude, lng: longitude } : null}
                    center={mapCenter}
                    height="280px"
                  />
                </div>
                {errors.location && <span className="error-msg"><AlertCircle size={12} /> {errors.location}</span>}

                {/* Lat/Lng display boxes */}
                {latitude && longitude && (
                  <div className="coords-display">
                    <div className="coord-box">
                      <span>Latitude</span>
                      <strong>{latitude.toFixed(6)}</strong>
                    </div>
                    <div className="coord-box">
                      <span>Longitude</span>
                      <strong>{longitude.toFixed(6)}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card-footer form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Kirim Laporan Warga
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReportForm;
