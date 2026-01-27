import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import './EditTransaksiPage.css'; // Style tabel dasar
import './LaporanStok.css'; // Style khusus print
import './Dashboard.css'; 

function LaporanStokPage() {
  const [laporanData, setLaporanData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Default filter tanggal: HARI INI
  const today = new Date().toISOString().split('T')[0];
  const [filterDate, setFilterDate] = useState(today);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. FETCH DATA KOMPLEKS
  useEffect(() => {
    fetchReportData();
  }, [filterDate]); 

  const fetchReportData = async () => {
    setLoading(true);

    try {
      // A. Ambil Data Master Sepatu (Stok Akhir Saat Ini)
      const { data: masterData, error: masterError } = await supabase
        .from('master_sepatu')
        .select('*, paket_seri(nama_paket)')
        .order('kode_barang', { ascending: true });

      if (masterError) throw masterError;

      // B. Ambil Transaksi MASUK
      const startDay = `${filterDate}T00:00:00`;
      const endDay = `${filterDate}T23:59:59`;

      const { data: transMasuk, error: masukError } = await supabase
        .from('transaksi_masuk')
        .select('kode_barang, jumlah_dus')
        .gte('created_at', startDay)
        .lte('created_at', endDay);

      if (masukError) throw masukError;

      // C. Ambil Transaksi KELUAR
      const { data: transKeluar, error: keluarError } = await supabase
        .from('transaksi_keluar')
        .select('kode_barang, jumlah_dus')
        .gte('created_at', startDay)
        .lte('created_at', endDay);

      if (keluarError) throw keluarError;

      // D. OLAH DATA (Pastikan semua dihitung sebagai ANGKA)
      const processedData = masterData.map(item => {
        // 1. Hitung Total Masuk (Pakai Number() biar gak jadi string "0100")
        const totalMasuk = transMasuk
          .filter(t => t.kode_barang === item.kode_barang)
          .reduce((sum, t) => sum + Number(t.jumlah_dus), 0);

        // 2. Hitung Total Keluar
        const totalKeluar = transKeluar
          .filter(t => t.kode_barang === item.kode_barang)
          .reduce((sum, t) => sum + Number(t.jumlah_dus), 0);

        // 3. LOGIKA MATEMATIKA (Backward Calculation)
        // Stok Awal = Stok Akhir - Masuk + Keluar
        // Kita pakai Math.max(0, ...) supaya tidak ada stok minus
        const stokSekarang = Number(item.stok);
        let stokAwalEstimasi = stokSekarang - totalMasuk + totalKeluar;
        
        // Jaga-jaga jika hasil minus (karena data dummy/kotor), paksa jadi 0
        if (stokAwalEstimasi < 0) stokAwalEstimasi = 0;

        return {
          id: item.id,
          kode: item.kode_barang,
          merk: item.merk,
          namaProduk: item.nama_produk,
          namaPaket: item.paket_seri?.nama_paket || '-',
          stokAwal: stokAwalEstimasi, 
          masuk: totalMasuk,
          keluar: totalKeluar,
          stokAkhir: stokSekarang
        };
      });

      setLaporanData(processedData);

    } catch (err) {
      console.error("Error generating report:", err.message);
      alert("Gagal memuat laporan.");
    }

    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  // --- LOGIC SEARCHING ---
  const filteredData = useMemo(() => {
    return laporanData.filter(item => {
      const term = searchTerm.toLowerCase();
      return (
        item.kode.toLowerCase().includes(term) || 
        item.namaProduk.toLowerCase().includes(term) ||
        item.merk.toLowerCase().includes(term) ||
        item.namaPaket.toLowerCase().includes(term)
      );
    });
  }, [laporanData, searchTerm]);

  return (
    <div className="dashboard-content">
      
      {/* --- Bagian Control (TIDAK DICETAK) --- */}
      <div className="no-print">
        <header className="dashboard-header">
          <h1>Mencetak Laporan Stok</h1>
          <p>Laporan pergerakan stok harian (Masuk & Keluar).</p>
        </header>

        {/* --- AREA FILTER & SEARCH --- */}
        <div className="filter-container" style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="🔍 Cari ID, merk, atau produk..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd', flex: 1, minWidth: '200px' }}
            />
            
            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <label style={{fontWeight:'bold', color:'#555'}}>Tanggal:</label>
                <input 
                  type="date" 
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="date-input"
                  style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd', cursor:'pointer' }}
                />
            </div>

            <button className="button-cetak" onClick={handlePrint} style={{ marginLeft: 'auto', display:'flex', alignItems:'center', gap:'5px' }}>
              🖨️ Cetak Laporan
            </button>
        </div>
      </div>

      {/* --- Bagian Laporan/Tabel yang AKAN DICETAK --- */}
      <div id="laporan-area" className="tabel-container-full" style={{border: 'none', boxShadow:'none'}}>
        
        <h3 className="judul-laporan">Laporan Stok Harian Gudang</h3>
        <p className="tanggal-laporan">
          Tanggal Laporan: {new Date(filterDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} <br/>
          <small>Dicetak pada: {new Date().toLocaleString('id-ID')}</small>
        </p>

        {loading ? <p style={{textAlign:'center'}}>Menghitung data...</p> : (
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr>
                <th>ID Barang</th>
                <th>Merk</th>
                <th>Nama Produk</th>
                <th>Seri Ukuran</th> 
                <th style={{textAlign:'center', background:'#f1f5f9'}}>Awal</th>
                <th style={{textAlign:'center', background:'#dcfce7'}}>Masuk</th>
                <th style={{textAlign:'center', background:'#fee2e2'}}>Keluar</th>
                <th style={{textAlign:'center', background:'#e0f2fe'}}>Akhir</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map(item => (
                  <tr key={item.id}>
                    
                    {/* ID Barang */}
                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                      {item.kode}
                    </td>
                    
                    <td>{item.merk}</td>
                    <td>{item.namaProduk}</td>
                    <td style={{fontSize:'0.9rem'}}>{item.namaPaket}</td>
                    
                    {/* STOK AWAL (Perbaikan: Tidak boleh minus) */}
                    <td style={{ textAlign:'center', color:'#64748b' }}>
                        {/* Number() memastikan tidak ada leading zero */}
                        {Number(item.stokAwal)}
                    </td>

                    {/* BARANG MASUK (Perbaikan: Hilangkan + dan 0 di depan) */}
                    <td style={{ textAlign:'center', color: item.masuk > 0 ? '#16a34a' : '#cbd5e1', fontWeight: item.masuk > 0 ? 'bold' : 'normal' }}>
                        {item.masuk > 0 ? Number(item.masuk) : '-'}
                    </td> 

                    {/* BARANG KELUAR */}
                    <td style={{ textAlign:'center', color: item.keluar > 0 ? '#dc2626' : '#cbd5e1', fontWeight: item.keluar > 0 ? 'bold' : 'normal' }}>
                        {item.keluar > 0 ? Number(item.keluar) : '-'}
                    </td>

                    {/* STOK AKHIR */}
                    <td style={{ textAlign:'center', fontWeight: 'bold', fontSize: '1.05rem', color:'#0f172a' }}>
                        {Number(item.stokAkhir)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                    Tidak ada pergerakan atau data stok.
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

export default LaporanStokPage;