import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Memakai CSS yang sudah ada
import './EditTransaksiPage.css'; // Memakai CSS tabel

// --- SIMULASI 3 TRANSAKSI KELUAR TERAKHIR ---
// (Diambil dari data dummy HistoryKeluarPage.jsx)
const transaksiTerakhir = [
  { id: 5, merk: 'Adidas', namaProduk: 'Samba OG', jumlahDus: 10, tujuan: 'Mitra Sport' },
  { id: 4, merk: 'Nike', namaProduk: 'Air Force 1 \'07', jumlahDus: 5, tujuan: 'Toko Jaya Abadi' },
  { id: 3, merk: 'New Balance', namaProduk: '550', jumlahDus: 8, tujuan: 'Sinar Baru' },
];

function AdminKeluarDashboard() {
  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Dashboard Admin Barang Keluar</h1>
        <p>Pintasan untuk mencatat transaksi keluar.</p>
      </header>

      {/* --- Bagian 1: Pintasan Utama --- */}
      <h3 className="dashboard-subtitle">Pintasan Utama</h3>
      <div className="shortcut-grid">
        <Link to="/sepatu-keluar" className="shortcut-card">
          <h4>📤 Buat Transaksi Keluar</h4>
          <p>Catat dus barang yang keluar dari gudang.</p>
        </Link>
      </div>

      {/* --- Bagian 2: Transaksi Keluar Terakhir --- */}
      <h3 className="dashboard-subtitle">Transaksi Keluar Terakhir</h3>
      <div className="tabel-container-full">
        <table>
          <thead>
            <tr>
              <th>Merk</th>
              <th>Nama Produk</th>
              <th>Jumlah Dus</th>
              <th>Tujuan</th>
            </tr>
          </thead>
          <tbody>
            {transaksiTerakhir.map(item => (
              <tr key={item.id}>
                <td>{item.merk}</td>
                <td>{item.namaProduk}</td>
                <td>{item.jumlahDus}</td>
                <td>{item.tujuan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminKeluarDashboard;