import React, { useState } from 'react';
// Kita pakai ulang CSS tabel dari halaman sebelumnya
import './EditTransaksiPage.css'; 
// Kita tetap pakai file CSS ini, style-nya masih berguna
import './VerifikasiStok.css'; 

// --- SIMULASI DATA (VERSI GROSIR PER DUS) ---
// Ini adalah logika stok yang BENAR untuk bisnis Anda.
// Setiap baris adalah SATU JENIS DUS (Produk + Paket Seri).
const stokPerDus = [
  { id: 1, namaProduk: 'Air Force 1 \'07', namaPaket: 'Seri 38-42 (Isi 12)', stokSistem: 10, stokFisik: 10 },
  { id: 2, namaProduk: 'Air Force 1 \'07', namaPaket: 'Seri 39-43 (Isi 12)', stokSistem: 8, stokFisik: 8 },
  { id: 3, namaProduk: 'Samba OG', namaPaket: 'Seri 38-42 (Isi 12)', stokSistem: 15, stokFisik: 15 },
  { id: 4, namaProduk: '550', namaPaket: 'Seri Anak A (Isi 20)', stokSistem: 20, stokFisik: 20 },
];


// --- KOMPONEN HALAMAN (VERSI STOCK OPNAME PER DUS) ---

function VerifikasiStokPage() {
  // Kita gunakan data 'stokPerDus' yang baru
  const [daftarStok, setDaftarStok] = useState(stokPerDus);

  // Fungsi ini logikanya SAMA, tidak perlu diubah
  const handleStokFisikChange = (id, newValue) => {
    const nilai = Math.max(0, Number(newValue)); 
    setDaftarStok(prevStok =>
      prevStok.map(item =>
        item.id === id ? { ...item, stokFisik: nilai } : item
      )
    );
  };

  // Fungsi ini kita ubah sedikit pesannya agar jelas 'dus'
  const handleSesuaikan = (item) => {
    const selisih = item.stokFisik - item.stokSistem;
    
    // Pesan diubah menjadi 'dus'
    alert(`Akan dilakukan penyesuaian untuk ${item.namaProduk} (${item.namaPaket}). \nSelisih: ${selisih} DUS. \n\n(Langkah selanjutnya adalah membuka modal untuk alasan)`);
    
    // Logika simulasi ini tetap sama
    setDaftarStok(prevStok =>
      prevStok.map(i =>
        i.id === item.id ? { ...i, stokSistem: item.stokFisik } : i
      )
    );
  };

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Penyesuaian Stok (Stock Opname)</h1>
        <p>Bandingkan stok sistem dengan stok fisik di gudang.</p>
      </header>

      <div className="tabel-container-full">
        <table>
          {/* --- HEADER TABEL DIUBAH (LEBIH SEDERHANA) --- */}
          <thead>
            <tr>
              <th>Nama Produk</th>
              <th>Nama Paket Seri</th>
              <th>Stok Sistem (Dus)</th>
              <th>Stok Fisik (Dus)</th>
              <th>Selisih (Dus)</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {daftarStok.map(item => {
              const selisih = item.stokFisik - item.stokSistem;
              
              return (
                // Logika baris ini SAMA, hanya datanya yang beda
                <tr key={item.id} className={selisih !== 0 ? 'row-warning' : ''}>
                  {/* --- DATA TABEL DIUBAH --- */}
                  <td>{item.namaProduk}</td>
                  <td>{item.namaPaket}</td>
                  <td>{item.stokSistem}</td>
                  
                  <td>
                    <input 
                      type="number"
                      className="stok-fisik-input"
                      value={item.stokFisik}
                      onChange={(e) => handleStokFisikChange(item.id, e.target.value)}
                    />
                  </td>
                  
                  <td style={{ fontWeight: 'bold', color: selisih !== 0 ? '#d9534f' : '#28a745' }}>
                    {selisih}
                  </td>

                  <td>
                    {selisih !== 0 && (
                      <button 
                        className="edit-button" 
                        onClick={() => handleSesuaikan(item)}
                      >
                        Sesuaikan
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VerifikasiStokPage;