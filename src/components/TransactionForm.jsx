import React, { useState } from 'react';
import './TransactionForm.css';

function TransactionForm() {
  // Menggunakan state untuk mengelola nilai input (controlled components)
  const [kodeSepatu, setKodeSepatu] = useState('');
  const [size, setSize] = useState('');
  const [jumlah, setJumlah] = useState('1');
  const [supplier, setSupplier] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Mencegah form submit me-refresh halaman
    
    // Di aplikasi nyata, data ini akan dikirim ke API
    console.log({
      kodeSepatu,
      size,
      jumlah,
      supplier,
    });
    
    alert('Transaksi berhasil disimpan!');
    // Opsional: reset form
    setKodeSepatu('');
    setSize('');
    setJumlah('1');
    setSupplier('');
  };

  return (
    <div className="form-container">
      <h3>Form Transaksi Sepatu Masuk</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="kodeSepatu">Kode Sepatu</label>
          <input
            type="text"
            id="kodeSepatu"
            placeholder="Masukkan kode sepatu..."
            value={kodeSepatu}
            onChange={(e) => setKodeSepatu(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="size">Size</label>
          <input
            type="number"
            id="size"
            placeholder="Contoh: 42"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="jumlah">Jumlah Masuk</label>
          <input
            type="number"
            id="jumlah"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="supplier">Supplier</label>
          <input
            type="text"
            id="supplier"
            placeholder="Nama supplier..."
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Simpan Transaksi
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;