import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // File CSS Anda yang sudah ada
import './EditTransaksiPage.css'; // Kita pakai ulang style tabel

// --- SIMULASI 3 TRANSAKSI MASUK TERAKHIR (DENGAN ID BARANG) ---
const transaksiTerakhir = [
  { 
    id: 1, 
    kode: 'NK-RUN-005', // DATA BARU
    merk: 'Nike', 
    namaProduk: 'Sepatu Lari Model X', 
    namaPaket: 'Seri 38-42 (Isi 12)', 
    jumlahDus: 10, 
    supplier: 'Supplier A' 
  },
  { 
    id: 2, 
    kode: 'AD-SDL-006', 
    merk: 'Adidas', 
    namaProduk: 'Sandal Model Y', 
    namaPaket: 'Seri Anak A (Isi 20)', 
    jumlahDus: 5, 
    supplier: 'Supplier B' 
  },
  { 
    id: 3, 
    kode: 'NK-RUN-005', 
    merk: 'Nike', 
    namaProduk: 'Sepatu Lari Model X', 
    namaPaket: 'Seri 39-43 (Isi 12)', 
    jumlahDus: 8, 
    supplier: 'Supplier A' 
  },
];

function DashboardAdminMasuk() {
  return (
    <div className="dashboard-content">
      
      <header className="dashboard-header">
        <h1>Dashboard Admin Barang Masuk</h1>
        <p>Pintasan untuk mengelola data dan transaksi masuk.</p>
      </header>

      {/* --- Bagian 1: Pintasan (Shortcut) --- */}
      <h3 className="dashboard-subtitle">Pintasan Utama</h3>
      <div className="shortcut-grid">
        <Link to="/sepatu-masuk" className="shortcut-card">
          <h4>➕ Buat Transaksi Masuk</h4>
          <p>Catat dus barang yang baru masuk.</p>
        </Link>
        <Link to="/edit-transaksi" className="shortcut-card">
          <h4>✏️ Edit Transaksi Masuk</h4>
          <p>Kelola daftar transaksi yang sudah masuk.</p>
        </Link>
        <Link to="/paket-seri" className="shortcut-card">
          <h4>📦 Kelola Paket Seri</h4>
          <p>Buat atau edit resep paket/dus.</p>
        </Link>
        <Link to="/data-sepatu" className="shortcut-card">
          <h4>👟 Kelola Master Sepatu</h4>
          <p>Tambah/edit data produk (merk, nama).</p>
        </Link>
      </div>

      {/* --- Bagian 2: Transaksi Terakhir --- */}
      <h3 className="dashboard-subtitle">Transaksi Masuk Terakhir</h3>
      <div className="tabel-container-full">
        <table>
          <thead>
            <tr>
              <th>ID Barang</th> {/* KOLOM BARU */}
              <th>Merk</th>
              <th>Nama Produk</th>
              <th>Paket Seri</th>
              <th>Jumlah Dus</th>
              <th>Supplier</th>
            </tr>
          </thead>
          <tbody>
            {transaksiTerakhir.map(item => (
              <tr key={item.id}>
                
                {/* DATA BARU: ID Barang */}
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#555' }}>
                  {item.kode}
                </td>

                <td>{item.merk}</td>
                <td>{item.namaProduk}</td>
                <td>{item.namaPaket}</td>
                <td style={{ fontWeight: 'bold' }}>{item.jumlahDus}</td>
                <td>{item.supplier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default DashboardAdminMasuk;