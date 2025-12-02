import React, { useState } from 'react';
import UserModal from '../components/UserModal.jsx'; // Import modal
import './EditTransaksiPage.css'; // Pakai ulang CSS tabel

// Data dummy diperbarui dengan field 'namaStaff'
const initialData = [
  { id: 1, namaStaff: 'Budi Santoso', username: 'admin_masuk', password: '123', role: 'ADMIN BARANG MASUK' },
  { id: 2, namaStaff: 'Siti Aminah', username: 'admin_keluar', password: '123', role: 'ADMIN BARANG KELUAR' },
  { id: 3, namaStaff: 'Pak Bos', username: 'pemilik', password: '123', role: 'PEMILIK' },
];

function KelolaUserPage() {
  const [daftarUser, setDaftarUser] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Data untuk edit

  // Fungsi untuk BUKA modal (mode TAMBAH)
  const handleTambah = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  // Fungsi untuk BUKA modal (mode EDIT)
  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  // Fungsi untuk TUTUP modal
  const handleClose = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  // Fungsi untuk SIMPAN (bisa tambah/edit)
  const handleSave = (data) => {
    // Pastikan data yang dikirim dari modal memiliki properti namaStaff, username, password, role
    if (currentUser) {
      // Logic EDIT
      setDaftarUser(prev =>
        prev.map(item => (item.id === currentUser.id ? { ...data, id: item.id } : item))
      );
    } else {
      // Logic TAMBAH
      const newId = daftarUser.length > 0 ? daftarUser[daftarUser.length - 1].id + 1 : 1;
      setDaftarUser(prev => [...prev, { ...data, id: newId }]);
    }
    handleClose();
  };

  // Fungsi untuk HAPUS
  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus user ini?')) {
      setDaftarUser(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Kelola Akses User</h1>
        <p>Tambah, edit, atau hapus user yang dapat mengakses sistem.</p>
      </header>

      <button className="button-tambah" onClick={handleTambah}>
        + Tambah User
      </button>

      <div className="tabel-container-full">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Staff</th> {/* Kolom Baru */}
              <th>Username</th>
              <th>Password</th>   {/* Kolom Baru */}
              <th>Role</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {daftarUser.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.namaStaff}</td> {/* Menampilkan Nama Staff */}
                <td>{item.username}</td>
                <td>{item.password}</td>   {/* Menampilkan Password */}
                <td>{item.role}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(item.id)}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tampilkan modal jika isModalOpen bernilai true */}
      {isModalOpen && (
        <UserModal
          initialData={currentUser}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default KelolaUserPage;