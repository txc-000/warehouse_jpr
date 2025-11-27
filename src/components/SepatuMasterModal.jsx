import React, { useState, useEffect } from 'react';
import './EditModal.css'; 
import './TransactionForm.css'; 

// Terima prop 'userRole'
function SepatuMasterModal({ onClose, onSave, initialData, userRole }) {
  
  const [formData, setFormData] = useState({
    kodeSepatu: '',
    namaSepatu: '',
    brand: '',
    harga: 0, // Default 0 jika admin yang input
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const isEditMode = !!initialData;
  const isPemilik = userRole === 'pemilik'; // Cek apakah Pemilik

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      harga: Number(formData.harga)
    }); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content form-container">
        <h3>{isEditMode ? 'Edit' : 'Tambah'} Data Master Sepatu</h3>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="kodeSepatu">Kode Sepatu (SKU)</label>
            <input
              type="text"
              id="kodeSepatu"
              name="kodeSepatu"
              value={formData.kodeSepatu}
              onChange={handleChange}
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
              required
            />
          </div>

          {/* --- LOGIKA PENGUNCIAN HARGA --- */}
          <div className="form-group">
            <label htmlFor="harga">
              Harga Referensi {isPemilik ? '' : '(Terkunci)'}
            </label>
            
            <input
              type="number"
              id="harga"
              name="harga"
              value={formData.harga}
              onChange={handleChange}
              min="0"
              // KUNCI INPUT JIKA BUKAN PEMILIK
              disabled={!isPemilik} 
              // Beri warna abu-abu jika terkunci agar jelas visualnya
              style={!isPemilik ? { backgroundColor: '#f3f4f6', cursor: 'not-allowed', color: '#9ca3af' } : {}}
              placeholder={isPemilik ? "Masukkan harga..." : "Menunggu input Pemilik"}
            />
            
            {/* Pesan Penjelasan */}
            <small style={{ color: isPemilik ? '#28a745' : '#d9534f', marginTop: '5px', display: 'block', fontWeight: '500' }}>
              {isPemilik 
                ? '✓ Anda Login sebagai Pemilik. Silakan input harga.' 
                : '🔒 Hanya Pemilik yang dapat mengubah/menyetujui harga.'}
            </small>
          </div>

          <div className="modal-actions">
            <button type="button" className="button-cancel" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="submit-button">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SepatuMasterModal;