import React, { useState } from 'react';
// Kita pakai ulang CSS tabel dari halaman sebelumnya
import './EditTransaksiPage.css'; 
// Kita tetap pakai file CSS ini, style-nya masih berguna
import './VerifikasiStok.css'; 

// --- SIMULASI DATA (VERSI GROSIR PER DUS + ID BARANG) ---
const stokPerDus = [
  { 
    id: 1, 
    kode: 'NK-AF1-001', // DATA BARU: ID Barang
    namaProduk: 'Air Force 1 \'07', 
    namaPaket: 'Seri 38-42 (Isi 12)', 
    stokSistem: 10, 
    stokFisik: 10 
  },
  { 
    id: 2, 
    kode: 'NK-AF1-002', 
    namaProduk: 'Air Force 1 \'07', 
    namaPaket: 'Seri 39-43 (Isi 12)', 
    stokSistem: 8, 
    stokFisik: 8 
  },
  { 
    id: 3, 
    kode: 'AD-SMB-002', 
    namaProduk: 'Samba OG', 
    namaPaket: 'Seri 38-42 (Isi 12)', 
    stokSistem: 15, 
    stokFisik: 15 
  },
  { 
    id: 4, 
    kode: 'NB-550-003', 
    namaProduk: '550', 
    namaPaket: 'Seri Anak A (Isi 20)', 
    stokSistem: 20, 
    stokFisik: 20 
  },
];

// --- KOMPONEN HALAMAN (VERSI STOCK OPNAME PER DUS) ---

function VerifikasiStokPage() {
  const [daftarStok, setDaftarStok] = useState(stokPerDus);

  // Fungsi mengubah stok fisik
  const handleStokFisikChange = (id, newValue) => {
    const nilai = Math.max(0, Number(newValue)); 
    setDaftarStok(prevStok =>
      prevStok.map(item =>
        item.id === id ? { ...item, stokFisik: nilai } : item
      )
    );
  };

  // Fungsi penyesuaian (simulasi)
  const handleSesuaikan = (item) => {
    const selisih = item.stokFisik - item.stokSistem;
    
    alert(`Akan dilakukan penyesuaian untuk ID: ${item.kode}\nProduk: ${item.namaProduk} (${item.namaPaket}). \nSelisih: ${selisih} DUS. \n\n(Langkah selanjutnya adalah membuka modal untuk alasan)`);
    
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
          <thead>
            <tr>
              <th>ID Barang</th> {/* KOLOM BARU */}
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
                <tr key={item.id} className={selisih !== 0 ? 'row-warning' : ''}>
                  
                  {/* DATA BARU: Menampilkan ID Barang */}
                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#555' }}>
                    {item.kode}
                  </td>

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