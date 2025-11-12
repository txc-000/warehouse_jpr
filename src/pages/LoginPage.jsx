import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import hook untuk redirect
import './LoginPage.css'; // CSS khusus untuk halaman login

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Inisialisasi hook navigasi

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // --- LOGIKA LOGIN PALSU (DUMMY) ---
    // Di aplikasi nyata, ini akan mengirim data ke API
    console.log('Mencoba login dengan:', { username, password });

    // Asumsikan login berhasil jika username diisi
    if (username) {
      // Kirim user ke halaman utama aplikasi
      // Kita arahkan ke rute default, yaitu '/sepatu-masuk'
      navigate('/sepatu-masuk'); 
    } else {
      alert('Silakan isi username dan password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Selamat Datang!</h2>
        <p>Silakan login ke Sistem Manajemen Gudang</p>
        
        <form onSubmit={handleSubmit}>
          <div className="login-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="login-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;