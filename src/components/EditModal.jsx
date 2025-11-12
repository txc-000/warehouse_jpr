import React, { useState, useEffect } from 'react';
import './EditModal.css'; // CSS untuk modal
import './TransactionForm.css'; // Pakai ulang style form

function EditModal({ transaction, onClose, onSave }) {
  // Komponen ini punya state internal untuk form
  const [formData, setFormData] = useState(transaction);

  // Update state jika prop 'transaction' berubah
  useEffect(() => {
    setFormData(transaction);
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Kirim data yang sudah di-update ke parent
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content form-container">
        <h3>Edit Transaksi Masuk</h3>
        <form onSubmit={handleSubmit}>
          {/* Form ini mirip TransactionForm, tapi kita beri 'name' */}
          <div className="form-group">
            <label htmlFor="kodeSepatu">Kode Sepatu</label>
            <input
              type="text"
              id="kodeSepatu"
              name="kodeSepatu"
              value={formData.kodeSepatu}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="size">Size</label>
            <input
              type="number"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="jumlah">Jumlah Masuk</label>
            <input
              type="number"
              id="jumlah"
              name="jumlah"
              value={formData.jumlah}
              onChange={handleChange}
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