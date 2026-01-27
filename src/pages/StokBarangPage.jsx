import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import './EditTransaksiPage.css'; // Menggunakan style tabel yang sudah ada
import './Dashboard.css'; // Untuk style search bar

function StokBarangPage() {
  const [stokList, setStokList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); 

  // 1. AMBIL DATA REALTIME DARI SUPABASE (JOIN TABLE)
  useEffect(() => {
    fetchStok();
  }, []);

  const fetchStok = async () => {
    setLoading(true);
    
    // PENTING: Kita menggunakan query select('*, paket_seri(nama_paket)')
    // Ini artinya: Ambil semua data sepatu DAN ambil nama_paket dari tabel paket_seri yang terhubung
    const { data, error } = await supabase
      .from('master_sepatu')
      .select('*, paket_seri(nama_paket)') 
      .order('stok', { ascending: true }); // Stok paling dikit di atas

    if (error) {
      console.log("Error mengambil data stok:", error.message);
    } else {
      setStokList(data || []);
    }
    
    setLoading(false);
  };

  // Helper: Format Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(angka || 0);
  };

  // Logic Pencarian (Filter)
  const filteredData = useMemo(() => {
    return stokList.filter(item => {
      const term = searchTerm.toLowerCase();
      // Ambil nama paket dari relasi (jaga-jaga kalau null)
      const namaPaket = item.paket_seri?.nama_paket?.toLowerCase() || '';
      
      return (
        item.nama_produk?.toLowerCase().includes(term) ||
        item.merk?.toLowerCase().includes(term) ||
        item.kode_barang?.toLowerCase().includes(term) ||
        namaPaket.includes(term) // Sekarang bisa cari nama paket juga!
      );
    });
  }, [stokList, searchTerm]);

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Informasi Stok & Harga Barang</h1>
        <p>Monitor ketersediaan stok gudang, varian ukuran, dan harga display saat ini.</p>
      </header>

      {/* --- FITUR PENCARIAN (SEARCH) --- */}
      <div className="filter-container" style={{ display: 'flex', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="🔍 Cari ID, nama, merk, atau seri ukuran..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{ 
            padding: '12px 15px', 
            borderRadius: '8px', 
            border: '1px solid #ddd', 
            width: '100%',
            maxWidth: '500px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
        />
      </div>

      <div className="tabel-container-full">
        {loading ? <p style={{padding:20, textAlign:'center'}}>Sedang memuat data stok...</p> : (
          <table>
            <thead>
              <tr>
                <th>ID Barang</th> 
                <th>Merk</th>
                <th>Nama Produk</th>
                <th>Ukuran / Seri</th> {/* KOLOM BARU */}
                <th style={{textAlign: 'center'}}>Sisa Stok (Dus)</th>
                <th style={{textAlign: 'right'}}>Harga Display / Dus</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map(item => (
                  <tr key={item.id}>
                    
                    {/* ID Barang (Monospace) */}
                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#555' }}>
                      {item.kode_barang}
                    </td>

                    <td>{item.merk}</td>
                    <td style={{fontWeight: '500'}}>{item.nama_produk}</td>
                    
                    {/* Kolom Ukuran / Seri (Dari Relasi Tabel) */}
                    <td style={{color: '#666', fontSize:'0.9rem'}}>
                       {item.paket_seri?.nama_paket || '-'}
                    </td>
                    
                    {/* Kolom Stok dengan Warna Peringatan */}
                    <td style={{textAlign: 'center', fontWeight: 'bold'}}>
                      <span style={{
                        color: item.stok < 10 ? '#721c24' : '#155724', // Merah tua / Hijau tua text
                        backgroundColor: item.stok < 10 ? '#f8d7da' : '#d4edda', // Merah muda / Hijau muda bg
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        display: 'inline-block',
                        minWidth: '80px'
                      }}>
                        {item.stok} Dus
                      </span>
                      {/* Peringatan tambahan jika stok kritis */}
                      {item.stok < 5 && (
                        <div style={{
                          fontSize: '0.75rem', 
                          color: '#dc3545', 
                          marginTop:'5px', 
                          fontWeight:'bold',
                          textTransform: 'uppercase'
                        }}>
                          ⚠️ Perlu Restock
                        </div>
                      )}
                    </td>

                    {/* Kolom Harga */}
                    <td style={{textAlign: 'right', fontWeight: 'bold', color: '#007bff'}}>
                      {item.harga_dus ? formatRupiah(item.harga_dus) : <span style={{color:'#999', fontSize:'0.8rem'}}>Belum set harga</span>}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                    Data barang tidak ditemukan.
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

export default StokBarangPage;