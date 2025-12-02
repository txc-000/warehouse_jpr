import React, { useState, useMemo } from 'react';
import './EditTransaksiPage.css'; // Pakai ulang CSS tabel
import './LaporanStok.css'; // Pakai ulang CSS print
import './Dashboard.css'; // Pastikan CSS tombol modern/search bar ada di sini

// --- SIMULASI DATA STOK (Tanpa Kolom Ukuran) ---
const dummyStok = [
  { 
    id: 1, 
    kode: 'NK-AF1-001', 
    merk: 'Nike', 
    namaProduk: 'Air Force 1 \'07', 
    namaPaket: 'Seri 38-42 (Isi 12)', // Info ukuran sudah ada di sini
    stokAwal: 10, 
    masuk: 5, 
    keluar: 3, 
    stokAkhir: 12, 
    staff: 'Budi Santoso', 
    lastUpdate: '2025-12-02' 
  },
  { 
    id: 2, 
    kode: 'NK-AF1-002', 
    merk: 'Nike', 
    namaProduk: 'Air Force 1 \'07', 
    namaPaket: 'Seri 39-43 (Isi 12)', 
    stokAwal: 8, 
    masuk: 10, 
    keluar: 5, 
    stokAkhir: 13, 
    staff: 'Siti Aminah', 
    lastUpdate: '2025-12-02'
  },
  { 
    id: 3, 
    kode: 'AD-SMB-002', 
    merk: 'Adidas', 
    namaProduk: 'Samba OG', 
    namaPaket: 'Seri 38-42 (Isi 12)', 
    stokAwal: 15, 
    masuk: 0, 
    keluar: 7, 
    stokAkhir: 8, 
    staff: 'Budi Santoso', 
    lastUpdate: '2025-12-01' 
  },
  { 
    id: 4, 
    kode: 'NB-550-003', 
    merk: 'New Balance', 
    namaProduk: '550', 
    namaPaket: 'Seri Anak A (Isi 20)', 
    stokAwal: 20, 
    masuk: 10, 
    keluar: 10, 
    stokAkhir: 20, 
    staff: 'Siti Aminah', 
    lastUpdate: '2025-12-02'
  },
];

function LaporanStokPage() {
  // --- STATE PENCARIAN & FILTER ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const handlePrint = () => {
    window.print();
  };

  // --- LOGIC FILTERING ---
  const filteredData = useMemo(() => {
    return dummyStok.filter(item => {
      // 1. Filter Search (Cari ID, Merk, Produk, Paket, Staff)
      const searchLower = searchTerm.toLowerCase();
      const matchSearch = 
        item.kode.toLowerCase().includes(searchLower) || 
        item.namaProduk.toLowerCase().includes(searchLower) ||
        item.merk.toLowerCase().includes(searchLower) ||
        item.namaPaket.toLowerCase().includes(searchLower) ||
        item.staff.toLowerCase().includes(searchLower);

      // 2. Filter Tanggal
      let matchDate = true;
      if (filterDate) {
        matchDate = item.lastUpdate === filterDate;
      }

      return matchSearch && matchDate;
    });
  }, [searchTerm, filterDate]);

  return (
    <div className="dashboard-content">
      
      {/* --- Bagian Control (TIDAK DICETAK) --- */}
      <div className="no-print">
        <header className="dashboard-header">
          <h1>Mencetak Laporan Stok</h1>
          <p>Gunakan tombol di bawah untuk mencetak laporan stok akhir.</p>
        </header>

        {/* --- AREA FILTER & SEARCH --- */}
        <div className="filter-container" style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="🔍 Cari ID, merk, produk, atau staff..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd', flex: 1, minWidth: '250px' }}
            />
            
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="date-input"
              title="Filter tanggal update stok"
              style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd' }}
            />

            <button className="button-cetak" onClick={handlePrint} style={{ marginLeft: 'auto' }}>
              🖨️ Cetak Laporan
            </button>
        </div>
      </div>

      {/* --- Bagian Laporan/Tabel yang AKAN DICETAK --- */}
      <div id="laporan-area" className="tabel-container-full">
        
        <h3 className="judul-laporan">Laporan Stok Akhir (per Dus)</h3>
        <p className="tanggal-laporan">
          Dicetak pada: {new Date().toLocaleString('id-ID', {
            dateStyle: 'long', timeStyle: 'medium', hour12: false
          })}
        </p>

        {/* --- TABEL DATA --- */}
        <table>
          <thead>
            <tr>
              <th>ID Barang</th>
              <th>Merk</th>
              <th>Nama Produk</th>
              <th>Nama Paket Seri</th> {/* Ukuran biasanya dilihat disini */}
              <th>Staff (PJ)</th>
              <th>Stok Awal</th>
              <th>Masuk</th>
              <th>Keluar</th>
              <th>Akhir</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(item => (
                <tr key={item.id}>
                  
                  {/* ID Barang */}
                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#555' }}>
                    {item.kode}
                  </td>
                  
                  <td>{item.merk}</td>
                  <td>{item.namaProduk}</td>
                  
                  {/* Nama Paket (Sudah mengandung info ukuran) */}
                  <td>{item.namaPaket}</td>
                  
                  <td>{item.staff}</td>
                  <td>{item.stokAwal}</td>
                  <td style={{ color: '#2ecc71', fontWeight: '500' }}>{item.masuk}</td> 
                  <td style={{ color: '#e74c3c', fontWeight: '500' }}>{item.keluar}</td>
                  <td style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>{item.stokAkhir}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                  Tidak ada data stok yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default LaporanStokPage;