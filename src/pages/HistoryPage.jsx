import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import './EditTransaksiPage.css'; 
import './LaporanStok.css'; 
import './Dashboard.css'; 

function HistoryPage() {
  const [activeTab, setActiveTab] = useState('keluar'); 
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // 1. AMBIL DATA DARI DATABASE
  useEffect(() => {
    fetchHistory();
  }, [activeTab]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      // Memilih tabel berdasarkan tab yang aktif
      const table = activeTab === 'masuk' ? 'transaksi_masuk' : 'transaksi_keluar';
      
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistoryData(data || []);
    } catch (err) {
      console.error("Gagal mengambil history:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatTanggal = (tanggalString) => {
    if (!tanggalString) return '-';
    return new Date(tanggalString).toLocaleString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // 2. LOGIKA PENCARIAN & FILTER
  const filteredData = useMemo(() => {
    return historyData.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const matchSearch = 
        (item.kode_barang || '').toLowerCase().includes(searchLower) || 
        (item.nama_produk || '').toLowerCase().includes(searchLower) ||
        (item.merk || '').toLowerCase().includes(searchLower) ||
        (item.nama_staff || '').toLowerCase().includes(searchLower) || // Filter Nama Staff
        (item.tujuan || '').toLowerCase().includes(searchLower) || 
        (item.supplier || '').toLowerCase().includes(searchLower); 

      let matchDate = true;
      if (filterDate) {
        const itemDate = item.created_at.split('T')[0]; 
        matchDate = itemDate === filterDate;
      }

      return matchSearch && matchDate;
    });
  }, [historyData, searchTerm, filterDate]); 

  return (
    <div className="dashboard-content">
      
      {/* Bagian Kontrol (Tidak Ikut Dicetak) */}
      <div className="no-print">
        <header className="dashboard-header">
          <h1>History Transaksi Gudang</h1>
          <p>Daftar lengkap transaksi masuk dan keluar beserta staff penanggung jawab.</p>
          
          <div className="history-toggle-container" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button 
              className={`history-toggle-btn ${activeTab === 'masuk' ? 'active' : ''}`}
              onClick={() => setActiveTab('masuk')}
              style={{
                padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                border: 'none', backgroundColor: activeTab === 'masuk' ? '#2563eb' : '#e2e8f0',
                color: activeTab === 'masuk' ? 'white' : '#475569', fontWeight: 'bold'
              }}
            >
              📥 History Masuk
            </button>
            <button 
              className={`history-toggle-btn ${activeTab === 'keluar' ? 'active' : ''}`}
              onClick={() => setActiveTab('keluar')}
              style={{
                padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                border: 'none', backgroundColor: activeTab === 'keluar' ? '#ef4444' : '#e2e8f0',
                color: activeTab === 'keluar' ? 'white' : '#475569', fontWeight: 'bold'
              }}
            >
              📤 History Keluar
            </button>
          </div>
        </header>

        <div className="filter-container" style={{ display: 'flex', gap: '15px', marginBottom: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="🔍 Cari SKU, produk, staff, atau tujuan..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd', flex: 1, minWidth: '250px' }}
            />
            
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="date-input"
              style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd' }}
            />

            <button className="button-cetak" onClick={handlePrint} style={{ 
              marginLeft: 'auto', padding: '10px 20px', borderRadius: '8px', 
              backgroundColor: '#1e293b', color: 'white', cursor: 'pointer', border: 'none' 
            }}>
              🖨️ Cetak History
            </button>
        </div>
      </div>

      {/* Area Tabel (Area Cetak) */}
      <div id="laporan-area" className="tabel-container-full">
        <h3 className="judul-laporan">
          {activeTab === 'masuk' ? 'Laporan Riwayat Barang Masuk' : 'Laporan Riwayat Barang Keluar'}
        </h3>
        
        {loading ? (
          <p style={{ textAlign: 'center', padding: '50px' }}>Menghubungkan ke database...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tanggal & Waktu</th>
                <th>ID Barang (SKU)</th>
                <th>Staff PJ</th> {/* KOLOM STAFF */}
                <th>Merk</th>
                <th>Nama Produk</th>
                <th>Jumlah</th>
                <th>{activeTab === 'masuk' ? 'Supplier' : 'Tujuan'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontSize: '0.85rem' }}>{formatTanggal(item.created_at)}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#2563eb' }}>
                      {item.kode_barang}
                    </td>
                    
                    {/* MENAMPILKAN NAMA STAFF */}
                    <td style={{ fontWeight: '600', color: '#1f2937' }}>
                      {item.nama_staff || 'Admin'}
                    </td>

                    <td>{item.merk}</td>
                    <td>{item.nama_produk}</td>
                    <td style={{ fontWeight: 'bold' }}>{item.jumlah_dus} Dus</td>
                    <td>{activeTab === 'masuk' ? (item.supplier || '-') : (item.tujuan || '-')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                    Data riwayat tidak ditemukan.
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

export default HistoryPage;