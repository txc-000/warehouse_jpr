import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './UkuranSepatu.css'; 
import './TransactionForm.css'; // PENTING: Import ini agar .form-container terbaca style-nya

function UkuranSepatu() {
  const [ukuranBaru, setUkuranBaru] = useState('');
  const [daftarUkuran, setDaftarUkuran] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Ambil Data
  useEffect(() => {
    fetchUkuran();
  }, []);

  const fetchUkuran = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('master_ukuran')
      .select('*')
      .order('id', { ascending: true }); // Mengurutkan berdasarkan ID input

    if (error) console.log("Error:", error.message);
    else setDaftarUkuran(data || []);
    
    setLoading(false);
  };

  // 2. Tambah Ukuran
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ukuranBaru) return; 

    // Cek duplikat (Case insensitive)
    const isExist = daftarUkuran.find(item => item.size.toLowerCase() === ukuranBaru.toLowerCase());
    if (isExist) {
      alert("Ukuran ini sudah ada!");
      return;
    }

    const { error } = await supabase
      .from('master_ukuran')
      .insert([{ size: ukuranBaru }]);

    if (error) {
      alert("Gagal simpan: " + error.message);
    } else {
      setUkuranBaru(''); 
      fetchUkuran(); 
    }
  };

  // 3. Hapus Ukuran
  const handleDelete = async (id) => {
    if (window.confirm("Yakin mau hapus ukuran ini?")) {
      const { error } = await supabase
        .from('master_ukuran')
        .delete()
        .eq('id', id);

      if (error) alert("Gagal hapus");
      else fetchUkuran();
    }
  };

  return (
    <div className="ukuran-layout">
      
      {/* BAGIAN KIRI: FORM INPUT */}
      {/* Menggunakan class 'form-container' agar mewarisi style form yang sudah ada */}
      <div className="form-container">
        <h3>➕ Tambah Ukuran</h3>
        <p style={{fontSize:'0.9rem', color:'#666', marginBottom:'15px'}}>
          Masukkan angka ukuran sepatu.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="ukuranBaru">Ukuran / Size</label>
            <input
              type="text"
              id="ukuranBaru"
              placeholder="Contoh: 42"
              value={ukuranBaru}
              onChange={(e) => setUkuranBaru(e.target.value)}
              required
              style={{textAlign: 'center', fontWeight: 'bold'}}
            />
          </div>
          <button type="submit" className="submit-button" style={{width: '100%'}}>
            Simpan Ukuran
          </button>
        </form>
      </div>

      {/* BAGIAN KANAN: TABEL */}
      <div className="tabel-container">
        <h3>📋 Daftar Ukuran Tersedia</h3>
        
        {loading ? <p>Memuat data...</p> : (
          <table>
            <thead>
              <tr>
                <th style={{width: '50px'}}>ID</th>
                <th>Ukuran (Size)</th>
                <th style={{width: '100px', textAlign:'center'}}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {daftarUkuran.length > 0 ? (
                daftarUkuran.map((item) => (
                  <tr key={item.id}>
                    <td style={{color:'#888'}}>#{item.id}</td>
                    <td style={{fontWeight:'bold', fontSize:'1.1rem'}}>{item.size}</td>
                    <td style={{textAlign:'center'}}>
                      <button 
                        className="delete-button" 
                        onClick={() => handleDelete(item.id)}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{textAlign:'center', padding:'20px', color:'#999'}}>
                    Belum ada data ukuran.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UkuranSepatu;