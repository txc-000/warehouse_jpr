import React, { useState } from 'react';
import EditModal from '../components/EditModal.jsx'; // Import modal
import './EditTransaksiPage.css'; // CSS untuk tabel di halaman ini

// --- DATA DUMMY (VERSI GROSIR + MERK) ---
const initialData = [
  { 
    id: 1, 
    id_produk: 'SKU-001',
    merk: 'Nike', // <-- MERK DITAMBAHKAN
    namaProduk: 'Sepatu Lari Model X', 
    id_paket_seri: 1,
    namaPaket: 'Seri 38-42 (Isi 12)', 
    jumlahDus: 10, 
    supplier: 'Supplier A' 
  },
  { 
    id: 2, 
    id_produk: 'SKU-002',
    merk: 'Adidas', // <-- MERK DITAMBAHKAN
    namaProduk: 'Sandal Model Y', 
    id_paket_seri: 3,
    namaPaket: 'Seri Anak A (Isi 20)', 
    jumlahDus: 5, 
    supplier: 'Supplier B' 
  },
  { 
    id: 3, 
    id_produk: 'SKU-001',
    merk: 'Nike', // <-- MERK DITAMBAHKAN
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

  // Fungsi-fungsi ini (handleEdit, handleClose) sudah benar
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

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Edit Transaksi Barang Masuk</h1>
        <p>Kelola dan perbarui data transaksi yang sudah masuk.</p>
      </header>

      <div className="tabel-container-full">
        <table>
          {/* --- HEADER TABEL (DIUBAH) --- */}
          <thead>
            <tr>
              <th>ID</th>
              <th>Merk</th> {/* <-- MERK DITAMBAHKAN */}
              <th>Nama Produk</th>
              <th>Paket Seri</th>
              <th>Jumlah Dus</th>
              <th>Supplier</th>
              <th>Aksi</th>
            </tr>
          </thead>
          {/* --- ISI TABEL (DIUBAH) --- */}
          <tbody>
            {transactions.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.merk}</td> {/* <-- MERK DITAMBAHKAN */}
                <td>{item.namaProduk}</td>
                <td>{item.namaPaket}</td>
                <td>{item.jumlahDus}</td>
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
            ))}
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