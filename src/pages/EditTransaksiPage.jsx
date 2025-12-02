import React, { useState, useMemo } from 'react';
import EditModal from '../components/EditModal.jsx'; 
import './EditTransaksiPage.css'; 
import './Dashboard.css'; // Import CSS Dashboard untuk Search Bar

// --- DATA DUMMY (DISESUAIKAN DENGAN FORMAT BARU) ---
const initialData = [
  { 
    id: 1, 
    kode: 'NK-RUN-005', // ID Barang
    merk: 'Nike', 
    namaProduk: 'Sepatu Lari Model X', 
    id_paket_seri: 1,
    namaPaket: 'Seri 38-42 (Isi 12)', 
    jumlahDus: 10, 
    supplier: 'Supplier A' 
  },
  { 
    id: 2, 
    kode: 'AD-SDL-006',
    merk: 'Adidas', 
    namaProduk: 'Sandal Model Y', 
    id_paket_seri: 3,
    namaPaket: 'Seri Anak A (Isi 20)', 
    jumlahDus: 5, 
    supplier: 'Supplier B' 
  },
  { 
    id: 3, 
    kode: 'NK-RUN-005',
    merk: 'Nike', 
    namaProduk: 'Sepatu Lari Model X', 
    id_paket_seri: 2,
    namaPaket: 'Seri 39-43 (Isi 12)', 
    jumlahDus: 8, 
    supplier: 'Supplier A' 
  },
];

function EditTransaksiPage() {
  const [transactions, setTransactions] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  // State Pencarian
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleSave = (updatedData) => {
    setTransactions(prev =>
      prev.map(t => (t.id === updatedData.id ? updatedData : t))
    );
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  // --- LOGIC PENCARIAN ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter(item => {
      const term = searchTerm.toLowerCase();
      return (
        item.kode.toLowerCase().includes(term) || // Cari ID Barang
        item.namaProduk.toLowerCase().includes(term) ||
        item.merk.toLowerCase().includes(term) ||
        item.supplier.toLowerCase().includes(term)
      );
    });
  }, [transactions, searchTerm]);

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Edit Transaksi Barang Masuk</h1>
        <p>Kelola dan perbarui data transaksi yang sudah masuk.</p>
      </header>

      {/* --- FITUR PENCARIAN --- */}
      <div className="filter-container" style={{ display: 'flex', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="🔍 Cari ID barang, merk, produk, atau supplier..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{ 
            padding: '12px 15px', 
            borderRadius: '8px', 
            border: '1px solid #ddd', 
            width: '100%',
            maxWidth: '500px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
        />
      </div>

      <div className="tabel-container-full">
        <table>
          <thead>
            <tr>
              <th>ID Barang</th> {/* KOLOM BARU */}
              <th>Merk</th>
              <th>Nama Produk</th>
              <th>Paket Seri</th>
              <th>Jumlah Dus</th>
              <th>Supplier</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(item => (
                <tr key={item.id}>
                  
                  {/* ID Barang (Monospace) */}
                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#555' }}>
                    {item.kode}
                  </td>

                  <td>{item.merk}</td>
                  <td>{item.namaProduk}</td>
                  <td>{item.namaPaket}</td>
                  <td style={{ fontWeight: 'bold' }}>{item.jumlahDus}</td>
                  <td>{item.supplier}</td>
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
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                  Data transaksi tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <EditModal
          transaction={selectedTransaction}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default EditTransaksiPage;