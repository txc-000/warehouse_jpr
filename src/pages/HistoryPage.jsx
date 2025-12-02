import React, { useState, useMemo } from 'react';
import './EditTransaksiPage.css'; // Pakai ulang CSS tabel
import './LaporanStok.css'; // Pakai ulang CSS print
import './Dashboard.css'; // Pastikan CSS tombol modern ada di sini

// --- SIMULASI DATA HISTORY (DENGAN NAMA STAFF & ID BARANG) ---
const dummyHistoryKeluar = [
  { 
    id: 1, 
    kode: 'NK-AF1-001', // DATA BARU: ID Barang
    namaStaff: 'Siti Aminah', 
    tanggal: '2025-11-14T10:30:00', 
    merk: 'Nike', 
    namaProduk: 'Air Force 1 \'07', 
    namaPaket: 'Seri 38-42 (Isi 12)', 
    jumlahDus: 10, 
    tujuan: 'Toko Jaya Abadi' 
  },
  { 
    id: 2, 
    kode: 'AD-SMB-002', 
    namaStaff: 'Siti Aminah', 
    tanggal: '2025-11-14T14:45:00', 
    merk: 'Adidas', 
    namaProduk: 'Samba OG', 
    namaPaket: 'Seri 38-42 (Isi 12)', 
    jumlahDus: 5, 
    tujuan: 'Mitra Sport' 
  },
  { 
    id: 3, 
    kode: 'NB-550-003', 
    namaStaff: 'Siti Aminah', 
    tanggal: '2025-11-15T09:15:00', 
    merk: 'New Balance', 
    namaProduk: '550', 
    namaPaket: 'Seri Anak A (Isi 20)', 
    jumlahDus: 8, 
    tujuan: 'Sinar Baru' 
  },
  { 
    id: 4, 
    kode: 'PM-SDE-004', 
    namaStaff: 'Budi Santoso', 
    tanggal: '2025-11-16T10:00:00', 
    merk: 'Puma', 
    namaProduk: 'Suede Classic', 
    namaPaket: 'Seri 40-44 (Isi 12)', 
    jumlahDus: 3, 
    tujuan: 'Sport Station' 
  },
];

const dummyHistoryMasuk = [
  { 
    id: 1, 
    kode: 'NK-RUN-005', 
    namaStaff: 'Budi Santoso', 
    tanggal: '2025-11-13T08:00:00', 
    merk: 'Nike', 
    namaProduk: 'Sepatu Lari Model X', 
    namaPaket: 'Seri 38-42 (Isi 12)', 
    jumlahDus: 10, 
    supplier: 'Supplier A' 
  },
  { 
    id: 2, 
    kode: 'AD-SDL-006', 
    namaStaff: 'Budi Santoso', 
    tanggal: '2025-11-13T09:30:00', 
    merk: 'Adidas', 
    namaProduk: 'Sandal Model Y', 
    namaPaket: 'Seri Anak A (Isi 20)', 
    jumlahDus: 5, 
    supplier: 'Supplier B' 
  },
  { 
    id: 3, 
    kode: 'NK-RUN-005', 
    namaStaff: 'Budi Santoso', 
    tanggal: '2025-11-14T11:00:00', 
    merk: 'Nike', 
    namaProduk: 'Sepatu Lari Model X', 
    namaPaket: 'Seri 39-43 (Isi 12)', 
    jumlahDus: 8, 
    supplier: 'Supplier A' 
  },
  { 
    id: 4, 
    kode: 'VN-OLD-007', 
    namaStaff: 'Siti Aminah', 
    tanggal: '2025-11-15T13:00:00', 
    merk: 'Vans', 
    namaProduk: 'Old Skool', 
    namaPaket: 'Seri 38-42 (Isi 12)', 
    jumlahDus: 15, 
    supplier: 'Gudang Pusat' 
  },
];

