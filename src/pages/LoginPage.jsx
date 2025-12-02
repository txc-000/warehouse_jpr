import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Logika Login Sederhana
    if (username && password) {
      console.log('Login berhasil:', username);
      // Arahkan ke dashboard/halaman utama
      navigate('/sepatu-masuk'); 
    } else {
      alert('Silakan isi username dan password!');
    }
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
              />
            </div>
          </div>

          <button type="submit" className="login-button">
            Masuk Sekarang
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