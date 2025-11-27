import React, { useState, useEffect } from 'react';
import './EditModal.css'; 
import './TransactionForm.css'; 

function SepatuMasterModal({ onClose, onSave, initialData }) {
  
  // HANYA Data Fisik, TIDAK ADA HARGA
  const [formData, setFormData] = useState({
    kodeSepatu: '',
    namaSepatu: '',
    brand: '',
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
    onSave(formData); 
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
              placeholder="Contoh: NK-AF1"
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

          {/* INPUT HARGA SUDAH DIHAPUS DARI SINI */}

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