import React, { useState } from 'react';
import './EditTransaksiPage.css'; // Pakai style tabel yang sudah ada

// --- SIMULASI DATA GABUNGAN (STOK + HARGA) ---
const dataStokDisplay = [
  { 
    id: 1, 
    merk: 'Nike', 
    namaProduk: 'Air Force 1 \'07', 
    namaPaket: 'Seri 38-42 (Isi 12)', 
    totalStok: 8, // Sisa stok dus
    harga: 1500000 
  },
  { 
    id: 2, 
    merk: 'Adidas', 
    namaProduk: 'Samba OG', 
    namaPaket: 'Seri 38-42 (Isi 12)', 
    totalStok: 15, 
    harga: 1850000 
  },
  { 
    id: 3, 
    merk: 'New Balance', 
    namaProduk: '550', 
    namaPaket: 'Seri Anak A (Isi 20)', 
    totalStok: 20, 
    harga: 1799000 
  },
];

function StokBarangPage() {
  const [stokList] = useState(dataStokDisplay);

  // Helper: Format Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(angka);
  };

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Informasi Stok & Harga Barang</h1>
        <p>Daftar lengkap ketersediaan barang beserta harga display.</p>
      </header>

      <div className="tabel-container-full">
        <table>
          <thead>
            <tr>
              <th>Merk</th>
              <th>Nama Produk</th>
              <th>Paket Seri</th>
              <th style={{textAlign: 'center'}}>Sisa Stok (Dus)</th>
              <th style={{textAlign: 'right'}}>Harga Display</th>
            </tr>
          </thead>
          <tbody>
            {stokList.map(item => (
              <tr key={item.id}>
                <td>{item.merk}</td>
                <td style={{fontWeight: '500'}}>{item.namaProduk}</td>
                <td style={{color: '#666'}}>{item.namaPaket}</td>
                
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
                </td>

                {/* Kolom Harga */}
                <td style={{textAlign: 'right', fontWeight: 'bold', color: '#007bff'}}>
                  {formatRupiah(item.harga)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StokBarangPage;