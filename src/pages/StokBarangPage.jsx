import React, { useState, useMemo } from 'react';
import './EditTransaksiPage.css'; // Pakai style tabel yang sudah ada
import './Dashboard.css'; // Untuk search bar style

// --- SIMULASI DATA GABUNGAN (STOK + HARGA + ID + UKURAN) ---
const dataStokDisplay = [
  { 
    id: 1, 
    kode: 'NK-AF1-001', // DATA BARU: ID Barang
    merk: 'Nike', 
    namaProduk: 'Air Force 1 \'07', 
    namaPaket: 'Seri 38-42 (Isi 12)', 
    ukuran: '38 - 42', // DATA BARU: Ukuran
    totalStok: 8, // Sisa stok dus
    harga: 1500000 
  },
  { 
    id: 2, 
    kode: 'AD-SMB-002', 
    merk: 'Adidas', 
    namaProduk: 'Samba OG', 
    namaPaket: 'Seri 38-42 (Isi 12)', 
    ukuran: '38 - 42',
    totalStok: 15, 
    harga: 1850000 
  },
  { 
    id: 3, 
    kode: 'NB-550-003', 
    merk: 'New Balance', 
    namaProduk: '550', 
    namaPaket: 'Seri Anak A (Isi 20)', 
    ukuran: 'Anak (30-35)',
    totalStok: 20, 
    harga: 1799000 
  },
  { 
    id: 4, 
    kode: 'VN-OLD-004', 
    merk: 'Vans', 
    namaProduk: 'Old Skool', 
    namaPaket: 'Seri 40-44 (Isi 12)', 
    ukuran: '40 - 44',
    totalStok: 5, 
    harga: 900000 
  },
];

function StokBarangPage() {
  const [stokList] = useState(dataStokDisplay);
  const [searchTerm, setSearchTerm] = useState(''); // State untuk search

  // Helper: Format Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(angka);
  };

  // Logic Pencarian
  const filteredData = useMemo(() => {
    return stokList.filter(item => {
      const term = searchTerm.toLowerCase();
      return (
        item.namaProduk.toLowerCase().includes(term) ||
        item.merk.toLowerCase().includes(term) ||
        item.kode.toLowerCase().includes(term) ||
        item.ukuran.toLowerCase().includes(term)
      );
    });
  }, [stokList, searchTerm]);

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Informasi Stok & Harga Barang</h1>
        <p>Daftar lengkap ketersediaan barang beserta harga display.</p>
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
              <th>Merk</th>
              <th>Nama Produk</th>
              <th>Paket Seri</th>
              <th>Ukuran</th> {/* KOLOM BARU */}
              <th style={{textAlign: 'center'}}>Sisa Stok (Dus)</th>
              <th style={{textAlign: 'right'}}>Harga Display</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(item => (
                <tr key={item.id}>
                  
                  {/* ID Barang (Monospace) */}
                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#555' }}>
                    {item.kode}
                  </td>

                  <td>{item.merk}</td>
                  <td style={{fontWeight: '500'}}>{item.namaProduk}</td>
                  <td style={{color: '#666', fontSize:'0.9rem'}}>{item.namaPaket}</td>
                  
                  {/* Kolom Ukuran */}
                  <td style={{color: '#555', fontWeight: '500'}}>{item.ukuran}</td>
                  
                  {/* Kolom Stok dengan Warna Peringatan */}
                  <td style={{textAlign: 'center', fontWeight: 'bold'}}>
                    <span style={{
                      color: item.totalStok < 10 ? '#d9534f' : '#28a745',
                      backgroundColor: item.totalStok < 10 ? '#fff3cd' : 'transparent',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>
                      {item.totalStok} Dus
                    </span>
                    {item.totalStok < 10 && <div style={{fontSize: '0.7em', color: '#d9534f', marginTop:'2px'}}>Stok Menipis</div>}
                  </td>

                  {/* Kolom Harga */}
                  <td style={{textAlign: 'right', fontWeight: 'bold', color: '#007bff'}}>
                    {formatRupiah(item.harga)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
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

export default StokBarangPage;