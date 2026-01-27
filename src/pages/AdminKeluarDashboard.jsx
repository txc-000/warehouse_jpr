import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Dashboard.css'; 
import './EditTransaksiPage.css'; 

function AdminKeluarDashboard() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransaksiTerakhir();
  }, []);

  const fetchTransaksiTerakhir = async () => {
    try {
      setLoading(true);
      
      // Ambil data langsung dari transaksi_keluar
      // Kita tidak pakai join dulu agar riwayat tidak "hilang" jika relasi error
      const { data, error } = await supabase
        .from('transaksi_keluar')
        .select('*') 
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransaksiList(data || []);
      
    } catch (err) {
      console.error("Gagal load riwayat:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Dashboard Admin Barang Keluar</h1>
        <p>Ringkasan aktivitas pengeluaran barang terbaru.</p>
      </header>

      <h3 className="dashboard-subtitle">Aksi Cepat</h3>
      <div className="shortcut-grid">
        <Link to="/transaksi-keluar" className="shortcut-card" style={{borderLeft: '4px solid #ef4444'}}>
          <h4 style={{color: '#ef4444'}}>📤 Input Barang Keluar</h4>
          <p>Catat pengeluaran barang/penjualan.</p>
        </Link>
        <Link to="/stok-barang" className="shortcut-card">
          <h4>📦 Cek Stok Gudang</h4>
          <p>Lihat sisa stok sebelum transaksi.</p>
        </Link>
      </div>

      <h3 className="dashboard-subtitle" style={{marginTop: '30px'}}>
        🕒 10 Transaksi Terakhir
      </h3>
      
      <div className="tabel-container-full">
        {loading ? (
          <p style={{padding: 40, textAlign: 'center'}}>Menghubungkan ke database...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>ID Barang</th>
                <th>Merk & Produk</th>
                <th>Ukuran</th>
                <th>Tujuan</th>
                <th style={{textAlign: 'center'}}>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {transaksiList.length > 0 ? (
                transaksiList.map(item => (
                  <tr key={item.id}>
                    <td style={{fontSize: '0.85rem'}}>{formatDate(item.created_at)}</td>
                    
                    {/* Mengambil kode_barang yang Anda simpan di SepatuKeluar.jsx */}
                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#2563eb' }}>
                      {item.kode_barang || '-'}
                    </td>

                    <td>
                      <strong>{item.merk || 'N/A'}</strong>
                      <div style={{fontSize: '0.85rem', color: '#666'}}>
                        {item.nama_produk || 'Produk'}
                      </div>
                    </td>

                    {/* Mengambil nama_paket yang Anda simpan di SepatuKeluar.jsx */}
                    <td>{item.nama_paket || '-'}</td>

                    <td>{item.tujuan || '-'}</td>

                    <td style={{ fontWeight: 'bold', textAlign: 'center', color: '#ef4444' }}>
                      -{item.jumlah_dus} Dus
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '40px', color: '#999'}}>
                    Belum ada riwayat transaksi ditemukan.
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

export default AdminKeluarDashboard;