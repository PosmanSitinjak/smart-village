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
          // Fallback to Balai Desa Depok/Jakarta simulation
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

    // Gunakan koordinat GPS riil yang berhasil dideteksi, atau default jika belum siap
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
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ 
        maxWidth: '500px', 
        width: '90%',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(220, 38, 38, 0.15), 0 0 40px rgba(0,0,0,0.1)',
        border: '1px solid rgba(220, 38, 38, 0.25)',
        backgroundColor: '#ffffff',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Glowing Header Banner */}
        <div className="modal-header" style={{ 
          background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', 
          borderBottom: 'none',
          padding: '1.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative'
        }}>
          {/* Subtle Grid Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'radial-gradient(#fff 1px, transparent 0)',
            backgroundSize: '12px 12px',
            pointerEvents: 'none'
          }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', zIndex: 1 }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              backdropFilter: 'blur(5px)',
              border: '1.5px solid rgba(255, 255, 255, 0.4)', 
              width: '44px', 
              height: '44px', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)'
            }}>
              <ShieldAlert size={24} className="text-white animate-pulse" style={{ color: '#ffffff' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                SOS Darurat Desa
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.85)', margin: '0.15rem 0 0 0', fontWeight: '500' }}>
                Pelaporan Cepat Bencana & Krisis Lingkungan
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              zIndex: 1
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '2rem 2.25rem' }}>
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 0' }} className="animate-fade-in">
              <div style={{ 
                background: 'rgba(239, 68, 68, 0.08)', 
                border: '2px solid #ef4444', 
                width: '72px', 
                height: '72px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 1.5rem auto',
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.25)',
                animation: 'bounce 1s infinite'
              }}>
                <Check size={36} style={{ color: '#ef4444' }} />
              </div>
              <h3 style={{ color: '#b91c1c', fontWeight: 800, fontSize: '1.4rem' }}>Laporan Darurat Terkirim!</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.5', maxWidth: '340px', margin: '0.5rem auto 0 auto' }}>
                Peta interaktif desa diperbarui. Tim tanggap darurat desa segera dikerahkan ke lokasi koordinat Anda.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Premium Warning Notice */}
              <div style={{ 
                display: 'flex',
                gap: '0.85rem',
                backgroundColor: 'rgba(239, 68, 68, 0.05)', 
                border: '1px solid rgba(239, 68, 68, 0.2)', 
                padding: '1rem 1.25rem', 
                borderRadius: '12px',
                lineHeight: 1.5
              }}>
                <AlertTriangle size={20} style={{ color: '#ef4444', flexShrink: 0, marginTop: '0.1rem' }} />
                <div style={{ fontSize: '0.8rem', color: '#991b1b', fontWeight: '500' }}>
                  <strong style={{ fontWeight: 800 }}>PENTING:</strong> Gunakan fitur ini khusus untuk kondisi krisis lingkungan mendesak (api liar, luapan tanggul banjir, longsor). Penyalahgunaan fitur SOS akan dikenakan sanksi perangkat desa.
                </div>
              </div>

              {/* Form Input: Category */}
              <div className="form-group">
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'block' }}>
                  Jenis Kedaruratan
                </label>
                <select 
                  value={sosType} 
                  onChange={(e) => setSosType(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '10px', 
                    border: '1.5px solid #f87171', 
                    backgroundColor: '#ffffff',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem', 
                    fontWeight: '600',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#f87171';
                    e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                  }}
                >
                  <option value="Kebakaran Lahan/Sampah">🔥 Kebakaran Lahan / Sampah Liar</option>
                  <option value="Banjir Bandang/Luapan Tanggul">🌊 Banjir Bandang / Luapan Tanggul</option>
                  <option value="Tanah Longsor / Pohon Tumbang">⛰️ Tanah Longsor / Pohon Tumbang</option>
                  <option value="Pencemaran Limbah Berbahaya">☣️ Pencemaran Limbah Cair/Kimia</option>
                </select>
              </div>

              {/* Form Input: Description */}
              <div className="form-group">
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'block' }}>
                  Deskripsi Kejadian & Lokasi Detail
                </label>
                <textarea 
                  placeholder="Tuliskan kondisi terkini di lapangan dan patokan objek di sekitar lokasi (contoh: Api membesar dekat pohon jati RT 02 belakang kebun bambu)..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  style={{ 
                    width: '100%', 
                    minHeight: '100px', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '10px', 
                    border: '1.5px solid #fecaca', 
                    fontSize: '0.85rem', 
                    outline: 'none', 
                    resize: 'vertical',
                    lineHeight: '1.5',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.12)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#fecaca';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* GPS active live sensor animation badge */}
              <div style={{ 
                background: '#f8fafc', 
                padding: '0.85rem 1.1rem', 
                borderRadius: '10px', 
                border: '1px solid #e2e8f0', 
                marginBottom: '0.5rem' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <MapPin size={16} className="text-emerald animate-bounce" style={{ color: 'var(--emerald)' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                      {gpsStatus}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span className="live-pulse-dot" style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: gpsStatus.includes('Riil') ? 'var(--emerald)' : gpsStatus.includes('Melacak') ? 'var(--orange)' : 'var(--red)',
                      boxShadow: `0 0 8px ${gpsStatus.includes('Riil') ? 'var(--emerald)' : gpsStatus.includes('Melacak') ? 'var(--orange)' : 'var(--red)'}`,
                      display: 'inline-block'
                    }}></span>
                    <span style={{ 
                      fontSize: '0.72rem', 
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
                  <div style={{ 
                    fontSize: '0.72rem', 
                    color: 'var(--text-muted)', 
                    fontFamily: 'monospace',
                    background: '#f1f5f9',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    textAlign: 'left'
                  }}>
                    📍 Koordinat GPS: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="auth-actions" style={{ 
                display: 'flex', 
                gap: '0.85rem', 
                justifyContent: 'flex-end', 
                marginTop: '0.5rem' 
              }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={onClose}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn" 
                  disabled={!description.trim()}
                  style={{ 
                    background: description.trim() ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : '#ef444480', 
                    color: '#ffffff',
                    padding: '0.65rem 1.5rem',
                    borderRadius: '10px',
                    fontWeight: 750,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: description.trim() ? 'pointer' : 'not-allowed',
                    boxShadow: description.trim() ? '0 4px 15px rgba(220, 38, 38, 0.25)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (description.trim()) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.35)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (description.trim()) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.25)';
                    }
                  }}
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
