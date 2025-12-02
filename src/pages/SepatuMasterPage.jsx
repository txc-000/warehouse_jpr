import React, { useState, useMemo } from 'react';
import SepatuMasterModal from '../components/SepatuMasterModal.jsx'; 
import './EditTransaksiPage.css'; // Style tabel
import './Dashboard.css'; // Style search bar

// --- SAKLAR ROLE (UNTUK SIMULASI) ---
const currentUserRole = 'pemilik'; 
// ------------------------------------

// Data Dummy (Pastikan ada properti kode/kodeSepatu)
const initialData = [
  { id: 1, kodeSepatu: 'AF1-001', namaSepatu: 'Air Force 1 \'07', brand: 'Nike', harga: 1500000 },
  { id: 2, kodeSepatu: 'ADS-SMBA', namaSepatu: 'Samba OG', brand: 'Adidas', harga: 1850000 },
  { id: 3, kodeSepatu: 'NB-550', namaSepatu: '550', brand: 'New Balance', harga: 1799000 },
];

function SepatuMasterPage() {
  const [sepatuList, setSepatuList] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSepatu, setSelectedSepatu] = useState(null);
  
  // State untuk pencarian
  const [searchTerm, setSearchTerm] = useState('');

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
      const newId = sepatuList.length > 0 ? sepatuList[sepatuList.length - 1].id + 1 : 1;
      setSepatuList(prev => [...prev, { ...formData, id: newId }]);
    }
    handleCloseModal();
  };

  // --- LOGIC PENCARIAN ---
  const filteredData = useMemo(() => {
    return sepatuList.filter(item => {
      const term = searchTerm.toLowerCase();
      return (
        item.namaSepatu.toLowerCase().includes(term) ||
        item.brand.toLowerCase().includes(term) ||
        item.kodeSepatu.toLowerCase().includes(term)
      );
    });
  }, [sepatuList, searchTerm]);

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Pengelolaan Data Sepatu Master</h1>
        <p>Kelola data induk sepatu. {currentUserRole === 'pemilik' ? <strong>(Mode Pemilik: Full Akses)</strong> : '(Mode Admin: Harga View-Only)'}</p>
      </header>

      {/* --- FILTER & TOMBOL TAMBAH --- */}
      <div className="filter-container" style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        
        {/* Tombol Tambah */}
        <button className="button-cetak" onClick={handleTambah} style={{ margin: 0 }}>
          + Tambah Sepatu Master
        </button>

        {/* Input Pencarian */}
        <input 
          type="text" 
          placeholder="🔍 Cari ID, nama sepatu, atau brand..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{ 
            padding: '10px 15px', 
            borderRadius: '8px', 
            border: '1px solid #ddd', 
            flex: 1, 
            minWidth: '250px' 
          }}
        />
      </div>

      <div className="tabel-container-full">
        <table>
          <thead>
            <tr>
              <th>ID Barang</th> {/* KONSISTENSI NAMA KOLOM */}
              <th>Nama Sepatu</th>
              <th>Brand</th>
              <th>Harga (Display)</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(item => (
                <tr key={item.id}>
                  {/* ID BARANG (Style Monospace) */}
                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#555' }}>
                    {item.kodeSepatu}
                  </td>
                  
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
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                  Data sepatu tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <SepatuMasterModal 
          onClose={handleCloseModal}
          onSave={handleSaveData}
          initialData={selectedSepatu}
          userRole={currentUserRole} 
        />
      )}
    </div>
  );
}

export default SepatuMasterPage;