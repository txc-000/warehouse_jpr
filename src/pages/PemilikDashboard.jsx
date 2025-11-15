import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Memakai CSS yang sudah ada
import './EditTransaksiPage.css'; // Memakai CSS tabel
import './VerifikasiStok.css'; // Memakai style .row-warning

// --- SIMULASI DATA KPI ---
const kpiData = {
  totalDusStok: 51, 
  totalJenisPaket: 4,
  itemStokMenipis: 2, 
  keluarHariIni: 2, 
  masukHariIni: 1
};

// --- SIMULASI DATA STOK MENIPIS ---
const stokMenipis = [
  { id: 2, namaProduk: 'Air Force 1 \'07', namaPaket: 'Seri 39-43 (Isi 12)', stokSistem: 8 },
  { id: 3, namaProduk: 'Samba OG', namaPaket: 'Seri 38-42 (Isi 12)', stokSistem: 15 },
];


function PemilikDashboard() {

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Dashboard Pemilik</h1>
        <p>Ringkasan aktivitas dan status gudang Anda saat ini.</p>
      </header>

      {/* --- Bagian 1: Kartu KPI (Sudah Benar) --- */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>Total Stok (Dus)</h4>
          <p>{kpiData.totalDusStok}</p>
          <span>dari {kpiData.totalJenisPaket} Paket</span>
        </div>
        <div className="kpi-card warning">
          <h4>Stok Menipis</h4>
          <p>{kpiData.itemStokMenipis}</p>
          <span>Item perlu restock</span>
        </div>
        <div className="kpi-card green">
          <h4>Masuk Hari Ini (Dus)</h4>
          <p>{kpiData.masukHariIni}</p>
          <span>Transaksi</span>
        </div>
        <div className="kpi-card red">
          <h4>Keluar Hari Ini (Dus)</h4>
          <p>{kpiData.keluarHariIni}</p>
          <span>Transaksi</span>
        </div>
      </div>

      {/* --- Bagian 2: Shortcut / Pintasan (INI PERBAIKANNYA) --- */}
      <h3 className="dashboard-subtitle">Pintasan Anda</h3>
      <div className="shortcut-grid">
        <Link to="/verifikasi-stok" className="shortcut-card">
          <h4>📊 Verifikasi Stok</h4>
          <p>Lakukan stock opname (penyesuaian).</p>
        </Link>
        <Link to="/laporan-stok" className="shortcut-card">
          <h4>📄 Cetak Laporan Stok</h4>
          <p>Lihat & cetak stok akhir.</p>
        </Link>
        
        {/* --- INI YANG DIUBAH --- */}
        <Link to="/history" className="shortcut-card">
          <h4>🕒 History Transaksi</h4>
          <p>Lihat riwayat barang masuk dan keluar.</p>
        </Link>
        {/* --- BATAS PERUBAHAN --- */}

        <Link to="/kelola-user" className="shortcut-card">
          <h4>👤 Kelola Akses User</h4>
          <p>Tambah atau edit hak akses user.</p>
        </Link>
      </div>

      {/* --- Bagian 3: Tabel Stok Menipis (Sudah Benar) --- */}
      <h3 className="dashboard-subtitle">Peringatan: Stok Menipis (Contoh: di bawah 16 dus)</h3>
      <div className="tabel-container-full">
        <table>
          {/* ... (isi tabel stok menipis) ... */}
          <thead>
            <tr>
              <th>Nama Produk</th>
              <th>Nama Paket Seri</th>
              <th>Stok Tersisa (Dus)</th>
            </tr>
          </thead>
          <tbody>
            {stokMenipis.map(item => (
              <tr key={item.id} className="row-warning">
                <td>{item.namaProduk}</td>
                <td>{item.namaPaket}</td>
                <td style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {item.stokSistem}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default PemilikDashboard;