import React, { useState } from 'react';
import './EditModal.css'; // Pakai ulang CSS modal
import './TransactionForm.css'; // Pakai ulang CSS form

function UserModal({ onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      namaStaff: '', // Field baru untuk Nama Staff
      username: '',
      password: '', 
      role: 'ADMIN BARANG MASUK', 
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
          
          {/* --- INPUT BARU: NAMA STAFF --- */}
          <div className="form-group">
            <label htmlFor="namaStaff">Nama Staff</label>
            <input
              type="text"
              id="namaStaff"
              name="namaStaff"
              value={formData.namaStaff || ''} // Fallback string kosong untuk menghindari error
              onChange={handleChange}
              required
              placeholder="Contoh: Budi Santoso"
            />
          </div>

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
              /* Tips: Jika ingin password terlihat saat mengetik (agar mudah bagi Pemilik), 
                 Anda bisa mengganti type="password" menjadi type="text" di bawah ini.
              */
              type="text" 
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder={isEditMode ? "Isi password" : "Password user"}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
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