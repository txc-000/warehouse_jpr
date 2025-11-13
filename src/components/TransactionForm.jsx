import React, { useState } from 'react';
import './TransactionForm.css';

// --- DATA CONTOH (DUMMY) ---
// Nanti, data ini akan Anda dapatkan dari backend/API

// 1. Daftar Produk (dari Data Sepatu Master)
const mockProdukList = [
  { id: 'SKU-001', nama: 'Sepatu Lari Model X' },
  { id: 'SKU-002', nama: 'Sandal Model Y' },
  { id: 'SKU-003', nama: 'Sepatu Kantor Pria' },
];

// 2. Daftar Paket (dari Pengelolaan Paket Seri)
const mockPaketList = [
  { id: 1, nama: 'Seri 38-42 (Isi 12)' },
  { id: 2, nama: 'Seri 39-43 (Isi 12)' },
  { id: 3, nama: 'Seri Anak A (Isi 20)' },
];

function TransactionForm() {
  // --- STATE BARU SESUAI LOGIKA GROSIR ---
  const [selectedProdukId, setSelectedProdukId] = useState('');
  const [selectedPaketId, setSelectedPaketId] = useState('');
  const [jumlahDus, setJumlahDus] = useState('1'); // <-- diubah dari 'jumlah'
  const [supplier, setSupplier] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); 
    
    // Data yang dikirim ke backend sekarang sesuai dengan bisnis grosir
    const dataUntukBackend = {
      id_produk: selectedProdukId,
      id_paket_seri: selectedPaketId,
      jumlah_dus: Number(jumlahDus),
      supplier: supplier,
    };

    console.log('Data Transaksi Masuk (Grosir):', dataUntukBackend);
    
    alert('Transaksi (grosir) berhasil disimpan!');
    
    // Reset form
    setSelectedProdukId('');
    setSelectedPaketId('');
    setJumlahDus('1');
    setSupplier('');
  };

  return (
    <div className="form-container">
      <h3>Form Transaksi Sepatu Masuk (Grosir)</h3>
      
      <form onSubmit={handleSubmit}>

        {/* --- DROPDOWN PRODUK (BARU) --- */}
        <div className="form-group">
          <label htmlFor="produk">Pilih Produk</label>
          <select
            id="produk"
            value={selectedProdukId}
            onChange={(e) => setSelectedProdukId(e.target.value)}
            required
          >
            <option value="" disabled>-- Pilih produk --</option>
            {mockProdukList.map(produk => (
              <option key={produk.id} value={produk.id}>
                {produk.nama} ({produk.id})
              </option>
            ))}
          </select>
        </div>

        {/* --- DROPDOWN PAKET SERI (BARU) --- */}
        <div className="form-group">
          <label htmlFor="paketSeri">Pilih Paket Seri</label>
          <select
            id="paketSeri"
            value={selectedPaketId}
            onChange={(e) => setSelectedPaketId(e.target.value)}
            required
          >
            <option value="" disabled>-- Pilih paket grosir --</option>
            {mockPaketList.map(paket => (
              <option key={paket.id} value={paket.id}>
                {paket.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Input 'Kode Sepatu' dan 'Size' sudah dihapus */}

        {/* --- INPUT JUMLAH DUS (MODIFIKASI) --- */}
        <div className="form-group">
          <label htmlFor="jumlahDus">Jumlah Dus Masuk</label> {/* <-- Label diubah */}
          <input
            type="number"
            id="jumlahDus"
            value={jumlahDus} // <-- State diubah
            onChange={(e) => setJumlahDus(e.target.value)} // <-- State diubah
            min="1"
            required
          />
        </div>

        {/* --- INPUT SUPPLIER (TETAP SAMA) --- */}
        <div className="form-group">
          <label htmlFor="supplier">Supplier</label>
          <input
            type="text"
            id="supplier"
            placeholder="Nama supplier..."
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Simpan Transaksi
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;