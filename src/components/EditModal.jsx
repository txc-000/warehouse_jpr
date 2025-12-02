import React, { useState, useEffect, useMemo } from 'react';
import './EditModal.css'; 
import './TransactionForm.css'; 

// --- (1) DATA MOCK (SAMA DENGAN TRANSACTION FORM) ---
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
// --- BATAS DATA BARU ---

function EditModal({ transaction, onClose, onSave }) {
  // Kita simpan ID internal untuk logika dropdown
  const [selectedMerkId, setSelectedMerkId] = useState('');
  const [selectedProdukId, setSelectedProdukId] = useState(''); // Mengontrol Kode & Nama
  const [selectedPaketId, setSelectedPaketId] = useState('');
  
  // State untuk field bebas
  const [jumlahDus, setJumlahDus] = useState(0);
  const [supplier, setSupplier] = useState('');

  // --- (2) SAAT MODAL DIBUKA: ISI FORM DENGAN DATA LAMA ---
  useEffect(() => {
    if (transaction) {
      // 1. Cari Produk berdasarkan KODE yang ada di data transaksi
      const produkAwal = mockProdukList.find(p => p.kode === transaction.kode);
      
      if (produkAwal) {
        setSelectedMerkId(produkAwal.merkId); // Set Merk otomatis
        setSelectedProdukId(produkAwal.id);   // Set Produk otomatis
      } else {
        // Fallback jika produk tidak ada di mock (misal data lama sekali)
        setSelectedMerkId('');
        setSelectedProdukId('');
      }

      // 2. Cari Paket berdasarkan Nama Paket (karena di tabel kita simpan nama)
      // Idealnya simpan ID, tapi untuk simulasi kita cari balik lewat nama
      const paketAwal = mockPaketList.find(p => p.nama === transaction.namaPaket);
      if (paketAwal) setSelectedPaketId(paketAwal.id);

      // 3. Set field lain
      setJumlahDus(transaction.jumlahDus);
      setSupplier(transaction.supplier);
    }
  }, [transaction]);

  // --- (3) LOGIKA FILTER PRODUK ---
  const filteredProdukList = useMemo(() => {
    if (!selectedMerkId) return [];
    return mockProdukList.filter(p => p.merkId === Number(selectedMerkId));
  }, [selectedMerkId]);

  // Handler saat Merk berubah
  const handleMerkChange = (e) => {
    setSelectedMerkId(e.target.value);
    setSelectedProdukId(''); // Reset produk karena merk berubah
  };

  // --- (4) SIMPAN PERUBAHAN ---
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ambil data object lengkap dari ID
    const merkObj = mockMerkList.find(m => m.id === Number(selectedMerkId));
    const produkObj = mockProdukList.find(p => p.id === Number(selectedProdukId));
    const paketObj = mockPaketList.find(p => p.id === Number(selectedPaketId));

    const updatedData = {
      ...transaction, // Pertahankan ID asli transaksi
      kode: produkObj ? produkObj.kode : transaction.kode,
      merk: merkObj ? merkObj.nama : transaction.merk,
      namaProduk: produkObj ? produkObj.nama : transaction.namaProduk,
      namaPaket: paketObj ? paketObj.nama : transaction.namaPaket,
      id_paket_seri: paketObj ? paketObj.id : transaction.id_paket_seri, // Update ID paket juga
      jumlahDus: Number(jumlahDus),
      supplier: supplier
    };

    onSave(updatedData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content form-container">
        <h3>Edit Transaksi Masuk</h3>
        <form onSubmit={handleSubmit}>
          
          {/* 1. MERK */}
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
          
          {/* 2. KODE BARANG (SKU) */}
          <div className="form-group">
            <label htmlFor="kode">Kode Barang (SKU)</label>
            <select
              id="kode"
              value={selectedProdukId}
              onChange={(e) => setSelectedProdukId(e.target.value)}
              required
              disabled={!selectedMerkId}
              style={{ fontFamily: 'monospace', fontWeight: 'bold' }}
            >
              <option value="" disabled>-- Pilih Kode --</option>
              {filteredProdukList.map(produk => (
                <option key={produk.id} value={produk.id}>
                  {produk.kode}
                </option>
              ))}
            </select>
          </div>

          {/* 3. NAMA PRODUK (SINKRON) */}
          <div className="form-group">
            <label htmlFor="namaProduk">Nama Produk</label>
            <select
              id="namaProduk"
              value={selectedProdukId} // Value sama dengan Kode (Sinkron)
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
            <label htmlFor="paketSeri">Paket Seri</label>
            <select
              id="paketSeri"
              value={selectedPaketId}
              onChange={(e) => setSelectedPaketId(e.target.value)}
              required
            >
              <option value="" disabled>-- Pilih Paket --</option>
              {mockPaketList.map(paket => (
                <option key={paket.id} value={paket.id}>
                  {paket.nama}
                </option>
              ))}
            </select>
          </div>

          {/* 5. JUMLAH DUS */}
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

          {/* 6. SUPPLIER */}
          <div className="form-group">
            <label htmlFor="supplier">Supplier</label>
            <input
              type="text"
              id="supplier"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="button-cancel" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="submit-button">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;