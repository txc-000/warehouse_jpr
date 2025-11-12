import React from 'react';
import UkuranSepatu from '../components/UkuranSepatu.jsx'; // 1. Import komponen yang sudah ada

function DataMasterSizePage() {
  return (
    // 2. Kita pakai class CSS yang sama dengan halaman lain
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Pengelolaan Data Master Size</h1>
        <p>Kelola data induk untuk semua ukuran sepatu yang tersedia.</p>
      </header>

      {/* 3. Tampilkan komponennya */}
      <UkuranSepatu />
    </div>
  );
}

export default DataMasterSizePage;