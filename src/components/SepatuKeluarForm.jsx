import React, { useState } from 'react';
import './TransactionForm.css'; // <-- Kita pakai ulang CSS yang sama

// --- DATA CONTOH (DUMMY) ---
// Nanti, data ini akan Anda dapatkan dari backend/API

// 1. Daftar Produk (dari Data Sepatu Master)
const mockProdukList = [
  { id: 'SKU-001', nama: 'Sepatu Lari Model X', merk: 'Nike' }, // Kita tambahkan info Merk
  { id: 'SKU-002', nama: 'Sandal Model Y', merk: 'Adidas' },
  { id: 'SKU-003', nama: 'Sepatu Kantor Pria', merk: 'Fladeo' },
];

// 2. Daftar Paket (dari Pengelolaan Paket Seri)
const mockPaketList = [
  { id: 1, nama: 'Seri 38-42 (Isi 12)' },
  { id: 2, nama: 'Seri 39-43 (Isi 12)' },
  { id: 3, nama: 'Seri Anak A (Isi 20)' },
];

function SepatuKeluarForm() {
  // --- STATE YANG DIPERBARUI (SAMA SEPERTI BARANG MASUK) ---
  const [selectedProdukId, setSelectedProdukId] = useState('');
  const [selectedPaketId, setSelectedPaketId] = useState('');
  const [jumlahDus, setJumlahDus] = useState('1');
  const [tujuan, setTujuan] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Temukan merk berdasarkan produk yg dipilih (untuk data log)
    const produkTerpilih = mockProdukList.find(p => p.id === selectedProdukId);
    
    // Data yang akan dikirim ke backend
    const dataUntukBackend = {
      id_produk: selectedProdukId,
      merk: produkTerpilih ? produkTerpilih.merk : 'Tidak Diketahui', // Kirim juga merk-nya
      id_paket_seri: selectedPaketId,
      jumlah_dus: Number(jumlahDus),
      tujuan: tujuan,
    };

    console.log('Data Transaksi Keluar (Grosir):', dataUntukBackend);
    
    alert('Transaksi keluar (grosir) berhasil disimpan!');
    
    // Reset form
    setSelectedProdukId('');
    setSelectedPaketId('');
    setJumlahDus('1');
    setTujuan('');
  };

  return (
    <div className="form-container"> 
      <h3>Form Transaksi Sepatu Keluar (Grosir)</h3>
      
      <form onSubmit={handleSubmit}>
        
        {/* --- DROPDOWN PRODUK (BARU DITAMBAHKAN) --- */}
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
              // Tampilkan Merk di dropdown agar lebih jelas
              <option key={produk.id} value={produk.id}>
                {produk.merk} - {produk.nama} ({produk.id})
              </option>
            ))}
          </select>
        </div>

        {/* --- DROPDOWN PAKET SERI (SUDAH ADA, TAPI KINI JADI YANG KEDUA) --- */}
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

        {/* --- INPUT JUMLAH DUS (TETAP SAMA) --- */}
        <div className="form-group">
          <label htmlFor="jumlahDus">Jumlah Dus</label>
          <input
            type="number"
            id="jumlahDus"
            value={jumlahDus}
            onChange={(e) => setJumlahDus(e.target.value)}
            min="1"
            required
          />
        </div>

        {/* --- INPUT TUJUAN (TETAP SAMA) --- */}
        <div className="form-group">
          <label htmlFor="tujuan">Tujuan</label>
          <input
            type="text"
            id="tujuan"
            placeholder="Nama customer/tujuan..."
            value={tujuan}
            onChange={(e) => setTujuan(e.target.value)}
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

export default SepatuKeluarForm;