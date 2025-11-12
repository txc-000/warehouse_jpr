import React, { useState } from 'react';
// Kita pakai ulang CSS tabel dari halaman sebelumnya
import './EditTransaksiPage.css'; 

// --- SIMULASI DATA ---
// Di aplikasi nyata, data ini akan diambil dari 3 tabel berbeda dan dihitung.
// Di sini kita buat data dummy yang sudah jadi.

// 1. Data Sepatu Master
const masterSepatu = [
  { id: 1, kodeSepatu: 'AF1-001', namaSepatu: 'Air Force 1 \'07' },
  { id: 2, kodeSepatu: 'ADS-SMBA', namaSepatu: 'Samba OG' },
  { id: 3, kodeSepatu: 'NB-550', namaSepatu: '550' },
];

// 2. Data Stok (Dummy)
const dataStok = [
  { idSepatu: 1, stokAwal: 20, masuk: 15, keluar: 8 },
  { idSepatu: 2, stokAwal: 30, masuk: 5, keluar: 12 },
  { idSepatu: 3, stokAwal: 15, masuk: 20, keluar: 10 },
];

// 3. Kita gabungkan data itu
const stokGudang = masterSepatu.map(sepatu => {
  const stok = dataStok.find(s => s.idSepatu === sepatu.id);
  const stokAkhir = (stok.stokAwal + stok.masuk) - stok.keluar;
  
  return {
    ...sepatu, // kodeSepatu, namaSepatu
    ...stok,    // stokAwal, masuk, keluar
    stokAkhir: stokAkhir // Hasil perhitungan
  };
});

// --- KOMPONEN HALAMAN ---

function VerifikasiStokPage() {
  // Data kita adalah 'stokGudang' yang sudah dihitung di atas
  const [daftarStok] = useState(stokGudang);

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Verifikasi Stok Barang</h1>
        <p>Laporan stok barang berdasarkan data transaksi masuk dan keluar.</p>
      </header>

      {/* Kita pakai ulang class CSS dari halaman edit */}
      <div className="tabel-container-full">
        <table>
          <thead>
            <tr>
              <th>Kode Sepatu</th>
              <th>Nama Sepatu</th>
              <th>Stok Awal</th>
              <th>Masuk</th>
              <th>Keluar</th>
              <th>Stok Akhir</th>
            </tr>
          </thead>
          <tbody>
            {daftarStok.map(item => (
              <tr key={item.id}>
                <td>{item.kodeSepatu}</td>
                <td>{item.namaSepatu}</td>
                <td>{item.stokAwal}</td>
                <td>{item.masuk}</td>
                <td>{item.keluar}</td>
                {/* Beri style khusus untuk Stok Akhir */}
                <td style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {item.stokAkhir}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VerifikasiStokPage;