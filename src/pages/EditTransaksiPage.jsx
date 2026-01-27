import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient'; 
import EditModal from '../components/EditModal.jsx'; // Pastikan komponen ini ada
import './EditTransaksiPage.css'; 
import './Dashboard.css'; 

function EditTransaksiPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. FETCH DATA (Supabase)
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transaksi_masuk')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  };

  // 2. HANDLER MODAL
  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // 3. UPDATE DATA (Supabase)
  const handleSave = async (updatedData) => {
    try {
      const { error } = await supabase
        .from('transaksi_masuk')
        .update({ 
          jumlah_dus: updatedData.jumlah_dus, 
          supplier: updatedData.supplier 
        })
        .eq('id', updatedData.id);

      if (error) throw error;

      alert("Data berhasil diperbarui!");
      
      // Update state lokal agar UI langsung berubah
      setTransactions(prev =>
        prev.map(t => (t.id === updatedData.id ? { ...t, ...updatedData } : t))
      );
      handleClose();

    } catch (error) {
      alert("Gagal update: " + error.message);
    }
  };

  // 4. DELETE DATA (Supabase)
  const handleDelete = async (id) => {
    if (window.confirm('⚠️ Yakin hapus riwayat ini? Stok gudang tidak akan berubah otomatis.')) {
      try {
        const { error } = await supabase
          .from('transaksi_masuk')
          .delete()
          .eq('id', id);

        if (error) throw error;

        alert("Data transaksi dihapus.");
        setTransactions(prev => prev.filter(t => t.id !== id));

      } catch (error) {
        alert("Gagal hapus: " + error.message);
      }
    }
  };

  // Filter Pencarian
  const filteredTransactions = useMemo(() => {
    return transactions.filter(item => {
      const term = searchTerm.toLowerCase();
      return (
        item.kode_barang?.toLowerCase().includes(term) || 
        item.nama_produk?.toLowerCase().includes(term) ||
        item.merk?.toLowerCase().includes(term) ||
        item.supplier?.toLowerCase().includes(term)
      );
    });
  }, [transactions, searchTerm]);

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Edit Transaksi Masuk</h1>
        <p>Kelola data riwayat barang masuk.</p>
      </header>

      <div className="filter-container" style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="🔍 Cari ID, merk, atau supplier..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', maxWidth: '400px' }}
        />
      </div>

      <div className="tabel-container-full">
        {loading ? <p>Memuat data...</p> : (
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Merk</th>
                <th>Produk</th>
                <th>Jml Dus</th>
                <th>Supplier</th>
                <th style={{textAlign:'center'}}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(item => (
                  <tr key={item.id}>
                    <td style={{fontFamily:'monospace', fontWeight:'bold'}}>{item.kode_barang}</td>
                    <td>{item.merk}</td>
                    <td>{item.nama_produk}</td>
                    <td style={{fontWeight:'bold'}}>{item.jumlah_dus}</td>
                    <td>{item.supplier}</td>
                    <td style={{textAlign:'center'}}>
                      <button 
                        onClick={() => handleEdit(item)}
                        style={{marginRight:'5px', background:'#3b82f6', color:'white', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer'}}
                      >Edit</button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        style={{background:'#ef4444', color:'white', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer'}}
                      >Hapus</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>Data tidak ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        )}
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