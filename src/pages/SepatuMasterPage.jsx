import React, { useState } from 'react';
import SepatuMasterModal from '../components/SepatuMasterModal.jsx'; // Import modal
import './EditTransaksiPage.css'; // Pakai ulang CSS tabel dari halaman edit

// Data dummy (nantinya dari API)
const initialData = [
  { id: 1, kodeSepatu: 'AF1-001', namaSepatu: 'Air Force 1 \'07', brand: 'Nike' },
  { id: 2, kodeSepatu: 'ADS-SMBA', namaSepatu: 'Samba OG', brand: 'Adidas' },
  { id: 3, kodeSepatu: 'NB-550', namaSepatu: '550', brand: 'New Balance' },
];

function SepatuMasterPage() {
  const [daftarSepatu, setDaftarSepatu] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSepatu, setCurrentSepatu] = useState(null); // Data untuk edit

  // Fungsi untuk BUKA modal (mode TAMBAH)
  const handleTambah = () => {
    setCurrentSepatu(null); // Kosongkan data
    setIsModalOpen(true);
  };

  // Fungsi untuk BUKA modal (mode EDIT)
  const handleEdit = (sepatu) => {
    setCurrentSepatu(sepatu); // Isi data
    setIsModalOpen(true);
  };

  // Fungsi untuk TUTUP modal
  const handleClose = () => {
    setIsModalOpen(false);
    setCurrentSepatu(null);
  };

  // Fungsi untuk SIMPAN (bisa tambah/edit)
  const handleSave = (data) => {
    if (currentSepatu) {
      // Logic EDIT
      setDaftarSepatu(prev =>
        prev.map(item => (item.id === currentSepatu.id ? { ...data, id: item.id } : item))
      );
    } else {
      // Logic TAMBAH
      const newId = daftarSepatu.length + 1; // (dummy ID)
      setDaftarSepatu(prev => [...prev, { ...data, id: newId }]);
    }
    handleClose(); // Tutup modal
  };

  // Fungsi untuk HAPUS
  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus sepatu master ini?')) {
      setDaftarSepatu(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Pengelolaan Data Sepatu Master</h1>
        <p>Kelola data induk untuk semua jenis sepatu.</p>
      </header>

      {/* Tombol Tambah di atas tabel */}
      <button className="button-tambah" onClick={handleTambah}>
        + Tambah Sepatu Master
      </button>

      {/* Kita pakai ulang class CSS dari halaman edit */}
      <div className="tabel-container-full">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Kode Sepatu (SKU)</th>
              <th>Nama Sepatu</th>
              <th>Brand</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {daftarSepatu.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.kodeSepatu}</td>
                <td>{item.namaSepatu}</td>
                <td>{item.brand}</td>
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
        <SepatuMasterModal
          initialData={currentSepatu}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default SepatuMasterPage;