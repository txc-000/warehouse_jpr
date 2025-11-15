import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // File CSS Anda yang sudah ada
import './EditTransaksiPage.css'; // Kita pakai ulang style tabel

// --- SIMULASI 3 TRANSAKSI MASUK TERAKHIR ---
// (Data dummy sudah diperbarui dengan "merk")
const transaksiTerakhir = [
  { id: 1, merk: 'Nike', namaProduk: 'Sepatu Lari Model X', namaPaket: 'Seri 38-42 (Isi 12)', jumlahDus: 10, supplier: 'Supplier A' },
  { id: 2, merk: 'Adidas', namaProduk: 'Sandal Model Y', namaPaket: 'Seri Anak A (Isi 20)', jumlahDus: 5, supplier: 'Supplier B' },
  { id: 3, merk: 'Nike', namaProduk: 'Sepatu Lari Model X', namaPaket: 'Seri 39-43 (Isi 12)', jumlahDus: 8, supplier: 'Supplier A' },
];

function Dashboard() {
  return (
    <div className="dashboard-content">
      
      {/* Header lama Anda, tapi tanpa navigasi tab */}
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
              <th>Merk</th> {/* <-- TAMBAHKAN INI */}
              <th>Nama Produk</th>
              <th>Paket Seri</th>
              <th>Jumlah Dus</th>
              <th>Supplier</th>
            </tr>
          </thead>
          <tbody>
            {transaksiTerakhir.map(item => (
              <tr key={item.id}>
                <td>{item.merk}</td> {/* <-- TAMBAHKAN INI */}
                <td>{item.namaProduk}</td>
                <td>{item.namaPaket}</td>
                <td>{item.jumlahDus}</td>
                <td>{item.supplier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Dashboard;