function HistoryPage() {
  const [activeTab, setActiveTab] = useState('keluar'); 
  
  // --- STATE PENCARIAN & FILTER ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const formatTanggal = (tanggalString) => {
    return new Date(tanggalString).toLocaleString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // --- LOGIC FILTERING ---
  const filteredData = useMemo(() => {
    const sourceData = activeTab === 'masuk' ? dummyHistoryMasuk : dummyHistoryKeluar;

    return sourceData.filter(item => {
      // A. Filter Search (Cari di semua field penting TERMASUK ID BARANG)
      const searchLower = searchTerm.toLowerCase();
      const matchSearch = 
        item.kode.toLowerCase().includes(searchLower) || // Cari ID
        item.namaProduk.toLowerCase().includes(searchLower) ||
        item.merk.toLowerCase().includes(searchLower) ||
        item.namaStaff.toLowerCase().includes(searchLower) ||
        (item.tujuan && item.tujuan.toLowerCase().includes(searchLower)) || 
        (item.supplier && item.supplier.toLowerCase().includes(searchLower)); 

      // B. Filter Tanggal
      let matchDate = true;
      if (filterDate) {
        const itemDate = item.tanggal.split('T')[0]; 
        matchDate = itemDate === filterDate;
      }

      return matchSearch && matchDate;
    });
  }, [activeTab, searchTerm, filterDate]); 

  return (
    <div className="dashboard-content">
      
      {/* --- Bagian yang TIDAK dicetak --- */}
      <div className="no-print">
        <header className="dashboard-header">
          <h1>History Transaksi</h1>
          <p>Catatan lengkap semua barang yang masuk dan keluar dari gudang.</p>
          
          {/* TOMBOL TAB MODERN */}
          <div className="history-toggle-container">
            <button 
              className={`history-toggle-btn ${activeTab === 'masuk' ? 'active' : ''}`}
              onClick={() => { setActiveTab('masuk'); setSearchTerm(''); setFilterDate(''); }} 
            >
              📥 History Masuk
            </button>
            <button 
              className={`history-toggle-btn ${activeTab === 'keluar' ? 'active' : ''}`}
              onClick={() => { setActiveTab('keluar'); setSearchTerm(''); setFilterDate(''); }} 
            >
              📤 History Keluar
            </button>
          </div>
        </header>

        {/* --- AREA FILTER & SEARCH --- */}
        <div className="filter-container" style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="🔍 Cari ID, produk, staff, atau toko..." 
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
              style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd' }}
            />

            <button className="button-cetak" onClick={handlePrint} style={{ marginLeft: 'auto' }}>
              🖨️ Cetak History
            </button>
        </div>
      </div>

      {/* --- Bagian Laporan/Tabel yang AKAN dicetak --- */}
      <div id="laporan-area" className="tabel-container-full">
        
        <h3 className="judul-laporan">
          {activeTab === 'masuk' ? 'History Transaksi Masuk' : 'History Transaksi Keluar'}
        </h3>
        <p className="tanggal-laporan">
          Dicetak pada: {new Date().toLocaleString('id-ID', {
            dateStyle: 'long', timeStyle: 'medium', hour12: false
          })}
        </p>

        {/* --- TABEL DINAMIS --- */}
        <table>
          <thead>
            <tr>
              <th>Tanggal & Waktu</th>
              <th>ID Barang</th> {/* KOLOM BARU */}
              <th>Nama Staff</th>
              <th>Merk</th>
              <th>Nama Produk</th>
              <th>Nama Paket Seri</th>
              <th>Jumlah Dus</th>
              <th>{activeTab === 'masuk' ? 'Supplier' : 'Tujuan (Customer)'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(item => (
                <tr key={item.id}>
                  <td>{formatTanggal(item.tanggal)}</td>
                  
                  {/* DATA BARU: ID Barang Monospace */}
                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#555' }}>
                    {item.kode}
                  </td>
                  
                  <td>{item.namaStaff}</td>
                  <td>{item.merk}</td>
                  <td>{item.namaProduk}</td>
                  <td>{item.namaPaket}</td>
                  <td style={{ fontWeight: 'bold' }}>{item.jumlahDus}</td>
                  <td>{activeTab === 'masuk' ? item.supplier : item.tujuan}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                  Tidak ada data yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default HistoryPage;