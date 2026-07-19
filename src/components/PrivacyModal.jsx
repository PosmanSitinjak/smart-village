import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Shield, Lock, EyeOff, Server, X } from 'lucide-react';

const PrivacyModal = () => {
  const { isPrivacyModalOpen, setIsPrivacyModalOpen } = useContext(AppContext);

  if (!isPrivacyModalOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setIsPrivacyModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-logo" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} className="text-emerald" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Kebijakan Privasi & Ketentuan Data</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Kepatuhan Kriteria Keamanan SmartVillage v1.0</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={() => setIsPrivacyModalOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem 2rem', maxHeight: '60vh', overflowY: 'auto' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Sebagai platform layanan digital warga desa, kami berkomitmen untuk melindungi informasi pribadi Anda. Berikut adalah rincian kebijakan pengelolaan data di platform SmartVillage:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Poin 1: Penyimpanan Aman */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#f0fdf4', padding: '0.5rem', borderRadius: '8px', color: 'var(--emerald)', flexShrink: 0 }}>
                <Lock size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>1. Perlindungan & Enkripsi Lokal</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Seluruh kredensial akun warga (password) dienkripsi secara dasar dan disimpan langsung menggunakan mekanisme sandboxing aman <strong>Local Storage Browser</strong> Anda. Tidak ada pihak luar yang dapat mengakses data sandi Anda secara ilegal.
                </p>
              </div>
            </div>

            {/* Poin 2: Kerahasiaan Identitas */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#f0fdf4', padding: '0.5rem', borderRadius: '8px', color: 'var(--emerald)', flexShrink: 0 }}>
                <EyeOff size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>2. Anonimitas & Kerahasiaan Aduan</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Platform menjamin kerahasiaan identitas pelapor dalam pelacakan publik. Detail informasi kontak warga hanya dapat diakses oleh Perangkat Desa yang bertindak sebagai Administrator untuk keperluan verifikasi lapangan.
                </p>
              </div>
            </div>

            {/* Poin 3: Transparansi Data */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#f0fdf4', padding: '0.5rem', borderRadius: '8px', color: 'var(--emerald)', flexShrink: 0 }}>
                <Server size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>3. Penggunaan Data Tepat Guna</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Setiap foto bukti masalah dan koordinat lokasi yang diunggah warga hanya digunakan untuk mengarahkan petugas lapangan dalam memperbaiki fasilitas umum. Kami tidak pernah membagikan data kepada pihak ketiga iklan atau pelacak.
                </p>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px dashed rgba(16, 185, 129, 0.25)', borderRadius: '8px', padding: '1rem', marginTop: '1.75rem' }}>
            <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--emerald)', textTransform: 'uppercase', marginBottom: '0.25rem', letterSpacing: '0.5px' }}>
              Pernyataan Kepatuhan Hukum
            </span>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
              Sistem informasi SmartVillage mematuhi standar dasar perlindungan informasi privasi publik sesuai dengan UU Perlindungan Data Pribadi (PDP) Republik Indonesia.
            </p>
          </div>
        </div>

        <div className="modal-footer" style={{ 
          borderTop: '1px solid #f1f5f9', 
          padding: '1.25rem 2rem', 
          display: 'flex', 
          justifyContent: 'flex-end',
          backgroundColor: '#ffffff'
        }}>
          <button className="btn btn-primary btn-sm" onClick={() => setIsPrivacyModalOpen(false)} style={{ padding: '0.55rem 1.5rem', borderRadius: '8px', fontWeight: 700 }}>
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
