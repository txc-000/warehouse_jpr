import React, { useState, useMemo } from 'react';
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

// --- SIMULASI DATA ANALISIS BISNIS (DENGAN ID BARANG) ---
const analisisBarang = [
  { 
    id: 1, 
    kode: 'NK-AF1-001', // DATA BARU: ID Barang
    merk: 'Nike',
    namaProduk: 'Air Force 1 \'07', 
    namaPaket: 'Seri 38-42 (Isi 12)', 
    hargaLama: 1450000,
    hargaBaru: 1500000, // Harga NAIK
    frekKeluar: 8, 
    sisaStok: 8 
  },
  { 
    id: 2, 
    kode: 'AD-SMB-002', // DATA BARU
    merk: 'Adidas',
    namaProduk: 'Samba OG', 
    namaPaket: 'Seri 38-42 (Isi 12)', 
    hargaLama: 1900000,
    hargaBaru: 1850000, // Harga TURUN
    frekKeluar: 1, 
    sisaStok: 15
  },
  { 
    id: 3, 
    kode: 'NB-550-003', // DATA BARU
    merk: 'New Balance',
    namaProduk: '550', 
    namaPaket: 'Seri Anak A (Isi 20)', 
    hargaLama: 1200000,
    hargaBaru: 1200000, // Harga STABIL
    frekKeluar: 4, 
    sisaStok: 20
  },
];

