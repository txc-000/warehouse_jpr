import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import './EditTransaksiPage.css'; // Kita pinjam style tabel yang sudah rapi
import './Dashboard.css'; // Untuk Search bar

function VerifikasiStokPage() {
  const [daftarStok, setDaftarStok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State untuk menyimpan inputan Stok Fisik user
  // Format: { id_barang: jumlah_fisik, ... }
  const [stokFisikInput, setStokFisikInput] = useState({});

  // 1. AMBIL DATA STOK DARI DB
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('master_sepatu')
      .select('*')
      .order('kode_barang', { ascending: true });

    if (error) console.log("Error:", error.message);
    else {
      setDaftarStok(data || []);
      // Reset input fisik setiap kali data di-refresh
      setStokFisikInput({});
    }
    setLoading(false);
  };

  // 2. HANDLE PERUBAHAN INPUT FISIK
  const handleFisikChange = (id, value) => {
    setStokFisikInput(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // 3. FUNGSI EKSEKUSI PENYESUAIAN (UPDATE DB)
  const handleSesuaikan = async (item, selisih, stokFisikBaru) => {
    // Validasi keamanan
    const confirmMsg = `⚠️ KONFIRMASI STOCK OPNAME\n\n` +
      `Barang: ${item.nama_produk}\n` +
      `Stok Sistem: ${item.stok}\n` +
      `Stok Fisik: ${stokFisikBaru}\n` +
      `Selisih: ${selisih > 0 ? '+' : ''}${selisih}\n\n` +
      `Sistem akan mengupdate stok menjadi ${stokFisikBaru}. Lanjutkan?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      // Update stok di master_sepatu
      const { error } = await supabase
        .from('master_sepatu')
        .update({ stok: parseInt(stokFisikBaru) })
        .eq('id', item.id);

      if (error) throw error;

      alert("✅ Stok berhasil disesuaikan!");
      fetchData(); // Refresh tabel

    } catch (err) {
      alert("Gagal update: " + err.message);
    }
  };

  // --- LOGIC PENCARIAN ---
  const filteredData = useMemo(() => {
    return daftarStok.filter(item => {
      const term = searchTerm.toLowerCase();
      return (
        item.nama_produk?.toLowerCase().includes(term) ||
        item.merk?.toLowerCase().includes(term) ||
        item.kode_barang?.toLowerCase().includes(term)
      );
    });
  }, [daftarStok, searchTerm]);

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>📊 Verifikasi Stok (Stock Opname)</h1>
        <p>Lakukan pengecekan rutin untuk memastikan stok sistem sesuai dengan fisik gudang.</p>
      </header>

      {/* --- PENCARIAN --- */}
      <div className="filter-container" style={{ display: 'flex', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="🔍 Cari ID barang, nama, atau merk..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{ 
            padding: '12px 15px', 
            borderRadius: '8px', 
            border: '1px solid #ddd', 
            width: '100%',
            maxWidth: '500px'
          }}
        />
      </div>

      <div className="tabel-container-full">
        {loading ? <p style={{padding:20}}>Memuat data stok...</p> : (
          <table>
            <thead>
              <tr>
                <th>Kode Barang</th>
                <th>Info Produk</th>
                <th style={{textAlign: 'center', background:'#f8fafc'}}>Stok Sistem</th>
                <th style={{textAlign: 'center', background:'#fff7ed'}}>Stok Fisik</th>
                <th style={{textAlign: 'center'}}>Selisih</th>
                <th style={{textAlign: 'center'}}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map(item => {
                  // Logika menghitung selisih
                  // Jika user belum ngetik, anggap stok fisik = stok sistem (selisih 0)
                  const inputVal = stokFisikInput[item.id];
                  const stokFisik = inputVal !== undefined ? parseInt(inputVal) : item.stok;
                  const selisih = stokFisik - item.stok;
                  
                  // Warna baris jika ada selisih
                  const isBeda = selisih !== 0;

                  return (
                    <tr key={item.id} style={{ backgroundColor: isBeda ? '#fff5f5' : 'white' }}>
                      
                      {/* ID BARANG */}
                      <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#555' }}>
                        {item.kode_barang}
                      </td>

                      {/* Info Produk */}
                      <td>
                        <strong>{item.merk}</strong>
                        <div style={{fontSize: '13px', color: '#444'}}>{item.nama_produk}</div>
                      </td>

                      {/* Stok Sistem (Read Only) */}
                      <td style={{textAlign: 'center', fontSize:'1.1rem', fontWeight:'bold', color:'#334155'}}>
                        {item.stok}
                      </td>
                      
                      {/* Input Stok Fisik */}
                      <td style={{textAlign: 'center'}}>
                        <input 
                          type="number"
                          value={inputVal !== undefined ? inputVal : item.stok}
                          onChange={(e) => handleFisikChange(item.id, e.target.value)}
                          style={{
                            width: '80px',
                            padding: '8px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            border: '2px solid #cbd5e1',
                            borderRadius: '6px',
                            backgroundColor: '#fff7ed', // Sedikit oranye biar highlight
                            color: '#ea580c'
                          }}
                        />
                      </td>
                      
                      {/* Kolom Selisih */}
                      <td style={{ 
                          textAlign: 'center', 
                          fontWeight: 'bold', 
                          color: selisih === 0 ? '#10b981' : (selisih < 0 ? '#ef4444' : '#3b82f6') 
                        }}>
                        {selisih > 0 ? `+${selisih}` : selisih}
                      </td>

                      {/* Tombol Aksi */}
                      <td style={{textAlign: 'center'}}>
                        {isBeda && (
                          <button 
                            className="edit-button" 
                            style={{ margin: '0 auto', display:'block', background: '#ef4444', border:'none', color:'white' }}
                            onClick={() => handleSesuaikan(item, selisih, stokFisik)}
                          >
                            Sesuaikan
                          </button>
                        )}
                        {!isBeda && <span style={{color:'#94a3b8', fontSize:'0.85rem'}}>✓ Sesuai</span>}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                    Data tidak ditemukan.
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

export default VerifikasiStokPage;