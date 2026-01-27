import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import './EditTransaksiPage.css'; // Pakai style tabel yang rapi
import './Dashboard.css'; 

function AturHargaPage() {
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPrices, setEditPrices] = useState({}); // Menyimpan harga yang sedang diketik
  const [searchTerm, setSearchTerm] = useState(''); 

  // 1. AMBIL DATA DARI SUPABASE
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('master_sepatu')
      .select('*')
      .order('kode_barang', { ascending: true });

    if (error) console.log("Error:", error.message);
    else setProdukList(data || []);
    
    setLoading(false);
  };

  // Helper Format Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(angka || 0);
  };

  // Handle saat mengetik harga baru
  const handlePriceChange = (id, value) => {
    setEditPrices({
      ...editPrices,
      [id]: value
    });
  };

  // 2. SIMPAN HARGA KE DATABASE
  const handleSave = async (id) => {
    const hargaBaru = editPrices[id];
    if (!hargaBaru) return;

    try {
      // Update ke Supabase
      const { error } = await supabase
        .from('master_sepatu')
        .update({ harga_dus: parseInt(hargaBaru) }) // Pastikan update kolom 'harga_dus'
        .eq('id', id);

      if (error) throw error;

      // Update State Lokal (Biar langsung berubah tanpa refresh)
      setProdukList(prev => prev.map(item => 
        item.id === id ? { ...item, harga_dus: parseInt(hargaBaru) } : item
      ));

      // Bersihkan input
      const newEditPrices = { ...editPrices };
      delete newEditPrices[id];
      setEditPrices(newEditPrices);

      alert('✅ Harga berhasil diperbarui!');

    } catch (err) {
      alert("Gagal update: " + err.message);
    }
  };

  // --- LOGIC SEARCHING ---
  const filteredData = useMemo(() => {
    return produkList.filter(item => {
      const term = searchTerm.toLowerCase();
      return (
        item.nama_produk?.toLowerCase().includes(term) ||
        item.merk?.toLowerCase().includes(term) ||
        item.kode_barang?.toLowerCase().includes(term)
      );
    });
  }, [produkList, searchTerm]);

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>💰 Atur Harga Barang</h1>
        <p>Halaman khusus Pemilik untuk menentukan harga jual per Dus.</p>
      </header>

      {/* --- FITUR PENCARIAN --- */}
      <div className="filter-container" style={{ display: 'flex', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="🔍 Cari ID barang, nama produk, atau merk..." 
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
        {loading ? <p style={{padding:20}}>Memuat data harga...</p> : (
          <table>
            <thead>
              <tr>
                <th>ID Barang</th>
                <th>Info Produk</th>
                <th>Stok Gudang</th>
                <th style={{textAlign: 'right'}}>Harga/Dus (Saat Ini)</th>
                <th>Set Harga Baru</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map(item => (
                  <tr key={item.id}>
                    
                    {/* ID BARANG */}
                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#555' }}>
                      {item.kode_barang}
                    </td>

                    {/* Info Produk */}
                    <td>
                      <strong>{item.merk}</strong>
                      <div style={{fontSize: '13px', color: '#444'}}>{item.nama_produk}</div>
                    </td>
                    
                    {/* Stok (Menggantikan kolom Ukuran yg tidak ada di DB master) */}
                    <td style={{ color: item.stok < 5 ? 'red' : '#555', fontWeight: '500' }}>
                      {item.stok} Dus
                    </td>
                    
                    {/* Harga Saat Ini */}
                    <td style={{textAlign: 'right', fontWeight: 'bold', color: '#333'}}>
                      {item.harga_dus === 0 || item.harga_dus === null ? 
                        <span style={{color:'#e74c3c', backgroundColor:'#ffebee', padding:'4px 8px', borderRadius:'4px', fontSize:'0.85rem'}}>Belum diatur</span> 
                        : formatRupiah(item.harga_dus)
                      }
                    </td>

                    {/* Input Harga Baru */}
                    <td>
                      <input 
                        type="number" 
                        placeholder="Input harga..."
                        value={editPrices[item.id] || ''}
                        onChange={(e) => handlePriceChange(item.id, e.target.value)}
                        style={{
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          width: '100%',
                          maxWidth: '150px'
                        }}
                      />
                    </td>

                    {/* Tombol Simpan */}
                    <td>
                      <button 
                        className="button-cetak" 
                        style={{
                          padding: '8px 16px', 
                          fontSize: '13px', 
                          margin: 0,
                          backgroundColor: editPrices[item.id] ? '#2563eb' : '#cbd5e1', 
                          cursor: editPrices[item.id] ? 'pointer' : 'not-allowed',
                          border: 'none',
                          color: 'white',
                          borderRadius: '6px'
                        }}
                        onClick={() => handleSave(item.id)}
                        disabled={!editPrices[item.id]} 
                      >
                        Update
                      </button>
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

export default AturHargaPage;