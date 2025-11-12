import React, { useState } from 'react';
import './EditModal.css'; // Pakai ulang CSS modal
import './TransactionForm.css'; // Pakai ulang CSS form

function UserModal({ onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      username: '',
      password: '', // Di aplikasi nyata, jangan pernah tampilkan/edit password seperti ini
      role: 'ADMIN BARANG MASUK', // Default role
    }
  );

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
        <h3>{isEditMode ? 'Edit' : 'Tambah'} User Baru</h3>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder={isEditMode ? "Isi untuk mengubah" : ""}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            {/* Ganti ke input biasa jika ingin lebih simpel */}
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', borderRadius: '6px', border: '1px solid #ccc' }}
            >
              <option value="ADMIN BARANG MASUK">ADMIN BARANG MASUK</option>
              <option value="ADMIN BARANG KELUAR">ADMIN BARANG KELUAR</option>
              <option value="PEMILIK">PEMILIK</option>
            </select>
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

export default UserModal;