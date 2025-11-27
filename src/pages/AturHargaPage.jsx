import React, { useState } from 'react';
import './EditTransaksiPage.css'; // Pakai style tabel yang sudah ada

// Data Awal (Harga bisa 0 jika baru ditambah admin)
const initialData = [
  { id: 1, kode: 'AF1', nama: 'Air Force 1 \'07', merk: 'Nike', harga: 1500000 },
  { id: 2, kode: 'SMBA', nama: 'Samba OG', merk: 'Adidas', harga: 1850000 },
  { id: 3, kode: '550', nama: 'New Balance 550', merk: 'New Balance', harga: 0 }, // Contoh barang baru
];

function AturHargaPage() {
  const [produkList, setProdukList] = useState(initialData);
  const [editPrices, setEditPrices] = useState({}); // Menyimpan harga yang sedang diketik

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

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Atur Harga Barang</h1>
        <p>Halaman khusus Pemilik untuk menentukan harga jual/modal barang.</p>
      </header>

      <div className="tabel-container-full">
        <table>
          <thead>
            <tr>
              <th>Info Produk</th>
              <th style={{textAlign: 'right'}}>Harga Saat Ini</th>
              <th>Set Harga Baru</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {produkList.map(item => (
              <tr key={item.id}>
                <td>
                  <strong>{item.merk} - {item.nama}</strong>
                  <div style={{fontSize: '12px', color: '#666'}}>SKU: {item.kode}</div>
                </td>
                
                {/* Harga Saat Ini */}
                <td style={{textAlign: 'right', fontWeight: 'bold', color: '#555'}}>
                  {item.harga === 0 ? <span style={{color:'red'}}>Belum diatur</span> : formatRupiah(item.harga)}
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
                      border: '1px solid #ccc',
                      width: '100%'
                    }}
                  />
                </td>

                {/* Tombol Simpan */}
                <td>
                  <button 
                    className="button-cetak" // Pakai style tombol biru yg ada
                    style={{padding: '8px 12px', fontSize: '12px', margin: 0}}
                    onClick={() => handleSave(item.id)}
                    disabled={!editPrices[item.id]} // Disabled jika kosong
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AturHargaPage;