import React, { useState } from 'react';
import './EditTransaksiPage.css'; // Pakai ulang CSS tabel
import './LaporanStok.css'; // Tetap import CSS ini

// --- SIMULASI DATA (VERSI GROSIR PER DUS + MERK) ---
// (Data ini tetap sama, tidak perlu diubah)
const laporanStokPerDus = [
  { id: 1, merk: 'Nike', namaProduk: 'Air Force 1 \'07', namaPaket: 'Seri 38-42 (Isi 12)', stokAwal: 10, masuk: 5, keluar: 3 },
  { id: 2, merk: 'Nike', namaProduk: 'Air Force 1 \'07', namaPaket: 'Seri 39-43 (Isi 12)', stokAwal: 8, masuk: 10, keluar: 5 },
  { id: 3, merk: 'Adidas', namaProduk: 'Samba OG', namaPaket: 'Seri 38-42 (Isi 12)', stokAwal: 15, masuk: 0, keluar: 7 },
  { id: 4, merk: 'New Balance', namaProduk: '550', namaPaket: 'Seri Anak A (Isi 20)', stokAwal: 20, masuk: 10, keluar: 10 },
];
// --- END SIMULASI DATA ---

function LaporanStokPage() {
  const [daftarStok] = useState(laporanStokPerDus);

  const handlePrint = () => {
    window.print();
  };

  return (
    // 1. HAPUS 'no-print' DARI PEMBUNGKUS UTAMA INI
    <div className="dashboard-content"> 
      
      {/* 2. BUAT PEMBUNGKUS 'no-print' BARU HANYA UNTUK HEADER & TOMBOL */}
      <div className="no-print">
        <header className="dashboard-header">
          <h1>Mencetak Laporan Stok</h1>
          <p>Gunakan tombol di bawah untuk mencetak laporan stok akhir.</p>
        </header>

        <button className="button-cetak" onClick={handlePrint}>
          🖨️ Cetak Laporan
        </button>
      </div>

      {/* 3. Area cetak ini SEKARANG BERADA DI LUAR 'no-print' */}
      <div id="laporan-area" className="tabel-container-full">
        
        <h3 className="judul-laporan">Laporan Stok Akhir (per Dus)</h3>
        
        <p className="tanggal-laporan">
          Dicetak pada: {new Date().toLocaleString('id-ID', {
            dateStyle: 'long', 
            timeStyle: 'medium', 
            hour12: false
          })}
        </p>

        <table>
          <thead>
            <tr>
              <th>Merk</th>
              <th>Nama Produk</th>
              <th>Nama Paket Seri</th>
              <th>Stok Awal (Dus)</th>
              <th>Masuk (Dus)</th>
              <th>Keluar (Dus)</th>
              <th>Stok Akhir (Dus)</th>
            </tr>
          </thead>
          <tbody>
            {daftarStok.map(item => {
              const stokAkhir = (item.stokAwal + item.masuk) - item.keluar;
              return (
                <tr key={item.id}>
                  <td>{item.merk}</td>
                  <td>{item.namaProduk}</td>
                  <td>{item.namaPaket}</td>
                  <td>{item.stokAwal}</td>
                  <td>{item.masuk}</td>
                  <td>{item.keluar}</td>
                  <td style={{ fontWeight: 'bold' }}>
                    {stokAkhir}
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

export default LaporanStokPage;