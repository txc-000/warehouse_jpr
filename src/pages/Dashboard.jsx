import React, { useState } from 'react'; // <-- 1. Import useState
import './Dashboard.css';
import TransactionForm from '../components/TransactionForm.jsx';
import UkuranSepatu from '../components/UkuranSepatu.jsx'; // <-- 2. Import komponen baru

function Dashboard() {
  // 3. Buat state untuk melacak tab yang aktif
  const [activeTab, setActiveTab] = useState('tambah'); // 'tambah' atau 'ukuran'

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Selamat Datang, Admin!</h1>
        <p>Sistem Informasi Manajemen Gudang Sepatu</p>
        
        {/* 4. Ubah <a> menjadi <button> dan tambahkan event onClick */}
        <div className="header-nav-links">
          <button 
            className={`nav-link ${activeTab === 'tambah' ? 'active' : ''}`}
            onClick={() => setActiveTab('tambah')}
          >
            Tambah sepatu
          </button>
          <button 
            className={`nav-link ${activeTab === 'ukuran' ? 'active' : ''}`}
            onClick={() => setActiveTab('ukuran')}
          >
            Ukuran Sepatu
          </button>
        </div>
      </header>

      {/* 5. Render konten secara kondisional berdasarkan state */}
      {activeTab === 'tambah' && <TransactionForm />}
      {activeTab === 'ukuran' && <UkuranSepatu />}
      
    </div>
  );
}

export default Dashboard;