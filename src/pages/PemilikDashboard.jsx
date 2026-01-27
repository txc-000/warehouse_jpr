import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Dashboard.css'; 
import './EditTransaksiPage.css'; 

function PemilikDashboard() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- 1. STATE BARU UNTUK NOTIFIKASI (DARI PHP) ---
  const [notifHarga, setNotifHarga] = useState(0);
  const [notifStok, setNotifStok] = useState(0);

  // State Data Lama
  const [kpiData, setKpiData] = useState({
    totalDusStok: 0, 
    totalJenisPaket: 0,
    itemStokMenipis: 0, 
    keluarHariIni: 0, 
    masukHariIni: 0
  });

  const [analisisBarang, setAnalisisBarang] = useState([]);

  useEffect(() => {
    fetchDashboardData();   // Ambil data tabel (Supabase)
    fetchNotifikasiPHP();   // Ambil data notifikasi (PHP Localhost)
  }, []);

  // --- 2. FUNGSI BARU: AMBIL NOTIFIKASI DARI PHP ---
  const fetchNotifikasiPHP = async () => {
    try {
      // Cek Barang Tanpa Harga
      const resHarga = await fetch('http://localhost:8000/api/cek_notifikasi.php');
      const dataHarga = await resHarga.json();
      if (dataHarga.status === 'success') {
        setNotifHarga(dataHarga.jumlah_belum_diharga);
      }

      // Cek Stok Menipis
      const resStok = await fetch('http://localhost:8000/api/cek_stok.php');
      const dataStok = await resStok.json();
      if (dataStok.status === 'success') {
        setNotifStok(dataStok.jumlah_stok_tipis);
      }
    } catch (error) {
      console.error("Gagal konek ke Backend PHP:", error);
      // Tidak perlu alert error agar tidak mengganggu user jika server PHP mati
    }
  };

  // 3. FUNGSI LAMA: FETCH SUPABASE
  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      const { data: masterData, error: masterError } = await supabase
        .from('master_sepatu')
        .select('*, paket_seri(nama_paket)')
        .order('stok', { ascending: true }); 

      if (masterError) throw masterError;

      const today = new Date().toISOString().split('T')[0];
      const startDay = `${today}T00:00:00`;
      const endDay = `${today}T23:59:59`;

      const { count: countMasuk } = await supabase
        .from('transaksi_masuk')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDay).lte('created_at', endDay);

      const { count: countKeluar } = await supabase
        .from('transaksi_keluar')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDay).lte('created_at', endDay);

      let totalStok = 0;
      let stokMenipis = 0;
      
      masterData.forEach(item => {
        totalStok += item.stok;
        if (item.stok < 10) stokMenipis++;
      });

      setKpiData({
        totalDusStok: totalStok,
        totalJenisPaket: masterData.length,
        itemStokMenipis: stokMenipis,
        masukHariIni: countMasuk || 0,
        keluarHariIni: countKeluar || 0
      });

      const analisis = masterData.map(item => {
        let status = 'Normal';
        if (item.stok < 5) status = 'FAST';
        else if (item.stok > 50) status = 'SLOW';

        return {
          id: item.id,
          kode: item.kode_barang,
          merk: item.merk,
          namaProduk: item.nama_produk,
          namaPaket: item.paket_seri?.nama_paket || '-',
          harga: item.harga_dus || 0,
          stok: item.stok,
          status: status
        };
      });

      setAnalisisBarang(analisis);

    } catch (error) {
      console.error("Error dashboard:", error);
    }

    setLoading(false);
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(angka);
  };

  const renderStatus = (status) => {
    if (status === 'FAST') {
      return <span style={{backgroundColor: '#d1fae5', color: '#065f46', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'}}>🔥 FAST MOVING</span>;
    } else if (status === 'SLOW') {
      return <span style={{backgroundColor: '#f3f4f6', color: '#1f2937', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'}}>🐢 SLOW MOVING</span>;
    }
    return <span style={{color: '#6b7280', fontSize: '0.8rem'}}>Normal</span>;
  };

  const filteredData = useMemo(() => {
    return analisisBarang.filter(item => 
      item.namaProduk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.merk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, analisisBarang]);

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Dashboard Pemilik</h1>
        <p>Ringkasan aktivitas, performa barang, dan status gudang hari ini.</p>
      </header>

      {/* --- 4. BAGIAN ALERT NOTIFIKASI BARU --- */}
      <div style={{ marginBottom: '20px' }}>
        
        {/* Notifikasi Harga Kosong (Merah) */}
        {notifHarga > 0 && (
          <div style={{
            backgroundColor: '#fee2e2', 
            border: '1px solid #ef4444', 
            color: '#b91c1c', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '10px',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <span>
              ⚠️ <strong>URGENT:</strong> Ada <b>{notifHarga}</b> sepatu baru belum dikasih harga!
            </span>
            <Link to="/edit-harga" style={{
              backgroundColor: '#dc2626', color: 'white', padding: '8px 12px', 
              textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '0.9rem'
            }}>
              Atur Harga →
            </Link>
          </div>
        )}

        {/* Notifikasi Stok Menipis (Kuning) */}
        {notifStok > 0 && (
          <div style={{
            backgroundColor: '#fef3c7', 
            border: '1px solid #f59e0b', 
            color: '#92400e', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '10px',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
             <span>
              📦 <strong>PERINGATAN:</strong> Ada <b>{notifStok}</b> varian sepatu stoknya hampir habis (dibawah 5).
            </span>
            <Link to="/laporan-stok" style={{
              backgroundColor: '#d97706', color: 'white', padding: '8px 12px', 
              textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '0.9rem'
            }}>
              Cek Stok →
            </Link>
          </div>
        )}
      </div>
      {/* --- AKHIR BAGIAN NOTIFIKASI --- */}

      {/* --- WIDGET KPI --- */}
      <div className="kpi-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'20px', marginBottom:'30px'}}>
        
        <div className="kpi-card" style={{background:'white', padding:'20px', borderRadius:'10px', borderLeft:'4px solid #3b82f6', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>
          <h4 style={{margin:0, color:'#64748b', fontSize:'0.9rem'}}>Total Stok (Dus)</h4>
          <p style={{fontSize:'2rem', fontWeight:'bold', margin:'10px 0', color:'#1e293b'}}>{loading ? '...' : kpiData.totalDusStok}</p>
          <small style={{color:'#94a3b8'}}>Gudang Utama</small>
        </div>

        <div className="kpi-card" style={{background:'white', padding:'20px', borderRadius:'10px', borderLeft:'4px solid #f59e0b', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>
          <h4 style={{margin:0, color:'#64748b', fontSize:'0.9rem'}}>Stok Menipis</h4>
          <p style={{fontSize:'2rem', fontWeight:'bold', margin:'10px 0', color:'#f59e0b'}}>{loading ? '...' : kpiData.itemStokMenipis}</p>
          <small style={{color:'#94a3b8'}}>Perlu Restock</small>
        </div>

        <div className="kpi-card" style={{background:'white', padding:'20px', borderRadius:'10px', borderLeft:'4px solid #10b981', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>
          <h4 style={{margin:0, color:'#64748b', fontSize:'0.9rem'}}>Masuk Hari Ini</h4>
          <p style={{fontSize:'2rem', fontWeight:'bold', margin:'10px 0', color:'#10b981'}}>{loading ? '...' : kpiData.masukHariIni}</p>
          <small style={{color:'#94a3b8'}}>Transaksi</small>
        </div>

        <div className="kpi-card" style={{background:'white', padding:'20px', borderRadius:'10px', borderLeft:'4px solid #ef4444', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>
          <h4 style={{margin:0, color:'#64748b', fontSize:'0.9rem'}}>Keluar Hari Ini</h4>
          <p style={{fontSize:'2rem', fontWeight:'bold', margin:'10px 0', color:'#ef4444'}}>{loading ? '...' : kpiData.keluarHariIni}</p>
          <small style={{color:'#94a3b8'}}>Transaksi</small>
        </div>
      </div>

      {/* --- SHORTCUT MENU --- */}
      <h3 style={{color:'#334155', marginBottom:'15px'}}>Pintasan Cepat</h3>
      <div className="shortcut-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'15px', marginBottom:'40px'}}>
        <Link to="/edit-harga" className="shortcut-card" style={{textDecoration:'none', background:'white', padding:'15px', borderRadius:'8px', border:'1px solid #e2e8f0', display:'block', transition:'transform 0.2s'}}>
          <h4 style={{margin:'0 0 5px 0', color:'#2563eb'}}>💰 Atur Harga</h4>
          <p style={{margin:0, fontSize:'0.85rem', color:'#64748b'}}>Update harga display</p>
        </Link>
        
        <Link to="/verifikasi-stok" className="shortcut-card" style={{textDecoration:'none', background:'white', padding:'15px', borderRadius:'8px', border:'1px solid #e2e8f0', display:'block'}}>
          <h4 style={{margin:'0 0 5px 0', color:'#0891b2'}}>📊 Stock Opname</h4>
          <p style={{margin:0, fontSize:'0.85rem', color:'#64748b'}}>Verifikasi stok fisik</p>
        </Link>

        <Link to="/laporan-stok" className="shortcut-card" style={{textDecoration:'none', background:'white', padding:'15px', borderRadius:'8px', border:'1px solid #e2e8f0', display:'block'}}>
          <h4 style={{margin:'0 0 5px 0', color:'#7c3aed'}}>📄 Laporan Stok</h4>
          <p style={{margin:0, fontSize:'0.85rem', color:'#64748b'}}>Cetak laporan harian</p>
        </Link>

        <Link to="/kelola-user" className="shortcut-card" style={{textDecoration:'none', background:'white', padding:'15px', borderRadius:'8px', border:'1px solid #e2e8f0', display:'block'}}>
          <h4 style={{margin:'0 0 5px 0', color:'#db2777'}}>👤 Kelola User</h4>
          <p style={{margin:0, fontSize:'0.85rem', color:'#64748b'}}>Tambah admin baru</p>
        </Link>
      </div>

      {/* --- ANALISIS BARANG --- */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
        <h3 style={{margin:0, color:'#334155'}}>Analisis Barang & Stok</h3>
        <input 
          type="text" 
          placeholder="🔍 Cari barang..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{padding:'8px 12px', borderRadius:'6px', border:'1px solid #cbd5e1'}}
        />
      </div>

      <div className="tabel-container-full">
        {loading ? <p style={{padding:20}}>Memuat data...</p> : (
          <table>
            <thead>
              <tr>
                <th>Produk & Paket</th>
                <th>Harga Display</th>
                <th>Status Performa</th>
                <th style={{textAlign:'center'}}>Sisa Stok</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div style={{fontWeight:'bold', color:'#333'}}>{item.merk} - {item.namaProduk}</div>
                      <div style={{fontSize:'0.8em', color:'#2563eb', fontFamily:'monospace', fontWeight:'bold'}}>{item.kode}</div>
                      <div style={{fontSize:'0.85em', color:'#666'}}>{item.namaPaket}</div>
                    </td>
                    
                    <td style={{fontWeight:'bold', color:'#475569'}}>
                       {formatRupiah(item.harga)}
                    </td>

                    <td>
                      {renderStatus(item.status)}
                    </td>

                    <td style={{textAlign:'center', fontWeight:'bold', fontSize:'1.1rem'}}>
                      <span style={{color: item.stok < 10 ? '#dc2626' : '#16a34a'}}>
                        {item.stok}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{textAlign:'center', padding:'30px', color:'#999'}}>Data tidak ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

export default PemilikDashboard;