function PemilikDashboard() {
  // State untuk pencarian tabel analisis
  const [searchTerm, setSearchTerm] = useState('');

  // Helper: Format Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(angka);
  };

  // Helper: Hitung Tren Harga
  const renderTrenHarga = (lama, baru) => {
    if (lama === baru) return <span style={{color: '#6c757d', fontSize:'0.9em'}}>Stabil</span>;
    const selisih = baru - lama;
    const persen = ((selisih / lama) * 100).toFixed(1);
    
    if (selisih > 0) {
      return (
        <div style={{color: '#d9534f', fontSize:'0.9em', fontWeight:'bold'}}>
          ⬆ Naik {persen}%
          <div style={{fontSize:'0.8em', color:'#666', fontWeight:'normal'}}>({formatRupiah(lama)} ➝ {formatRupiah(baru)})</div>
        </div>
      );
    } else {
      return (
        <div style={{color: '#28a745', fontSize:'0.9em', fontWeight:'bold'}}>
          ⬇ Turun {Math.abs(persen)}%
          <div style={{fontSize:'0.8em', color:'#666', fontWeight:'normal'}}>({formatRupiah(lama)} ➝ {formatRupiah(baru)})</div>
        </div>
      );
    }
  };

  // Helper: Label Status Barang
  const renderStatusBarang = (frekuensi) => {
    if (frekuensi >= 5) {
      return <span style={{backgroundColor: '#d1fae5', color: '#065f46', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85em', fontWeight: 'bold'}}>🔥 FAST MOVING</span>;
    } else if (frekuensi <= 1) {
      return <span style={{backgroundColor: '#f3f4f6', color: '#1f2937', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85em', fontWeight: 'bold'}}>🐢 SLOW MOVING</span>;
    } else {
      return <span style={{color: '#6b7280', fontSize: '0.85em'}}>Normal</span>;
    }
  };

  // Logic Pencarian
  const filteredAnalisis = useMemo(() => {
    return analisisBarang.filter(item => 
      item.namaProduk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.merk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Dashboard Pemilik</h1>
        <p>Ringkasan aktivitas, performa barang, dan status gudang.</p>
      </header>

      {/* --- Bagian 1: Kartu KPI --- */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>Total Stok (Dus)</h4>
          <p>{kpiData.totalDusStok}</p>
          <span>Gudang Utama</span>
        </div>
        <div className="kpi-card warning">
          <h4>Stok Menipis</h4>
          <p>{kpiData.itemStokMenipis}</p>
          <span>Perlu Restock</span>
        </div>
        <div className="kpi-card green">
          <h4>Masuk Hari Ini</h4>
          <p>{kpiData.masukHariIni}</p>
          <span>Transaksi</span>
        </div>
        <div className="kpi-card red">
          <h4>Keluar Hari Ini</h4>
          <p>{kpiData.keluarHariIni}</p>
          <span>Transaksi</span>
        </div>
      </div>

      {/* --- Bagian 2: Shortcut --- */}
      <h3 className="dashboard-subtitle">Pintasan Anda</h3>
      <div className="shortcut-grid">
        <Link to="/atur-harga" className="shortcut-card" style={{borderLeft: '4px solid #28a745'}}>
          <h4>💰 Atur Harga Barang</h4>
          <p>Update harga display dan data master sepatu.</p>
        </Link>
        <Link to="/verifikasi-stok" className="shortcut-card">
          <h4>📊 Verifikasi Stok</h4>
          <p>Lakukan stock opname (penyesuaian).</p>
        </Link>
        <Link to="/laporan-stok" className="shortcut-card">
          <h4>📄 Cetak Laporan Stok</h4>
          <p>Lihat & cetak laporan analisis.</p>
        </Link>
        <Link to="/history" className="shortcut-card">
          <h4>🕒 History Transaksi</h4>
          <p>Lihat riwayat barang masuk dan keluar.</p>
        </Link>
        <Link to="/kelola-user" className="shortcut-card">
          <h4>👤 Kelola Akses User</h4>
          <p>Tambah atau edit hak akses user.</p>
        </Link>
      </div>

      {/* --- Bagian 3: ANALISIS TREN BISNIS --- */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', marginBottom: '15px'}}>
        <h3 className="dashboard-subtitle" style={{margin: 0}}>Analisis Tren Bisnis</h3>
        
        {/* Search Bar Kecil */}
        <input 
          type="text" 
          placeholder="🔍 Cari ID atau Nama Produk..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            width: '250px',
            fontSize: '0.9rem'
          }}
        />
      </div>

      <div className="tabel-container-full">
        <table>
          <thead>
            <tr>
              <th style={{width: '35%'}}>Produk & Paket</th>
              <th style={{width: '20%'}}>Tren Harga Modal</th>
              <th style={{width: '25%'}}>Performa Penjualan</th>
              <th style={{width: '20%', textAlign: 'center'}}>Sisa Stok (Dus)</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnalisis.length > 0 ? (
              filteredAnalisis.map(item => (
                <tr key={item.id}>
                  <td>
                    <div style={{fontWeight: 'bold', color: '#333'}}>{item.merk} - {item.namaProduk}</div>
                    {/* Menampilkan ID Barang */}
                    <div style={{fontSize: '0.8em', color: '#2563eb', fontFamily: 'monospace', fontWeight: 'bold', marginTop: '2px'}}>
                      {item.kode}
                    </div>
                    <div style={{fontSize: '0.85em', color: '#666'}}>{item.namaPaket}</div>
                  </td>
                  
                  {/* Kolom Tren Harga */}
                  <td>
                    {renderTrenHarga(item.hargaLama, item.hargaBaru)}
                  </td>

                  {/* Kolom Performa */}
                  <td>
                    {renderStatusBarang(item.frekKeluar)}
                    <div style={{fontSize: '0.8em', color: '#666', marginTop:'4px'}}>
                      {item.frekKeluar}x Transaksi Keluar
                    </div>
                  </td>

                  {/* Kolom Sisa Stok */}
                  <td style={{textAlign: 'center', fontSize: '1.1em', fontWeight: 'bold'}}>
                    <span style={{color: item.sisaStok < 10 ? '#d9534f' : '#28a745'}}>
                      {item.sisaStok}
                    </span>
                    {item.sisaStok < 10 && <div style={{fontSize: '0.6em', color: '#d9534f', textTransform:'uppercase'}}>Stok Kritis</div>}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{textAlign: 'center', padding: '20px', color: '#999'}}>
                  Data tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default PemilikDashboard;