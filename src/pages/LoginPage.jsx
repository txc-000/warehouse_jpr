import React, { useState } from 'react';
import './LoginPage.css'; 

// PENTING: Terima props { onLogin } dari App.jsx
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // State lokal untuk efek loading di tombol
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi Input Kosong
    if (!username || !password) {
      alert('Silakan isi username dan password!');
      return;
    }

    setIsLoading(true); // Ubah tombol jadi loading

    // Panggil fungsi login dari App.jsx
    // Fungsi ini akan mengecek ke Supabase
    await onLogin(username, password);
    
    // Matikan loading jika login gagal (jika sukses, App.jsx akan memindah halaman)
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        {/* Header dengan Logo Sederhana */}
        <div className="login-header">
          <div className="logo-circle">📦</div>
          <h2>Welcome Back!</h2>
          <p>Sistem Manajemen Gudang</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          
          {/* Input Username dengan Ikon */}
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              {/* Ikon User (SVG) */}
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              
              <input
                type="text"
                id="username"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading} // Matikan input saat loading
              />
            </div>
          </div>

          {/* Input Password dengan Ikon */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              {/* Ikon Lock (SVG) */}
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              
              <input
                type="password"
                id="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading} // Matikan input saat loading
              />
            </div>
          </div>

          {/* Tombol Login */}
          <button 
            type="submit" 
            className="login-button" 
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Sedang Memproses...' : 'Masuk Sekarang'}
          </button>

          <div className="login-footer">
            <small>Gudang App v1.0</small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;