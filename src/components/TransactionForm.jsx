import React, { useState, useMemo } from 'react';
import './TransactionForm.css';

// --- (1) DATA BARU (DENGAN ID/KODE & MERK) ---
const mockMerkList = [
  { id: 1, nama: 'Nike' },
  { id: 2, nama: 'Adidas' },
  { id: 3, nama: 'New Balance' },
  { id: 4, nama: 'Vans' },
];

const mockProdukList = [
  { id: 1, kode: 'NK-RUN-005', nama: 'Sepatu Lari Model X', merkId: 1 },
  { id: 2, kode: 'NK-AF1-001', nama: 'Air Force 1 \'07', merkId: 1 },
  { id: 3, kode: 'AD-SDL-006', nama: 'Sandal Model Y', merkId: 2 },
  { id: 4, kode: 'AD-SMB-002', nama: 'Samba OG', merkId: 2 },
  { id: 5, kode: 'NB-550-003', nama: '550', merkId: 3 },
  { id: 6, kode: 'VN-OLD-004', nama: 'Old Skool', merkId: 4 },
];

const mockPaketList = [
  { id: 1, nama: 'Seri 38-42 (Isi 12)' },
  { id: 2, nama: 'Seri 39-43 (Isi 12)' },
  { id: 3, nama: 'Seri Anak A (Isi 20)' },
  { id: 4, nama: 'Seri 40-44 (Isi 12)' },
];

function TransactionForm() {
  const [selectedMerkId, setSelectedMerkId] = useState('');
  const [selectedProdukId, setSelectedProdukId] = useState(''); // Satu ID untuk Kode & Nama
  const [selectedPaketId, setSelectedPaketId] = useState('');
  const [jumlahDus, setJumlahDus] = useState('1');
  const [supplier, setSupplier] = useState('');

  // --- FILTER PRODUK BERDASARKAN MERK ---
  const filteredProdukList = useMemo(() => {
    if (!selectedMerkId) return [];
    return mockProdukList.filter(p => p.merkId === Number(selectedMerkId));
  }, [selectedMerkId]);

  const handleMerkChange = (e) => {
    setSelectedMerkId(e.target.value);
    setSelectedProdukId(''); // Reset produk saat merk ganti
  };
  
  // --- SUBMIT ---
  const handleSubmit = (event) => {
    event.preventDefault(); 
    
    const merkTerpilih = mockMerkList.find(m => m.id === Number(selectedMerkId));
    const produkTerpilih = mockProdukList.find(p => p.id === Number(selectedProdukId));
    const paketTerpilih = mockPaketList.find(p => p.id === Number(selectedPaketId));
    
    const dataUntukBackend = {
      id_transaksi: Date.now(), 
      kode_barang: produkTerpilih ? produkTerpilih.kode : '-',
      merk: merkTerpilih ? merkTerpilih.nama : '-',
      nama_produk: produkTerpilih ? produkTerpilih.nama : '-',
      nama_paket: paketTerpilih ? paketTerpilih.nama : '-',
      jumlah_dus: Number(jumlahDus),
      supplier: supplier,
      tanggal: new Date().toISOString()
    };

    console.log('Data Transaksi:', dataUntukBackend);
    alert(`Transaksi Berhasil Disimpan!\n\nKode: ${dataUntukBackend.kode_barang}\nProduk: ${dataUntukBackend.nama_produk}\nJumlah: ${dataUntukBackend.jumlah_dus} Dus`);
    
    // Reset
    setSelectedMerkId('');
    setSelectedProdukId('');
    setSelectedPaketId('');
    setJumlahDus('1');
    setSupplier('');
  };

  return (
    <div className="form-container">
      <h3>Form Transaksi Sepatu Masuk (Grosir)</h3>
      
      <form onSubmit={handleSubmit}>

        {/* 1. PILIH MERK */}
        <div className="form-group">
          <label htmlFor="merk">Merk</label>
          <select
            id="merk"
            value={selectedMerkId}
            onChange={handleMerkChange}
            required
          >
            <option value="" disabled>-- Pilih Merk --</option>
            {mockMerkList.map(merk => (
              <option key={merk.id} value={merk.id}>
                {merk.nama}
              </option>
            ))}
          </select>
        </div>

        {/* 2. DROPDOWN KODE BARANG (Baru) */}
        <div className="form-group">
          <label htmlFor="kodeBarang">Kode Barang (SKU)</label>
          <select
            id="kodeBarang"
            value={selectedProdukId}
            // Mengubah Kode otomatis mengubah Nama juga (karena pakai ID yang sama)
            onChange={(e) => setSelectedProdukId(e.target.value)}
            required
            disabled={!selectedMerkId}
            style={{ fontFamily: 'monospace', fontWeight: 'bold' }} // Style kode
          >
            <option value="" disabled>-- Pilih Kode --</option>
            {filteredProdukList.map(produk => (
              <option key={produk.id} value={produk.id}>
                {produk.kode}
              </option>
            ))}
          </select>
        </div>

        {/* 3. DROPDOWN NAMA PRODUK (Sinkron dengan Kode) */}
        <div className="form-group">
          <label htmlFor="namaProduk">Nama Produk</label>
          <select
            id="namaProduk"
            value={selectedProdukId}
            // Mengubah Nama otomatis mengubah Kode juga
            onChange={(e) => setSelectedProdukId(e.target.value)}
            required
            disabled={!selectedMerkId}
          >
            <option value="" disabled>-- Pilih Nama Produk --</option>
            {filteredProdukList.map(produk => (
              <option key={produk.id} value={produk.id}>
                {produk.nama}
              </option>
            ))}
          </select>
        </div>

        {/* 4. PAKET SERI */}
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

        {/* 5. JUMLAH DUS */}
        <div className="form-group">
          <label htmlFor="jumlahDus">Jumlah Dus Masuk</label>
          <input
            type="number"
            id="jumlahDus"
            value={jumlahDus}
            onChange={(e) => setJumlahDus(e.target.value)}
            min="1"
            required
          />
        </div>

        {/* 6. SUPPLIER */}
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