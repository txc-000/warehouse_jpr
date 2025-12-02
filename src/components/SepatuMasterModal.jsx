import React, { useState, useEffect } from 'react';
import './EditModal.css'; 
import './TransactionForm.css'; 

function SepatuMasterModal({ onClose, onSave, initialData }) {
  
  // State form
  const [formData, setFormData] = useState({
    kodeSepatu: '',
    namaSepatu: '',
    brand: '',
    harga: 0, // Default 0, biar tidak error di database/state utama
  });

  useEffect(() => {
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
    // Kita kirim data apa adanya. 
    // Jika data baru, harga otomatis 0. 
    // Jika edit data lama, harga lama tetap terbawa (hidden) tidak hilang.
    onSave(formData); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content form-container">
        <h3>{isEditMode ? 'Edit' : 'Tambah'} Data Master Sepatu</h3>
        <p style={{fontSize: '0.85rem', color: '#666', marginBottom: '20px'}}>
          Masukkan data fisik sepatu. Harga diatur terpisah oleh Pemilik.
        </p>
        
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="kodeSepatu">Kode Sepatu (SKU)</label>
            <input
              type="text"
              id="kodeSepatu"
              name="kodeSepatu"
              value={formData.kodeSepatu}
              onChange={handleChange}
              placeholder="Contoh: NK-AF1-001"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="namaSepatu">Nama Sepatu</label>
            <input
              type="text"
              id="namaSepatu"
              name="namaSepatu"
              value={formData.namaSepatu}
              onChange={handleChange}
              placeholder="Contoh: Air Force 1 '07"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Contoh: Nike"
              required
            />
          </div>

          {/* INPUT HARGA DIHAPUS TOTAL DARI SINI */}

          <div className="modal-actions">
            <button type="button" className="button-cancel" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="submit-button">
              Simpan Data Master
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SepatuMasterModal;