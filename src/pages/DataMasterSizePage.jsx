import React from 'react';
import UkuranSepatu from '../components/UkuranSepatu.jsx'; 
import './Dashboard.css'; // Ambil style header dashboard

function DataMasterSizePage() {
  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Pengelolaan Data Master Size</h1>
        <p>Kelola data induk untuk semua ukuran sepatu yang tersedia.</p>
      </header>

      {/* Panggil Komponen yang sudah connect DB tadi */}
      <UkuranSepatu />
    </div>
  );
}

export default DataMasterSizePage;