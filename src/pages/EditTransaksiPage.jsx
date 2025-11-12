import React, { useState } from 'react';
import EditModal from '../components/EditModal.jsx'; // Import modal
import './EditTransaksiPage.css'; // CSS untuk tabel di halaman ini

// Data dummy (di aplikasi nyata, ini datang dari API)
const initialData = [
  { id: 1, kodeSepatu: 'SKU-001', size: 42, jumlah: 10, supplier: 'Supplier A' },
  { id: 2, kodeSepatu: 'SKU-002', size: 40, jumlah: 5, supplier: 'Supplier B' },
  { id: 3, kodeSepatu: 'SKU-001', size: 41, jumlah: 8, supplier: 'Supplier A' },
];

function EditTransaksiPage() {
  const [transactions, setTransactions] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Fungsi untuk membuka modal dan set data
  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // Fungsi untuk menyimpan perubahan
  const handleSave = (updatedData) => {
    setTransactions(prev =>
      prev.map(t => (t.id === updatedData.id ? updatedData : t))
    );
    handleClose(); // Tutup modal setelah save
  };

  // Fungsi untuk menghapus
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
          <thead>
            <tr>
              <th>ID</th>
              <th>Kode Sepatu</th>
              <th>Size</th>
              <th>Jumlah</th>
              <th>Supplier</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.kodeSepatu}</td>
                <td>{item.size}</td>
                <td>{item.jumlah}</td>
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

      {/* Tampilkan modal jika isModalOpen bernilai true */}
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
