import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Pastikan path import benar
import './Dashboard.css'; 

function DashboardAdminMasuk() {
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOGIKA: Ambil data asli dari Database Supabase
  useEffect(() => {
    fetchTransaksiTerakhir();
  }, []);

  const fetchTransaksiTerakhir = async () => {
    try {
      setLoading(true);
      // Mengambil 5 transaksi terbaru dari tabel transaksi_masuk
      const { data, error } = await supabase
        .from('transaksi_masuk')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setTransaksi(data || []);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Dashboard Admin Barang Masuk</h1>
        <p>Pintasan untuk mengelola data dan transaksi masuk.</p>
      </header>

      {/* --- Bagian 1: Pintasan (Sesuai dengan Route di App.jsx) --- */}
      <h3 className="dashboard-subtitle">Pintasan Utama</h3>
      <div className="shortcut-grid">
        <Link to="/transaksi-masuk" className="shortcut-card">
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
        <Link to="/sepatu-master" className="shortcut-card">
          <h4>👟 Kelola Master Sepatu</h4>
          <p>Tambah/edit data produk (merk, nama).</p>
        </Link>
      </div>

      {/* --- Bagian 2: Data Real-time dari Database --- */}
      <h3 className="dashboard-subtitle">Transaksi Masuk Terakhir</h3>
      <div className="tabel-container-full">
        {loading ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>Memuat data transaksi...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID Barang</th>
                <th>Merk</th>
                <th>Nama Produk</th>
                <th>Paket Seri</th>
                <th>Jumlah Dus</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              {transaksi.length > 0 ? (
                transaksi.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#555' }}>
                      {item.kode_barang || item.kode}
                    </td>
                    <td>{item.merk}</td>
                    <td>{item.nama_produk}</td>
                    <td>{item.nama_paket}</td>
                    <td style={{ fontWeight: 'bold' }}>{item.jumlah_dus}</td>
                    <td>{item.supplier}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    Belum ada data transaksi masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DashboardAdminMasuk;