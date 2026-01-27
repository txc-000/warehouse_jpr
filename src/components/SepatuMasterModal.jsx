import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Kita butuh ini untuk ambil list paket
import './EditModal.css'; 

function SepatuMasterModal({ onClose, onSave, initialData }) {
  
  const [formData, setFormData] = useState({
    kode_barang: '',
    nama_produk: '',
    merk: '',
    id_paket: '', // DATA BARU: ID Paket Seri
    stok: 0, 
    harga_dus: 0 
  });

  const [paketList, setPaketList] = useState([]); // List pilihan paket

  // Ambil Data Paket Seri buat Dropdown
  useEffect(() => {
    const fetchPaket = async () => {
      const { data } = await supabase.from('paket_seri').select('*');
      setPaketList(data || []);
    };
    fetchPaket();

    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const isEditMode = !!initialData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content form-container">
        <div className="modal-header">
            <h3>{isEditMode ? 'Edit' : 'Tambah'} Data Master Sepatu</h3>
            <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Kode Sepatu (SKU)</label>
            <input
              type="text"
              name="kode_barang"
              value={formData.kode_barang}
              onChange={handleChange}
              placeholder="Contoh: NK-AF1-001"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Brand / Merk</label>
            <input
              type="text"
              name="merk"
              value={formData.merk}
              onChange={handleChange}
              placeholder="Contoh: Nike"
              required
            />
          </div>

          <div className="form-group">
            <label>Nama Produk</label>
            <input
              type="text"
              name="nama_produk"
              value={formData.nama_produk}
              onChange={handleChange}
              placeholder="Contoh: Air Force 1 '07"
              required
            />
          </div>

          {/* --- INPUT BARU: PILIH PAKET SERI --- */}
          <div className="form-group">
            <label>Pilih Paket Ukuran (Seri)</label>
            <select
              name="id_paket"
              value={formData.id_paket || ''} // Handle kalau null
              onChange={handleChange}
              required
              style={{padding: '10px', border:'1px solid #cbd5e1', borderRadius:'6px', background:'white'}}
            >
              <option value="" disabled>-- Pilih Seri Ukuran --</option>
              {paketList.map((paket) => (
                <option key={paket.id} value={paket.id}>
                  {paket.nama_paket} (Isi {paket.total_qty} psg)
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="button-cancel" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="submit-button">
              {isEditMode ? 'Update Data' : 'Simpan Baru'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SepatuMasterModal;