import React, { useState } from 'react';
import './UkuranSepatu.css'; // Kita akan buat file CSS ini
import './TransactionForm.css'; // Kita pakai ulang style form

function UkuranSepatu() {
  const [ukuranBaru, setUkuranBaru] = useState('');
  
  // Data dummy untuk tabel, di aplikasi nyata ini akan datang dari state/API
  const [daftarUkuran, setDaftarUkuran] = useState([
    { id: 1, size: '39' },
    { id: 2, size: '40' },
    { id: 3, size: '41' },
    { id: 4, size: '42' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ukuranBaru) return; // Jangan tambah jika kosong
    
    // Logika dummy untuk menambah ke list
    const newId = daftarUkuran.length + 1;
    setDaftarUkuran([...daftarUkuran, { id: newId, size: ukuranBaru }]);
    console.log('Ukuran baru ditambahkan:', ukuranBaru);
    setUkuranBaru(''); // Reset form
  };

  return (
    <div className="ukuran-layout">
      {/* Kolom 1: Form Tambah Ukuran (pakai style yg ada) */}
      <div className="form-container">
        <h3>Tambah Master Ukuran</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="ukuranBaru">Ukuran Sepatu Baru</label>
            <input
              type="text"
              id="ukuranBaru"
              placeholder="Contoh: 45"
              value={ukuranBaru}
              onChange={(e) => setUkuranBaru(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Tambah Ukuran
          </button>
        </form>
      </div>

      {/* Kolom 2: Tabel Daftar Ukuran */}
      <div className="tabel-container">
        <h3>Daftar Ukuran Tersedia</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ukuran</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {daftarUkuran.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.size}</td>
                <td>
                  <button className="delete-button">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UkuranSepatu;