import React, { useState, useMemo } from 'react';
import './TransactionForm.css'; // Pakai ulang CSS

// --- (1) STRUKTUR DATA BARU (SAMA SEPERTI LAINNYA) ---
const mockMerkList = [
  { id: 1, nama: 'Nike' },
  { id: 2, nama: 'Adidas' },
  { id: 3, nama: 'New Balance' },
];

const mockProdukList = [
  { id: 'SKU-001', nama: 'Sepatu Lari Model X', merkId: 1 },
  { id: 'SKU-004', nama: 'Air Force 1 \'07', merkId: 1 },
  { id: 'SKU-002', nama: 'Sandal Model Y', merkId: 2 },
  { id: 'SKU-005', nama: 'Samba OG', merkId: 2 },
  { id: 'SKU-003', nama: '550', merkId: 3 },
];

const mockPaketList = [
  { id: 1, nama: 'Seri 38-42 (Isi 12)' },
  { id: 2, nama: 'Seri 39-43 (Isi 12)' },
  { id: 3, nama: 'Seri Anak A (Isi 20)' },
];
// --- BATAS DATA BARU ---

function SepatuKeluar() { // Ganti nama fungsi jika file Anda SepatuKeluar.jsx
  // --- (2) STATE DIPERBARUI ---
  const [selectedMerkId, setSelectedMerkId] = useState('');
  const [selectedProdukId, setSelectedProdukId] = useState('');
  const [selectedPaketId, setSelectedPaketId] = useState('');
  const [jumlahDus, setJumlahDus] = useState('1');
  const [tujuan, setTujuan] = useState('');

  // --- (3) LOGIKA DROPDOWN BERTINGKAT ---
  const filteredProdukList = useMemo(() => {
    if (!selectedMerkId) return [];
    return mockProdukList.filter(p => p.merkId === Number(selectedMerkId));
  }, [selectedMerkId]);

  const handleMerkChange = (e) => {
    setSelectedMerkId(e.target.value);
    setSelectedProdukId(''); // Reset produk
  };
  
  // --- (4) LOGIKA SUBMIT DIPERBARUI ---
  const handleSubmit = (event) => {
    event.preventDefault();
    
    const merkTerpilih = mockMerkList.find(m => m.id === Number(selectedMerkId));

    const dataUntukBackend = {
      id_produk: selectedProdukId,
      merk: merkTerpilih ? merkTerpilih.nama : 'Tidak Diketahui',
      id_paket_seri: selectedPaketId,
      jumlah_dus: Number(jumlahDus),
      tujuan: tujuan,
    };

    console.log('Data Transaksi Keluar (Grosir):', dataUntukBackend);
    alert('Transaksi keluar (grosir) berhasil disimpan!');
    
    // Reset form
    setSelectedMerkId('');
    setSelectedProdukId('');
    setSelectedPaketId('');
    setJumlahDus('1');
    setTujuan('');
  };

  return (
    <div className="form-container"> 
      <h3>Form Transaksi Sepatu Keluar (Grosir)</h3>
      
      <form onSubmit={handleSubmit}>
        
        {/* --- (5) FORMULIR BARU DENGAN 3 DROPDOWN --- */}
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

        <div className="form-group">
          <label htmlFor="produk">Pilih Produk</label>
          <select
            id="produk"
            value={selectedProdukId}
            onChange={(e) => setSelectedProdukId(e.target.value)}
            required
            disabled={!selectedMerkId}
          >
            <option value="" disabled>-- Pilih produk --</option>
            {filteredProdukList.map(produk => (
              <option key={produk.id} value={produk.id}>
                {produk.nama} ({produk.id})
              </option>
            ))}
          </select>
        </div>

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

export default SepatuKeluar; // Pastikan nama 'default export' sesuai nama fungsi