import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ShieldAlert, MapPin, Check, X, AlertTriangle } from 'lucide-react';

const SOSModal = ({ isOpen, onClose }) => {
  const { addReport } = useContext(AppContext);
  
  const [sosType, setSosType] = useState('Kebakaran Lahan/Sampah');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [coordinates, setCoordinates] = React.useState(null);
  const [gpsStatus, setGpsStatus] = React.useState('Mendeteksi lokasi...');

  // Request browser GPS location when modal is opened
  React.useEffect(() => {
    if (!isOpen) return;

    setGpsStatus('Melacak koordinat...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setGpsStatus('GPS Aktif (Lokasi Riil)');
        },
        (error) => {
          console.warn("Browser GPS permission denied or failed, using simulated village coordinates.", error);
          const fallbackLat = -6.354400 + (Math.random() - 0.5) * 0.003;
          const fallbackLng = 106.789200 + (Math.random() - 0.5) * 0.003;
          setCoordinates({ lat: fallbackLat, lng: fallbackLng });
          setGpsStatus('Simulasi (GPS Tidak Diizinkan)');
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      const fallbackLat = -6.354400 + (Math.random() - 0.5) * 0.003;
      const fallbackLng = 106.789200 + (Math.random() - 0.5) * 0.003;
      setCoordinates({ lat: fallbackLat, lng: fallbackLng });
      setGpsStatus('Simulasi (Browser tidak mendukung)');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    const finalLat = coordinates ? coordinates.lat : (-6.354400 + (Math.random() - 0.5) * 0.005);
    const finalLng = coordinates ? coordinates.lng : (106.789200 + (Math.random() - 0.5) * 0.005);

    const newReport = {
      title: `🚨 DARURAT SOS: ${sosType}`,
      description: description,
      category: 'Darurat SOS',
      severity: 'Tinggi',
      status: 'Menunggu',
      latitude: finalLat,
      longitude: finalLng,
      reporterName: 'Warga (Darurat)',
      photoUrl: ''
    };

    addReport(newReport);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDescription('');
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-backdrop sos-modal-backdrop" onClick={onClose}>
      <div className="modal-content card no-padding sos-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header Banner */}
        <div className="sos-modal-header">
          <div className="sos-header-grid">
            <div className="sos-icon-wrapper">
              <ShieldAlert size={22} className="animate-pulse" color="#ffffff" />
            </div>
            <div className="sos-title-text">
              <h2>SOS Darurat Desa</h2>
              <p>Pelaporan Cepat Bencana & Krisis Lingkungan</p>
            </div>
          </div>
          <button 
            type="button"
            className="btn-close-sos"
            onClick={onClose} 
            title="Tutup Modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="sos-modal-body">
          {isSubmitted ? (
            <div className="sos-success-state animate-fade-in">
              <div className="sos-success-icon-wrapper">
                <Check size={36} color="#ef4444" />
              </div>
              <h3>Laporan Darurat Terkirim!</h3>
              <p>
                Peta interaktif desa diperbarui. Tim tanggap darurat desa segera dikerahkan ke lokasi koordinat Anda.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="sos-form">
              {/* Warning Notice Box */}
              <div className="sos-notice-box">
                <AlertTriangle size={18} className="sos-notice-icon" />
                <div className="sos-notice-content">
                  <strong>PENTING:</strong> Gunakan fitur ini khusus untuk kondisi krisis lingkungan mendesak (api liar, luapan tanggul banjir, longsor). Penyalahgunaan akan dikenakan sanksi.
                </div>
              </div>

              {/* Form Input: Category */}
              <div className="form-group">
                <label className="sos-label">
                  JENIS KEDARURATAN
                </label>
                <select 
                  className="sos-select"
                  value={sosType} 
                  onChange={(e) => setSosType(e.target.value)}
                >
                  <option value="Kebakaran Lahan/Sampah">🔥 Kebakaran Lahan / Sampah Liar</option>
                  <option value="Banjir Bandang/Luapan Tanggul">🌊 Banjir Bandang / Luapan Tanggul</option>
                  <option value="Tanah Longsor / Pohon Tumbang">⛰️ Tanah Longsor / Pohon Tumbang</option>
                  <option value="Pencemaran Limbah Berbahaya">☣️ Pencemaran Limbah Cair/Kimia</option>
                </select>
              </div>

              {/* Form Input: Description */}
              <div className="form-group">
                <label className="sos-label">
                  DESKRIPSI KEJADIAN & LOKASI DETAIL
                </label>
                <textarea 
                  className="sos-textarea"
                  placeholder="Tuliskan kondisi terkini di lapangan dan patokan objek di sekitar lokasi (contoh: Api membesar dekat pohon jati RT 02)..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* GPS active live sensor animation badge */}
              <div className="sos-gps-card">
                <div className="sos-gps-row">
                  <div className="sos-gps-left">
                    <MapPin size={16} className="text-emerald animate-bounce" style={{ color: 'var(--emerald)' }} />
                    <span className="sos-gps-status-text">
                      {gpsStatus}
                    </span>
                  </div>
                  <div className="sos-gps-right">
                    <span className="live-pulse-dot" style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: gpsStatus.includes('Riil') ? 'var(--emerald)' : gpsStatus.includes('Melacak') ? 'var(--orange)' : 'var(--red)',
                      boxShadow: `0 0 6px ${gpsStatus.includes('Riil') ? 'var(--emerald)' : gpsStatus.includes('Melacak') ? 'var(--orange)' : 'var(--red)'}`,
                      display: 'inline-block'
                    }}></span>
                    <span style={{ 
                      fontSize: '0.68rem', 
                      color: gpsStatus.includes('Riil') ? 'var(--emerald)' : gpsStatus.includes('Melacak') ? 'var(--orange)' : 'var(--red)', 
                      fontWeight: 800, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.5px' 
                    }}>
                      {gpsStatus.includes('Riil') ? 'Tersinkronisasi' : gpsStatus.includes('Melacak') ? 'Mencari...' : 'Terbatas'}
                    </span>
                  </div>
                </div>
                {coordinates && (
                  <div className="sos-gps-coords">
                    📍 Koordinat GPS: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="sos-modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sos-cancel" 
                  onClick={onClose}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn btn-sos-submit"
                  disabled={!description.trim()}
                >
                  Kirim Darurat SOS
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SOSModal;
