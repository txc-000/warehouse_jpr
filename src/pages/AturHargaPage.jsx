import React, { useState, useMemo } from 'react';
import './EditTransaksiPage.css'; // Pakai style tabel
import './Dashboard.css'; // Pastikan CSS dashboard (untuk search bar) ada

// Data Awal (DIPERBARUI DENGAN FORMAT ID BARANG KONSISTEN)
const initialData = [
  { id: 1, kode: 'NK-AF1-001', nama: 'Air Force 1 \'07', merk: 'Nike', ukuran: '38 - 42', harga: 1500000 },
  { id: 2, kode: 'AD-SMB-002', nama: 'Samba OG', merk: 'Adidas', ukuran: '38 - 42', harga: 1850000 },
  { id: 3, kode: 'NB-550-003', nama: 'New Balance 550', merk: 'New Balance', ukuran: 'Anak (30-35)', harga: 0 }, // Belum diatur
  { id: 4, kode: 'VN-OLD-004', nama: 'Old Skool', merk: 'Vans', ukuran: '40 - 44', harga: 900000 },
];

function AturHargaPage() {
  const [produkList, setProdukList] = useState(initialData);
  const [editPrices, setEditPrices] = useState({}); // Menyimpan harga yang sedang diketik
  const [searchTerm, setSearchTerm] = useState(''); // State untuk pencarian

  // Helper Format Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(angka);
  };

  // Handle saat mengetik harga baru
  const handlePriceChange = (id, value) => {
    setEditPrices({
      ...editPrices,
      [id]: value
    });
  };

  // Simpan Harga
  const handleSave = (id) => {
    const hargaBaru = editPrices[id];
    if (!hargaBaru) return;

    // Update data utama
    setProdukList(prev => prev.map(item => 
      item.id === id ? { ...item, harga: Number(hargaBaru) } : item
    ));

    // Bersihkan input
    const newEditPrices = { ...editPrices };
    delete newEditPrices[id];
    setEditPrices(newEditPrices);

    alert('Harga berhasil diperbarui!');
  };

  // --- LOGIC SEARCHING ---
  const filteredData = useMemo(() => {
    return produkList.filter(item => {
      const term = searchTerm.toLowerCase();
      return (
        item.nama.toLowerCase().includes(term) ||
        item.merk.toLowerCase().includes(term) ||
        item.kode.toLowerCase().includes(term) ||
        item.ukuran.toLowerCase().includes(term)
      );
    });
  }, [produkList, searchTerm]);

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Edit Harga</h1>
        <p>Halaman khusus Pemilik untuk menentukan harga jual/modal barang.</p>
      </header>

      {/* --- FITUR PENCARIAN (SEARCH) --- */}
      <div className="filter-container" style={{ display: 'flex', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="🔍 Cari ID barang, nama, merk, atau ukuran..." 
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
        <table>
          <thead>
            <tr>
              <th>ID Barang</th> {/* KOLOM BARU */}
              <th>Info Produk</th>
              <th>Ukuran</th>
              <th style={{textAlign: 'right'}}>Harga Saat Ini</th>
              <th>Set Harga Baru</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(item => (
                <tr key={item.id}>
                  
                  {/* KOLOM ID BARANG (Style Monospace) */}
                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#555' }}>
                    {item.kode}
                  </td>

                  {/* Info Produk (Nama & Merk) */}
                  <td>
                    <strong>{item.merk}</strong>
                    <div style={{fontSize: '13px', color: '#444'}}>{item.nama}</div>
                  </td>
                  
                  {/* Info Ukuran */}
                  <td style={{ color: '#555', fontWeight: '500' }}>
                    {item.ukuran}
                  </td>
                  
                  {/* Harga Saat Ini */}
                  <td style={{textAlign: 'right', fontWeight: 'bold', color: '#333'}}>
                    {item.harga === 0 ? 
                      <span style={{color:'#e74c3c', backgroundColor:'#ffebee', padding:'4px 8px', borderRadius:'4px', fontSize:'0.85rem'}}>Belum diatur</span> 
                      : formatRupiah(item.harga)
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
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        width: '100%'
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
                        backgroundColor: editPrices[item.id] ? '#007bff' : '#cbd5e1', 
                        cursor: editPrices[item.id] ? 'pointer' : 'not-allowed'
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
                  Barang tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AturHargaPage;