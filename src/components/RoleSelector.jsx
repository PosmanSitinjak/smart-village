import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Leaf, AlertCircle, Check, UserPlus, ShieldAlert, X } from 'lucide-react';

const RoleSelector = () => {
  const { 
    setIsAuthModalOpen, 
    authModalTab, 
    setAuthModalTab, 
    loginUser, 
    registerUser, 
    resetPassword,
    loginAdmin,
    setIsPrivacyModalOpen,
    users
  } = useContext(AppContext);
  
  // Warga Form states
  const [wargaUsername, setWargaUsername] = useState('');
  const [wargaPassword, setWargaPassword] = useState('');
  const [wargaFullName, setWargaFullName] = useState('');
  const [wargaConfirmPassword, setWargaConfirmPassword] = useState('');
  
  // Admin PIN form states
  const [adminPin, setAdminPin] = useState('');

  // Lupa Password Form states
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1: input user & verify, 2: input new password
  
  // Validation / Feedback states
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle Citizen (Warga) Login
  const handleWargaLoginSubmit = (e) => {
    e.preventDefault();
    if (!wargaUsername.trim() || !wargaPassword.trim()) {
      setErrorMsg('Harap isi username dan password');
      return;
    }

    const res = loginUser(wargaUsername, wargaPassword);
    if (res.success) {
      setIsSuccess(true);
      setErrorMsg('');
      setTimeout(() => {
        setIsSuccess(false);
      }, 1000);
    } else {
      setErrorMsg(res.message);
    }
  };

  // Handle Citizen (Warga) Registration
  const handleWargaRegisterSubmit = (e) => {
    e.preventDefault();
    if (!wargaFullName.trim() || !wargaUsername.trim() || !wargaPassword.trim() || !wargaConfirmPassword.trim()) {
      setErrorMsg('Semua kolom pendaftaran wajib diisi');
      return;
    }

    if (wargaPassword !== wargaConfirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok');
      return;
    }

    const res = registerUser(wargaUsername, wargaPassword, wargaFullName);
    if (res.success) {
      setIsSuccess(true);
      setErrorMsg('');
      setTimeout(() => {
        setIsSuccess(false);
        // Automatically switch to login and pre-fill details
        setAuthModalTab('login');
        setWargaUsername(wargaUsername.toLowerCase());
        setWargaPassword('');
        setWargaConfirmPassword('');
      }, 1500);
    } else {
      setErrorMsg(res.message);
    }
  };

  // Handle verifying username for password reset
  const handleVerifyUsername = (e) => {
    e.preventDefault();
    if (!forgotUsername.trim()) {
      setErrorMsg('Harap isi username Anda');
      return;
    }
    const exists = users.some(u => u.username.toLowerCase() === forgotUsername.toLowerCase().trim());
    if (exists) {
      setErrorMsg('');
      setForgotStep(2);
    } else {
      setErrorMsg('Username tidak terdaftar di database desa');
    }
  };

  // Handle saving new password
  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!forgotNewPassword.trim() || !forgotConfirmPassword.trim()) {
      setErrorMsg('Harap isi password baru Anda');
      return;
    }
    if (forgotNewPassword.length < 4) {
      setErrorMsg('Kata sandi minimal 4 karakter');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok');
      return;
    }
    const res = resetPassword(forgotUsername.trim(), forgotNewPassword);
    if (res.success) {
      setIsSuccess(true);
      setErrorMsg('');
      setTimeout(() => {
        setIsSuccess(false);
        setAuthModalTab('login');
        setForgotUsername('');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
        setForgotStep(1);
      }, 1500);
    } else {
      setErrorMsg(res.message);
    }
  };

  // Handle Admin Login
  const handleAdminSubmit = (e) => {
    e.preventDefault();
    const res = loginAdmin(adminPin);
    if (res.success) {
      setIsSuccess(true);
      setErrorMsg('');
      setTimeout(() => {
        setIsSuccess(false);
      }, 1000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
    setErrorMsg('');
  };

  return (
    <div className="role-selector-container">
      <div className="role-selector-card card animate-fade-in" style={{ position: 'relative' }}>
        
        {/* Close Button */}
        <button 
          className="btn-close-modal" 
          onClick={handleCloseModal}
          title="Tutup Halaman Masuk"
          style={{ 
            position: 'absolute', 
            top: '1.5rem', 
            right: '1.5rem', 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-muted)', 
            cursor: 'pointer',
            padding: '0.25rem',
            transition: 'var(--transition-smooth)'
          }}
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="selector-brand">
          <div className="brand-logo">
            <Leaf className="logo-icon" size={30} />
          </div>
          <h1>SmartVillage</h1>
          <p>Sistem Informasi Lingkungan & Fasilitas Desa Hijau Digital</p>
        </div>

        <hr className="selector-divider" />

        {/* Citizen (Warga) Login Screen */}
        {authModalTab === 'login' && (
          <div className="auth-screen animate-fade-in">
            {isSuccess ? (
              <div className="login-success-overlay">
                <div className="login-success-badge animate-bounce">
                  <Check size={32} className="text-white" />
                </div>
                <h3>Masuk Berhasil</h3>
                <p>Membuka Portal Warga...</p>
              </div>
            ) : (
              <form onSubmit={handleWargaLoginSubmit} className="auth-form">
                <h3>Masuk Akun Warga</h3>
                <p className="text-muted">Masukkan username dan password akun warga Anda.</p>
                
                <div className="form-group">
                  <label htmlFor="loginUser">Username</label>
                  <input 
                    type="text" 
                    id="loginUser" 
                    placeholder="Username Anda..." 
                    value={wargaUsername}
                    onChange={(e) => {
                      setWargaUsername(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    autoFocus
                    className={errorMsg && !wargaUsername ? 'input-error' : ''}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label htmlFor="loginPass" style={{ margin: 0 }}>Password</label>
                    <button 
                      type="button" 
                      className="btn-link"
                      style={{ fontSize: '0.75rem', fontWeight: 600, padding: 0 }}
                      onClick={() => {
                        setAuthModalTab('forgot');
                        setErrorMsg('');
                        setForgotStep(1);
                        setForgotUsername('');
                      }}
                    >
                      Lupa Kata Sandi?
                    </button>
                  </div>
                  <input 
                    type="password" 
                    id="loginPass" 
                    placeholder="Password Anda..." 
                    value={wargaPassword}
                    onChange={(e) => {
                      setWargaPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className={errorMsg && !wargaPassword ? 'input-error' : ''}
                  />
                  {errorMsg ? (
                    <span className="error-msg"><AlertCircle size={12} /> {errorMsg}</span>
                  ) : (
                    <span className="pin-hint">Akun bawaan demo: Username: <strong>budi</strong> | Sandi: <strong>123</strong></span>
                  )}
                </div>

                <div className="auth-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Masuk Warga
                  </button>
                </div>

                <div className="auth-switch-link" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                  <div>
                    <span>Belum memiliki akun? </span>
                    <button type="button" className="btn-link" onClick={() => { setAuthModalTab('register'); setErrorMsg(''); }}>
                      Daftar Baru <UserPlus size={12} />
                    </button>
                  </div>
                  <div style={{ marginTop: '0.25rem' }}>
                    <span>Otoritas Khusus? </span>
                    <button type="button" className="btn-link" style={{ color: 'var(--red)' }} onClick={() => { setAuthModalTab('admin'); setErrorMsg(''); }}>
                      Portal Staff Desa / Admin
                    </button>
                  </div>
                </div>

                <p style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5, margin: '1.25rem 0 0 0' }}>
                  🔒 Transparansi Data:{' '}
                  <button 
                    type="button" 
                    className="btn-link" 
                    style={{ fontSize: '0.75rem', fontWeight: 700, textDecoration: 'underline', color: 'var(--emerald)', display: 'inline' }} 
                    onClick={() => setIsPrivacyModalOpen(true)}
                  >
                    Baca Kebijakan Privasi
                  </button>
                </p>
              </form>
            )}
          </div>
        )}

        {/* Citizen (Warga) Register Screen */}
        {authModalTab === 'register' && (
          <div className="auth-screen animate-fade-in">
            {isSuccess ? (
              <div className="login-success-overlay">
                <div className="login-success-badge animate-bounce">
                  <Check size={32} className="text-white" />
                </div>
                <h3>Pendaftaran Berhasil!</h3>
                <p>Akun warga terdaftar. Mengarahkan ke form Login...</p>
              </div>
            ) : (
              <form onSubmit={handleWargaRegisterSubmit} className="auth-form max-w-md">
                <h3>Pendaftaran Warga Baru</h3>
                <p className="text-muted">Lengkapi formulir di bawah ini untuk membuat akun SmartVillage.</p>
                
                <div className="form-group">
                  <label htmlFor="regName">Nama Lengkap</label>
                  <input 
                    type="text" 
                    id="regName" 
                    placeholder="Contoh: Budi Santoso" 
                    value={wargaFullName}
                    onChange={(e) => {
                      setWargaFullName(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="regUser">Username Pilihan</label>
                  <input 
                    type="text" 
                    id="regUser" 
                    placeholder="Contoh: budi123" 
                    value={wargaUsername}
                    onChange={(e) => {
                      setWargaUsername(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="regPass">Password</label>
                    <input 
                      type="password" 
                      id="regPass" 
                      placeholder="Password..." 
                      value={wargaPassword}
                      onChange={(e) => {
                        setWargaPassword(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="regConfirmPass">Ulangi Password</label>
                    <input 
                      type="password" 
                      id="regConfirmPass" 
                      placeholder="Ulangi..." 
                      value={wargaConfirmPassword}
                      onChange={(e) => {
                        setWargaConfirmPassword(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                    />
                  </div>
                </div>

                {errorMsg && <span className="error-msg" style={{ marginBottom: '1.25rem' }}><AlertCircle size={12} /> {errorMsg}</span>}

                <div className="auth-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => { setAuthModalTab('login'); setErrorMsg(''); }}>
                    Kembali
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Daftar Akun
                  </button>
                </div>

                <div className="auth-switch-link">
                  <span>Sudah terdaftar? </span>
                  <button type="button" className="btn-link" onClick={() => { setAuthModalTab('login'); setErrorMsg(''); }}>
                    Masuk Sekarang
                  </button>
                </div>

                <p style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5, margin: '1.25rem 0 0 0' }}>
                  Dengan mendaftar, Anda menyetujui{' '}
                  <button 
                    type="button" 
                    className="btn-link" 
                    style={{ fontSize: '0.75rem', fontWeight: 700, textDecoration: 'underline', color: 'var(--emerald)', display: 'inline' }} 
                    onClick={() => setIsPrivacyModalOpen(true)}
                  >
                    Ketentuan Data & Privasi
                  </button>
                </p>
              </form>
            )}
          </div>
        )}

        {/* Staff/Admin Login Screen */}
        {authModalTab === 'admin' && (
          <div className="admin-pin-screen animate-fade-in">
            {isSuccess ? (
              <div className="login-success-overlay">
                <div className="login-success-badge animate-bounce">
                  <Check size={32} className="text-white" />
                </div>
                <h3>Autentikasi Berhasil</h3>
                <p>Membuka Portal Administrasi Desa...</p>
              </div>
            ) : (
              <form onSubmit={handleAdminSubmit} className="admin-login-form">
                <div className="admin-header-lock" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--red)' }}>
                  <ShieldAlert size={40} />
                </div>
                <h3>Masuk Portal Staff Desa</h3>
                <p className="text-muted">Masukkan PIN otorisasi untuk mengakses basis data pelaporan.</p>
                
                <div className="form-group">
                  <input 
                    type="password" 
                    placeholder="PIN Admin..." 
                    value={adminPin}
                    onChange={(e) => {
                      setAdminPin(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    autoFocus
                    className={errorMsg ? 'input-error' : ''}
                    style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '2px' }}
                  />
                  {errorMsg ? (
                    <span className="error-msg" style={{ display: 'flex', justifyContent: 'center' }}><AlertCircle size={12} /> {errorMsg}</span>
                  ) : (
                    <span className="pin-hint">Petunjuk PIN default: <strong>admin</strong></span>
                  )}
                </div>

                <div className="admin-login-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => { setAuthModalTab('login'); setErrorMsg(''); }}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={!adminPin.trim()}>
                    Masuk Admin
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Lupa Password Screen (Forgot Password Form) */}
        {authModalTab === 'forgot' && (
          <div className="auth-screen animate-fade-in">
            {isSuccess ? (
              <div className="login-success-overlay">
                <div className="login-success-badge animate-bounce" style={{ backgroundColor: 'var(--emerald)' }}>
                  <Check size={32} className="text-white" />
                </div>
                <h3>Kata Sandi Diperbarui</h3>
                <p>Kata sandi berhasil disetel ulang. Mengalihkan ke halaman Masuk...</p>
              </div>
            ) : forgotStep === 1 ? (
              <form onSubmit={handleVerifyUsername} className="auth-form">
                <h3>Setel Ulang Kata Sandi</h3>
                <p className="text-muted">Langkah 1: Masukkan username Anda untuk memverifikasi akun.</p>
                
                <div className="form-group">
                  <label htmlFor="forgotUser">Username Warga</label>
                  <input 
                    type="text" 
                    id="forgotUser" 
                    placeholder="Username Anda (misal: budi)..." 
                    value={forgotUsername}
                    onChange={(e) => {
                      setForgotUsername(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    autoFocus
                    required
                  />
                  {errorMsg && (
                    <span className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--red)', fontSize: '0.78rem', marginTop: '0.4rem' }}>
                      <AlertCircle size={12} /> {errorMsg}
                    </span>
                  )}
                </div>

                <div className="auth-actions" style={{ marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => { setAuthModalTab('login'); setErrorMsg(''); }}>
                    Kembali Masuk
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Verifikasi Akun
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="auth-form">
                <h3>Setel Ulang Kata Sandi</h3>
                <p className="text-muted">Langkah 2: Masukkan kata sandi baru untuk akun <strong>{forgotUsername}</strong>.</p>
                
                <div className="form-group">
                  <label htmlFor="forgotNewPass">Kata Sandi Baru</label>
                  <input 
                    type="password" 
                    id="forgotNewPass" 
                    placeholder="Minimal 4 karakter..." 
                    value={forgotNewPassword}
                    onChange={(e) => {
                      setForgotNewPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    autoFocus
                    required
                  />
                </div>

                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label htmlFor="forgotConfirmPass">Konfirmasi Kata Sandi Baru</label>
                  <input 
                    type="password" 
                    id="forgotConfirmPass" 
                    placeholder="Ulangi kata sandi baru..." 
                    value={forgotConfirmPassword}
                    onChange={(e) => {
                      setForgotConfirmPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    required
                  />
                  {errorMsg && (
                    <span className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--red)', fontSize: '0.78rem', marginTop: '0.4rem' }}>
                      <AlertCircle size={12} /> {errorMsg}
                    </span>
                  )}
                </div>

                <div className="auth-actions" style={{ marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => { setForgotStep(1); setErrorMsg(''); }}>
                    Kembali
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Perbarui Kata Sandi
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelector;
