import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Memakai CSS yang sudah ada
import './EditTransaksiPage.css'; // Memakai CSS tabel

// --- SIMULASI TRANSAKSI KELUAR TERAKHIR (DENGAN ID & PAKET) ---
const transaksiTerakhir = [
  { 
    id: 1, 
    kode: 'AD-SMB-002', // DATA BARU: ID Barang
    merk: 'Adidas', 
    namaProduk: 'Samba OG', 
    namaPaket: 'Seri 38-42 (Isi 12)', 
    jumlahDus: 10, 
    tujuan: 'Mitra Sport' 
  },
  { 
    id: 2, 
    kode: 'NK-AF1-001', 
    merk: 'Nike', 
    namaProduk: 'Air Force 1 \'07', 
    namaPaket: 'Seri 39-43 (Isi 12)', 
    jumlahDus: 5, 
    tujuan: 'Toko Jaya Abadi' 
  },
  { 
    id: 3, 
    kode: 'NB-550-003', 
    merk: 'New Balance', 
    namaProduk: '550', 
    namaPaket: 'Seri Anak A (Isi 20)', 
    jumlahDus: 8, 
    tujuan: 'Sinar Baru' 
  },
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
              <th>ID Barang</th> {/* KOLOM BARU */}
              <th>Merk</th>
              <th>Nama Produk</th>
              <th>Paket Seri</th>
              <th>Jumlah Dus</th>
              <th>Tujuan</th>
            </tr>
          </thead>
          <tbody>
            {transaksiTerakhir.map(item => (
              <tr key={item.id}>
                
                {/* DATA BARU: ID Barang Monospace */}
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#555' }}>
                  {item.kode}
                </td>

                <td>{item.merk}</td>
                <td>{item.namaProduk}</td>
                <td>{item.namaPaket}</td>
                <td style={{ fontWeight: 'bold' }}>{item.jumlahDus}</td>
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