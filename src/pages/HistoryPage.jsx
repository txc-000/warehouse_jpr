// src/pages/HistoryPage.jsx

import React, { useState } from 'react';
import './EditTransaksiPage.css'; // Pakai ulang CSS tabel
import './LaporanStok.css'; // Pakai ulang CSS print
import './Dashboard.css'; // Kita pakai style 'nav-link' dari dashboard

// --- SIMULASI DATA HISTORY ---
const dummyHistoryKeluar = [
  { id: 1, tanggal: '2025-11-14T10:30:00', merk: 'Nike', namaProduk: 'Air Force 1 \'07', namaPaket: 'Seri 38-42 (Isi 12)', jumlahDus: 10, tujuan: 'Toko Jaya Abadi' },
  { id: 2, tanggal: '2025-11-14T14:45:00', merk: 'Adidas', namaProduk: 'Samba OG', namaPaket: 'Seri 38-42 (Isi 12)', jumlahDus: 5, tujuan: 'Mitra Sport' },
  { id: 3, tanggal: '2025-11-15T09:15:00', merk: 'New Balance', namaProduk: '550', namaPaket: 'Seri Anak A (Isi 20)', jumlahDus: 8, tujuan: 'Sinar Baru' },
];

const dummyHistoryMasuk = [
  { id: 1, tanggal: '2025-11-13T08:00:00', merk: 'Nike', namaProduk: 'Sepatu Lari Model X', namaPaket: 'Seri 38-42 (Isi 12)', jumlahDus: 10, supplier: 'Supplier A' },
  { id: 2, tanggal: '2025-11-13T09:30:00', merk: 'Adidas', namaProduk: 'Sandal Model Y', namaPaket: 'Seri Anak A (Isi 20)', jumlahDus: 5, supplier: 'Supplier B' },
  { id: 3, tanggal: '2025-11-14T11:00:00', merk: 'Nike', namaProduk: 'Sepatu Lari Model X', namaPaket: 'Seri 39-43 (Isi 12)', jumlahDus: 8, supplier: 'Supplier A' },
];
// --- BATAS DATA ---

function HistoryPage() {
  // State untuk mengontrol tab mana yang aktif ('masuk' atau 'keluar')
  const [activeTab, setActiveTab] = useState('keluar'); // Default ke 'keluar'

  const handlePrint = () => {
    window.print();
  };

  const formatTanggal = (tanggalString) => {
    return new Date(tanggalString).toLocaleString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-content">
      
      {/* --- Bagian yang TIDAK dicetak --- */}
      <div className="no-print">
        <header className="dashboard-header">
          <h1>History Transaksi</h1>
          <p>Catatan lengkap semua barang yang masuk dan keluar dari gudang.</p>
          
          {/* --- INI ADALAH TAB-NYA --- */}
          <div className="header-nav-links">
            <button 
              className={`nav-link ${activeTab === 'masuk' ? 'active' : ''}`}
              onClick={() => setActiveTab('masuk')}
            >
              History Masuk
            </button>
            <button 
              className={`nav-link ${activeTab === 'keluar' ? 'active' : ''}`}
              onClick={() => setActiveTab('keluar')}
            >
              History Keluar
            </button>
          </div>
        </header>

        <button className="button-cetak" onClick={handlePrint}>
          🖨️ Cetak History
        </button>
      </div>

      {/* --- Bagian Laporan/Tabel yang AKAN dicetak --- */}
      <div id="laporan-area" className="tabel-container-full">
        
        {/* Judul dan tanggal akan dinamis */}
        <h3 className="judul-laporan">
          {activeTab === 'masuk' ? 'History Transaksi Masuk' : 'History Transaksi Keluar'}
        </h3>
        <p className="tanggal-laporan">
          Dicetak pada: {new Date().toLocaleString('id-ID', {
            dateStyle: 'long', timeStyle: 'medium', hour12: false
          })}
        </p>

        {/* --- (1) TAMPILKAN TABEL HISTORY MASUK --- */}
        {activeTab === 'masuk' && (
          <table>
            <thead>
              <tr>
                <th>Tanggal & Waktu</th>
                <th>Merk</th>
                <th>Nama Produk</th>
                <th>Nama Paket Seri</th>
                <th>Jumlah Dus (Masuk)</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              {dummyHistoryMasuk.map(item => (
                <tr key={item.id}>
                  <td>{formatTanggal(item.tanggal)}</td>
                  <td>{item.merk}</td>
                  <td>{item.namaProduk}</td>
                  <td>{item.namaPaket}</td>
                  <td style={{ fontWeight: 'bold' }}>{item.jumlahDus}</td>
                  <td>{item.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* --- (2) TAMPILKAN TABEL HISTORY KELUAR --- */}
        {activeTab === 'keluar' && (
          <table>
            <thead>
              <tr>
                <th>Tanggal & Waktu</th>
                <th>Merk</th>
                <th>Nama Produk</th>
                <th>Nama Paket Seri</th>
                <th>Jumlah Dus (Keluar)</th>
                <th>Tujuan (Customer)</th>
              </tr>
            </thead>
            <tbody>
              {dummyHistoryKeluar.map(item => (
                <tr key={item.id}>
                  <td>{formatTanggal(item.tanggal)}</td>
                  <td>{item.merk}</td>
                  <td>{item.namaProduk}</td>
                  <td>{item.namaPaket}</td>
                  <td style={{ fontWeight: 'bold' }}>{item.jumlahDus}</td>
                  <td>{item.tujuan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}

export default HistoryPage;