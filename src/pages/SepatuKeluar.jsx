import React from 'react';
import SepatuKeluarForm from '../components/SepatuKeluarForm.jsx'; // 1. Import form baru

function SepatuKeluar() {
  return (
    <div className="dashboard-content"> 
      <header className="dashboard-header">
        <h1>Transaksi Sepatu Keluar</h1>
        <p>Form untuk mencatat barang keluar dari gudang.</p>
      </header>

      {/* 2. Tampilkan komponen form di sini */}
      <SepatuKeluarForm />

    </div>
  );
}

export default SepatuKeluar;