import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import SepatuMasterModal from '../components/SepatuMasterModal'; 
import './Dashboard.css'; // Untuk style search bar

const SepatuMasterPage = () => {
  const [stokBarang, setStokBarang] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State untuk Modal & Search
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');

  // 1. AMBIL DATA DARI SUPABASE (JOIN DENGAN PAKET_SERI)
  useEffect(() => {
    fetchStok();
  }, []);

  const fetchStok = async () => {
    setLoading(true);
    // Kita join dengan tabel paket_seri untuk mengambil nama paketnya
    const { data, error } = await supabase
      .from('master_sepatu')
      .select('*, paket_seri(nama_paket)') 
      .order('id', { ascending: true });
    
    if (error) console.log(error);
    else setStokBarang(data || []);
    
    setLoading(false);
  };

  // Buka Modal Tambah Baru
  const handleOpenAdd = () => {
    setEditingItem(null); 
    setIsModalOpen(true);
  };

  // Buka Modal Edit
  const handleOpenEdit = (item) => {
    setEditingItem(item); 
    setIsModalOpen(true);
  };

  // 2. SIMPAN DATA (CREATE / UPDATE)
  const handleSaveData = async (formData) => {
    setLoading(true);

    if (editingItem) {
      // --- LOGIKA UPDATE ---
      const { error } = await supabase
        .from('master_sepatu')
        .update({
          kode_barang: formData.kode_barang,
          merk: formData.merk,
          nama_produk: formData.nama_produk,
          id_paket: formData.id_paket // Update Paket Seri juga
        })
        .eq('id', editingItem.id);

      if (error) alert("Gagal update: " + error.message);
      else alert("Data berhasil diperbarui!");

    } else {
      // --- LOGIKA TAMBAH BARU (INSERT) ---
      // Cek kode barang kembar di state lokal
      const cekKembar = stokBarang.find(b => b.kode_barang === formData.kode_barang);
      if(cekKembar) {
        alert("Kode Barang sudah ada!");
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('master_sepatu')
        .insert([{
            kode_barang: formData.kode_barang,
            merk: formData.merk,
            nama_produk: formData.nama_produk,
            id_paket: formData.id_paket, // Simpan Paket Seri
            stok: 0, 
            harga_dus: 0 
        }]);

      if (error) alert("Gagal simpan: " + error.message);
      else alert("Barang baru berhasil ditambahkan!");
    }

    setLoading(false);
    setIsModalOpen(false); 
    fetchStok(); // Refresh tabel
  };

  // 3. LOGIC PENCARIAN
  const filteredData = useMemo(() => {
    return stokBarang.filter(item => {
      const term = searchTerm.toLowerCase();
      const namaPaket = item.paket_seri?.nama_paket?.toLowerCase() || '';
      
      return (
        item.nama_produk?.toLowerCase().includes(term) ||
        item.merk?.toLowerCase().includes(term) ||
        item.kode_barang?.toLowerCase().includes(term) ||
        namaPaket.includes(term)
      );
    });
  }, [stokBarang, searchTerm]);

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>📦 Data Master Sepatu</h1>
        <p>Kelola data induk sepatu (Kode, Nama, Merk, & Seri Ukuran).</p>
      </header>

      {/* --- TOOLBAR: SEARCH & ADD BUTTON --- */}
      <div className="filter-container" style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', justifyContent:'space-between' }}>
        
        {/* Input Pencarian */}
        <input 
          type="text" 
          placeholder="🔍 Cari Kode, Merk, atau Seri Ukuran..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{ 
            padding: '12px 15px', 
            borderRadius: '8px', 
            border: '1px solid #ddd', 
            flex: 1, 
            minWidth: '250px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
        />

        {/* Tombol Tambah */}
        <button 
            onClick={handleOpenAdd}
            className="button-cetak" // Pakai class yg sudah ada biar biru cantik
            style={{ margin: 0, display:'flex', alignItems:'center', gap:'5px' }}>
            + Tambah Data Master
        </button>
      </div>

      {/* Tabel Stok */}
      <div style={{ marginTop: '20px', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        {loading ? <p style={{padding:20}}>Sedang memuat data...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left', fontSize:'0.9rem' }}>
                <th style={{padding: '12px'}}>Kode</th>
                <th style={{padding: '12px'}}>Merk</th>
                <th style={{padding: '12px'}}>Produk</th>
                <th style={{padding: '12px'}}>Ukuran / Seri</th> {/* KOLOM BARU */}
                <th style={{padding: '12px'}}>Stok Gudang</th>
                <th style={{padding: '12px'}}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{padding: '12px', fontFamily: 'monospace', fontWeight: 'bold', color:'#555'}}>{item.kode_barang}</td>
                    <td style={{padding: '12px'}}>{item.merk}</td>
                    <td style={{padding: '12px', fontWeight:'500'}}>{item.nama_produk}</td>
                    
                    {/* Tampilkan Nama Paket Seri */}
                    <td style={{padding: '12px', color:'#666', fontSize:'0.9rem'}}>
                      {item.paket_seri?.nama_paket || <span style={{color:'#e74c3c', fontSize:'0.8rem'}}>Belum diatur</span>}
                    </td>

                    <td style={{padding: '12px', fontWeight:'bold'}}>
                      {item.stok} <span style={{fontSize:'0.8rem', fontWeight:'normal', color:'#888'}}>Dus</span>
                    </td>
                    
                    <td style={{padding: '12px'}}>
                        <button 
                            onClick={() => handleOpenEdit(item)}
                            style={{color:'#3b82f6', background:'none', border:'none', cursor:'pointer', fontWeight:'bold'}}>
                            Edit Info
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* --- MODAL KOMPONEN --- */}
      {isModalOpen && (
        <SepatuMasterModal 
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveData}
            initialData={editingItem}
        />
      )}

    </div>
  );
};

export default SepatuMasterPage;