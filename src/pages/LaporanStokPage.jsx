import React, { useState } from 'react';
import './EditTransaksiPage.css'; // Pakai ulang CSS tabel
import './LaporanStok.css'; // 1. IMPORT CSS PRINT YANG BARU

// --- SIMULASI DATA (Sama seperti Verifikasi Stok) ---
const masterSepatu = [
  { id: 1, kodeSepatu: 'AF1-001', namaSepatu: 'Air Force 1 \'07' },
  { id: 2, kodeSepatu: 'ADS-SMBA', namaSepatu: 'Samba OG' },
  { id: 3, kodeSepatu: 'NB-550', namaSepatu: '550' },
];
const dataStok = [
  { idSepatu: 1, stokAwal: 20, masuk: 15, keluar: 8 },
  { idSepatu: 2, stokAwal: 30, masuk: 5, keluar: 12 },
  { idSepatu: 3, stokAwal: 15, masuk: 20, keluar: 10 },
];
const stokGudang = masterSepatu.map(sepatu => {
  const stok = dataStok.find(s => s.idSepatu === sepatu.id);
  const stokAkhir = (stok.stokAwal + stok.masuk) - stok.keluar;
  return { ...sepatu, ...stok, stokAkhir: stokAkhir };
});
// --- END SIMULASI DATA ---

function LaporanStokPage() {
  const [daftarStok] = useState(stokGudang);

  // 2. Fungsi untuk memanggil dialog print browser
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Mencetak Laporan Stok</h1>
        <p>Gunakan tombol di bawah untuk mencetak laporan stok akhir.</p>
      </header>

      {/* 3. Tombol Cetak (Gaya 'button-tambah' tapi beda warna) */}
      <button className="button-cetak" onClick={handlePrint}>
        🖨️ Cetak Laporan
      </button>

      {/* Area ini adalah yang akan dicetak.
        Kita beri id 'laporan-area' untuk referensi (opsional)
      */}
      <div id="laporan-area" className="tabel-container-full">
        <h3>Laporan Stok Akhir - Per Tanggal (Otomatis)</h3>
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
                <td style={{ fontWeight: 'bold' }}>
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

export default LaporanStokPage;