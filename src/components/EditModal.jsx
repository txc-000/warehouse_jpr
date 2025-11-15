import React, { useState, useEffect, useMemo } from 'react';
import './EditModal.css'; // CSS untuk modal
import './TransactionForm.css'; // Pakai ulang style form

// --- (1) STRUKTUR DATA BARU (LEBIH BAIK) ---
const mockMerkList = [
  { id: 1, nama: 'Nike' },
  { id: 2, nama: 'Adidas' },
  { id: 3, nama: 'New Balance' },
];

// Produk sekarang terhubung ke Merk via 'merkId'
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

function EditModal({ transaction, onClose, onSave }) {
  const [formData, setFormData] = useState(transaction);
  // State baru untuk 'merk' yang dipilih
  const [selectedMerkId, setSelectedMerkId] = useState(null);

  // Saat modal dimuat, cari 'merkId' dari 'id_produk' yang ada
  useEffect(() => {
    setFormData(transaction);
    const produkAwal = mockProdukList.find(p => p.id === transaction.id_produk);
    if (produkAwal) {
      setSelectedMerkId(produkAwal.merkId);
    }
  }, [transaction]);

  // (2) LOGIKA DROPDOWN BERTINGKAT
  // Daftar produk akan otomatis ter-filter saat 'selectedMerkId' berubah
  const filteredProdukList = useMemo(() => {
    if (!selectedMerkId) return []; // Jika tidak ada merk, daftar produk kosong
    return mockProdukList.filter(p => p.merkId === selectedMerkId);
  }, [selectedMerkId]);

  // Handler saat dropdown MERK berubah
  const handleMerkChange = (e) => {
    const newMerkId = Number(e.target.value);
    setSelectedMerkId(newMerkId);
    // Kosongkan produk yang dipilih, karena merk-nya ganti
    setFormData(prev => ({ ...prev, id_produk: '' }));
  };

  // Handler untuk input/select lain
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // (3) LOGIKA SIMPAN (handleSubmit) DIPERBARUI
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Cari semua nama & merk berdasarkan ID yang dipilih
    const merkTerpilih = mockMerkList.find(m => m.id === selectedMerkId);
    const produkTerpilih = mockProdukList.find(p => p.id === formData.id_produk);
    const paketTerpilih = mockPaketList.find(p => p.id === Number(formData.id_paket_seri));

    const dataFinalUntukDisimpan = {
      ...formData,
      // Pastikan semua nama & merk diperbarui dengan benar
      merk: merkTerpilih ? merkTerpilih.nama : 'Merk Tidak Ditemukan',
      namaProduk: produkTerpilih ? produkTerpilih.nama : 'Produk Tidak Ditemukan',
      namaPaket: paketTerpilih ? paketTerpilih.nama : 'Paket Tidak Ditemukan',
      jumlahDus: Number(formData.jumlahDus) 
    };

    onSave(dataFinalUntukDisimpan); // Kirim data yang sudah di-update
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content form-container">
        <h3>Edit Transaksi Masuk (Grosir)</h3>
        <form onSubmit={handleSubmit}>
          
          {/* --- (4) FORMULIR BARU DENGAN 3 DROPDOWN --- */}

          <div className="form-group">
            <label htmlFor="merk">Merk</label>
            <select
              id="merk"
              name="merkId" // Ini mengontrol filter
              value={selectedMerkId || ''} // Gunakan state 'selectedMerkId'
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
            <label htmlFor="id_produk">Produk</label>
            <select
              id="id_produk"
              name="id_produk" // Ini adalah bagian dari 'formData'
              value={formData.id_produk}
              onChange={handleChange}
              required
              disabled={!selectedMerkId} // Nonaktif jika merk belum dipilih
            >
              <option value="" disabled>-- Pilih Produk --</option>
              {filteredProdukList.map(produk => (
                <option key={produk.id} value={produk.id}>
                  {produk.nama} ({produk.id})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="id_paket_seri">Paket Seri</label>
            <select
              id="id_paket_seri"
              name="id_paket_seri"
              value={formData.id_paket_seri}
              onChange={handleChange}
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
            <label htmlFor="jumlahDus">Jumlah Dus Masuk</label>
            <input
              type="number"
              id="jumlahDus"
              name="jumlahDus"
              value={formData.jumlahDus}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="supplier">Supplier</label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
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