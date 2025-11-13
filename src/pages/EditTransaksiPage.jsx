import React, { useState } from 'react';
import EditModal from '../components/EditModal.jsx'; // Import modal
import './EditTransaksiPage.css'; // CSS untuk tabel di halaman ini

// --- DATA DUMMY (VERSI GROSIR) ---
// Data ini sekarang mencerminkan alur bisnis baru kita.
const initialData = [
  { 
    id: 1, 
    namaProduk: 'Sepatu Lari Model X', 
    namaPaket: 'Seri 38-42 (Isi 12)', 
    jumlahDus: 10, 
    supplier: 'Supplier A' 
  },
  { 
    id: 2, 
    namaProduk: 'Sandal Model Y', 
    namaPaket: 'Seri Anak A (Isi 20)', 
    jumlahDus: 5, 
    supplier: 'Supplier B' 
  },
  { 
    id: 3, 
    namaProduk: 'Sepatu Lari Model X', 
    namaPaket: 'Seri 39-43 (Isi 12)', 
    jumlahDus: 8, 
    supplier: 'Supplier A' 
  },
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
    // Logika ini tetap sama, hanya saja 'updatedData'-nya punya struktur baru
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
          {/* --- HEADER TABEL (DIUBAH) --- */}
          <thead>
            <tr>
              <th>ID</th>
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

      {/* Tampilkan modal jika isModalOpen bernilai true */}
      {isModalOpen && (
        <EditModal
          transaction={selectedTransaction}
          onClose={handleClose}
          onSave={handleSave}
          // Kita akan butuh file EditModal.jsx untuk diperbaiki
        />
      )}
    </div>
  );

}

export default EditTransaksiPage;