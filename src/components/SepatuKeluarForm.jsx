import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import '../components/TransactionForm.css'; // Kita "pinjam" CSS form yang sama biar konsisten

function SepatuKeluar() {
  // State Data Master
  const [masterSepatuList, setMasterSepatuList] = useState([]);
  const [paketList, setPaketList] = useState([]);
  
  // State Form
  const [selectedMerk, setSelectedMerk] = useState('');
  const [selectedProdukKode, setSelectedProdukKode] = useState('');
  const [selectedPaketId, setSelectedPaketId] = useState('');
  const [jumlahDus, setJumlahDus] = useState('1');
  const [tujuan, setTujuan] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. FETCH DATA DARI SUPABASE
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Ambil Sepatu (termasuk Stok untuk validasi)
    const { data: sepatuData } = await supabase
      .from('master_sepatu')
      .select('kode_barang, nama_produk, merk, stok');
    
    // Ambil Paket Seri
    const { data: paketData } = await supabase
      .from('paket_seri')
      .select('id, nama_paket, total_qty');

    if (sepatuData) setMasterSepatuList(sepatuData);
    if (paketData) setPaketList(paketData);
  };

  // 2. LOGIKA MERK UNIK
  const merkListUnik = useMemo(() => {
    const merks = masterSepatuList.map(item => item.merk);
    return [...new Set(merks)];
  }, [masterSepatuList]);

  // 3. FILTER PRODUK BERDASARKAN MERK
  const filteredProdukList = useMemo(() => {
    if (!selectedMerk) return [];
    return masterSepatuList.filter(p => p.merk === selectedMerk);
  }, [selectedMerk, masterSepatuList]);

  const handleMerkChange = (e) => {
    setSelectedMerk(e.target.value);
    setSelectedProdukKode('');
  };
  
  // 4. SUBMIT TRANSAKSI KELUAR
  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setLoading(true);

    const produkTerpilih = masterSepatuList.find(p => p.kode_barang === selectedProdukKode);
    const paketTerpilih = paketList.find(p => p.id === parseInt(selectedPaketId));

    // Validasi Data
    if (!produkTerpilih || !paketTerpilih) {
      alert("Mohon lengkapi data!");
      setLoading(false);
      return;
    }

    const dusKeluar = parseInt(jumlahDus);
    const stokSekarang = produkTerpilih.stok || 0;

    // --- VALIDASI PENTING: CEK STOK CUKUP GAK? ---
    if (stokSekarang < dusKeluar) {
      alert(`❌ STOK TIDAK CUKUP!\n\nStok saat ini: ${stokSekarang} Dus\nPermintaan: ${dusKeluar} Dus`);
      setLoading(false);
      return;
    }

    const totalPcs = dusKeluar * paketTerpilih.total_qty;

    try {
      // A. Simpan ke Riwayat Keluar
      const { error: transError } = await supabase
        .from('transaksi_keluar')
        .insert([{
          kode_barang: produkTerpilih.kode_barang,
          nama_produk: produkTerpilih.nama_produk,
          merk: produkTerpilih.merk,
          nama_paket: paketTerpilih.nama_paket,
          jumlah_dus: dusKeluar,
          total_pcs: totalPcs,
          tujuan: tujuan // Nama Toko/Customer
        }]);

      if (transError) throw transError;

      // B. KURANGI STOK di Master Sepatu
      const stokBaru = stokSekarang - dusKeluar;

      const { error: updateError } = await supabase
        .from('master_sepatu')
        .update({ stok: stokBaru })
        .eq('kode_barang', produkTerpilih.kode_barang);

      if (updateError) throw updateError;

      // Sukses
      alert(`✅ Transaksi Keluar Berhasil!\nStok sisa: ${stokBaru} Dus.`);
      
      // Reset Form
      setSelectedMerk('');
      setSelectedProdukKode('');
      setSelectedPaketId('');
      setJumlahDus('1');
      setTujuan('');
      
      // Refresh Data (Penting biar stok di dropdown update)
      fetchData();

    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="form-container">
      <h3>📤 Form Barang Keluar (Penjualan)</h3>
      
      <form onSubmit={handleSubmit}>

        {/* 1. MERK */}
        <div className="form-group">
          <label htmlFor="merk">Merk</label>
          <select
            id="merk"
            value={selectedMerk}
            onChange={handleMerkChange}
            required
          >
            <option value="" disabled>-- Pilih Merk --</option>
            {merkListUnik.map((merk, idx) => (
              <option key={idx} value={merk}>{merk}</option>
            ))}
          </select>
        </div>

        {/* 2. KODE BARANG */}
        <div className="form-group">
          <label htmlFor="kodeBarang">Kode Barang (SKU)</label>
          <select
            id="kodeBarang"
            value={selectedProdukKode}
            onChange={(e) => setSelectedProdukKode(e.target.value)}
            required
            disabled={!selectedMerk}
            style={{ fontFamily: 'monospace', fontWeight: 'bold' }}
          >
            <option value="" disabled>-- Pilih Kode --</option>
            {filteredProdukList.map(produk => (
              <option key={produk.kode_barang} value={produk.kode_barang}>
                {produk.kode_barang} (Sisa: {produk.stok})
              </option>
            ))}
          </select>
        </div>

        {/* 3. NAMA PRODUK */}
        <div className="form-group">
          <label htmlFor="namaProduk">Nama Produk</label>
          <select
            id="namaProduk"
            value={selectedProdukKode} // Value sama: Kode
            onChange={(e) => setSelectedProdukKode(e.target.value)}
            required
            disabled={!selectedMerk}
          >
            <option value="" disabled>-- Pilih Nama Produk --</option>
            {filteredProdukList.map(produk => (
              <option key={produk.kode_barang} value={produk.kode_barang}>
                {produk.nama_produk} (Sisa: {produk.stok})
              </option>
            ))}
          </select>
        </div>

        {/* 4. PAKET SERI */}
        <div className="form-group">
          <label htmlFor="paketSeri">Pilih Paket Seri</label>
          <select
            id="paketSeri"
            value={selectedPaketId}
            onChange={(e) => setSelectedPaketId(e.target.value)}
            required
          >
            <option value="" disabled>-- Pilih paket grosir --</option>
            {paketList.map(paket => (
              <option key={paket.id} value={paket.id}>
                {paket.nama_paket} (Isi {paket.total_qty} psg)
              </option>
            ))}
          </select>
        </div>

        {/* 5. JUMLAH DUS */}
        <div className="form-group">
          <label htmlFor="jumlahDus">Jumlah Dus Keluar</label>
          <input
            type="number"
            id="jumlahDus"
            value={jumlahDus}
            onChange={(e) => setJumlahDus(e.target.value)}
            min="1"
            required
          />
        </div>

        {/* 6. TUJUAN (Customer/Toko) */}
        <div className="form-group">
          <label htmlFor="tujuan">Tujuan (Customer/Toko)</label>
          <input
            type="text"
            id="tujuan"
            placeholder="Contoh: Toko Jaya Abadi"
            value={tujuan}
            onChange={(e) => setTujuan(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
          style={{background: '#2563eb'}} /* Warna Orange untuk Barang Keluar */
        >
          {loading ? 'Memproses...' : 'Simpan Transaksi Keluar'}
        </button>
      </form>
    </div>
  );
}

export default SepatuKeluar;