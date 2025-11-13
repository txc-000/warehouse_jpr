import React, { useState, useEffect } from 'react';
import './EditModal.css'; // CSS untuk modal
import './TransactionForm.css'; // Pakai ulang style form

// --- DATA CONTOH (DUMMY) ---
// Kita perlukan ini untuk mengisi pilihan di dropdown
// 1. Daftar Produk
const mockProdukList = [
  { id: 'SKU-001', nama: 'Sepatu Lari Model X' },
  { id: 'SKU-002', nama: 'Sandal Model Y' },
  { id: 'SKU-003', nama: 'Sepatu Kantor Pria' },
];

// 2. Daftar Paket
const mockPaketList = [
  { id: 1, nama: 'Seri 38-42 (Isi 12)' },
  { id: 2, nama: 'Seri 39-43 (Isi 12)' },
  { id: 3, nama: 'Seri Anak A (Isi 20)' },
];

function EditModal({ transaction, onClose, onSave }) {
  const [formData, setFormData] = useState(transaction);

  useEffect(() => {
    setFormData(transaction);
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Di sini, kita perlu mencocokkan kembali nama produk & paket berdasarkan ID
    // sebelum menyimpan, agar tampilan di tabel ikut update.
    
    const produkTerpilih = mockProdukList.find(p => p.id === formData.id_produk);
    const paketTerpilih = mockPaketList.find(p => p.id === Number(formData.id_paket_seri));

    const dataFinalUntukDisimpan = {
      ...formData,
      namaProduk: produkTerpilih ? produkTerpilih.nama : 'Produk Tidak Ditemukan',
      namaPaket: paketTerpilih ? paketTerpilih.nama : 'Paket Tidak Ditemukan',
      // pastikan jumlahDus adalah angka
      jumlahDus: Number(formData.jumlahDus) 
    };

    onSave(dataFinalUntukDisimpan); // Kirim data yang sudah di-update ke parent
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content form-container">
        <h3>Edit Transaksi Masuk (Grosir)</h3>
        <form onSubmit={handleSubmit}>
          
          {/* --- FORMULIR YANG SUDAH DIGANTI --- */}

          <div className="form-group">
            <label htmlFor="id_produk">Produk</label>
            <select
              id="id_produk"
              name="id_produk"
              value={formData.id_produk}
              onChange={handleChange}
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