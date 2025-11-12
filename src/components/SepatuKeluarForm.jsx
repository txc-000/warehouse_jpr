import React, { useState } from 'react';
import './TransactionForm.css'; // <-- Kita pakai ulang CSS yang sama

function SepatuKeluarForm() {
  const [kodeSepatu, setKodeSepatu] = useState('');
  const [size, setSize] = useState('');
  const [jumlah, setJumlah] = useState('1');
  const [tujuan, setTujuan] = useState(''); // <-- UBAH: dari supplier ke tujuan

  const handleSubmit = (event) => {
    event.preventDefault();
    
    console.log({ // <-- UBAH: data yang di-log
      kodeSepatu,
      size,
      jumlah,
      tujuan, 
    });
    
    alert('Transaksi keluar berhasil disimpan!');
    
    setKodeSepatu('');
    setSize('');
    setJumlah('1');
    setTujuan(''); // <-- UBAH: reset state tujuan
  };

  return (
    // Kita pakai nama class yang sama agar style-nya langsung teraplikasi
    <div className="form-container"> 
      {/* UBAH: Judul form */}
      <h3>Form Transaksi Sepatu Keluar</h3>
      
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
          {/* UBAH: Label jumlah */}
          <label htmlFor="jumlah">Jumlah Keluar</label>
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
          {/* UBAH: Label supplier menjadi tujuan */}
          <label htmlFor="tujuan">Tujuan</label>
          <input
            type="text"
            id="tujuan"
            placeholder="Nama customer/tujuan..."
            value={tujuan}
            onChange={(e) => setTujuan(e.target.value)}
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

export default SepatuKeluarForm;