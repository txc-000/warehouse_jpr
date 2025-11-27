import React, { useState } from 'react';
import SepatuMasterModal from '../components/SepatuMasterModal.jsx'; 
import './EditTransaksiPage.css'; 

// --- SAKLAR ROLE (UNTUK SIMULASI) ---
// Ganti ke 'admin_masuk' untuk mengetes input terkunci
// Ganti ke 'pemilik' untuk mengetes input terbuka
const currentUserRole = 'pemilik'; 
// ------------------------------------

// Data Dummy
const initialData = [
  { id: 1, kodeSepatu: 'AF1-001', namaSepatu: 'Air Force 1 \'07', brand: 'Nike', harga: 1500000 },
  { id: 2, kodeSepatu: 'ADS-SMBA', namaSepatu: 'Samba OG', brand: 'Adidas', harga: 1850000 },
  { id: 3, kodeSepatu: 'NB-550', namaSepatu: '550', brand: 'New Balance', harga: 1799000 },
];

function SepatuMasterPage() {
  const [sepatuList, setSepatuList] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSepatu, setSelectedSepatu] = useState(null);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(angka);
  };

  const handleTambah = () => {
    setSelectedSepatu(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sepatu) => {
    setSelectedSepatu(sepatu);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    // Hanya pemilik yang boleh menghapus data master (Opsional, tambahan keamanan)
    if (currentUserRole !== 'pemilik') {
      alert('Akses Ditolak: Hanya Pemilik yang dapat menghapus data master.');
      return;
    }
    if (window.confirm('Yakin hapus data ini?')) {
      setSepatuList(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSepatu(null);
  };

  const handleSaveData = (formData) => {
    if (selectedSepatu) {
      setSepatuList(prev => prev.map(item => 
        item.id === selectedSepatu.id ? { ...formData, id: item.id } : item
      ));
    } else {
      const newId = sepatuList.length + 1;
      setSepatuList(prev => [...prev, { ...formData, id: newId }]);
    }
    handleCloseModal();
  };

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Pengelolaan Data Sepatu Master</h1>
        <p>Kelola data induk sepatu. {currentUserRole === 'pemilik' ? <strong>(Mode Pemilik: Full Akses)</strong> : '(Mode Admin: Harga View-Only)'}</p>
      </header>

      <button className="button-cetak" onClick={handleTambah} style={{ marginBottom: '20px' }}>
        + Tambah Sepatu Master
      </button>

      <div className="tabel-container-full">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Kode Sepatu (SKU)</th>
              <th>Nama Sepatu</th>
              <th>Brand</th>
              <th>Harga (Display)</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sepatuList.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.kodeSepatu}</td>
                <td>{item.namaSepatu}</td>
                <td>{item.brand}</td>
                <td style={{ fontWeight: 'bold', color: '#28a745' }}>
                  {formatRupiah(item.harga)}
                </td>
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

      {isModalOpen && (
        <SepatuMasterModal 
          onClose={handleCloseModal}
          onSave={handleSaveData}
          initialData={selectedSepatu}
          userRole={currentUserRole} // <-- KITA KIRIM ROLE KE MODAL
        />
      )}
    </div>
  );
}

export default SepatuMasterPage;