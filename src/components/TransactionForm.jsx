import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import './TransactionForm.css';

function TransactionForm() {
  // State untuk Data Master (Dari Supabase)
  const [masterSepatuList, setMasterSepatuList] = useState([]);
  const [paketList, setPaketList] = useState([]);
  
  // State Form
  const [selectedMerk, setSelectedMerk] = useState('');
  const [selectedProdukKode, setSelectedProdukKode] = useState(''); // Kita pakai Kode Barang sebagai ID unik
  const [selectedPaketId, setSelectedPaketId] = useState('');
  const [jumlahDus, setJumlahDus] = useState('1');
  const [supplier, setSupplier] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. FETCH DATA SAAT LOAD
  useEffect(() => {
    const fetchMasterData = async () => {
      // Ambil Semua Sepatu
      const { data: sepatuData } = await supabase
        .from('master_sepatu')
        .select('kode_barang, nama_produk, merk, stok');
      
      // Ambil Semua Paket Seri
      const { data: paketData } = await supabase
        .from('paket_seri')
        .select('id, nama_paket, total_qty');

      if (sepatuData) setMasterSepatuList(sepatuData);
      if (paketData) setPaketList(paketData);
    };

    fetchMasterData();
  }, []);

  // 2. LOGIKA MERK UNIK
  // Kita ambil daftar merk unik dari masterSepatuList
  const merkListUnik = useMemo(() => {
    const merks = masterSepatuList.map(item => item.merk);
    return [...new Set(merks)]; // Hapus duplikat
  }, [masterSepatuList]);

  // 3. FILTER PRODUK BERDASARKAN MERK
  const filteredProdukList = useMemo(() => {
    if (!selectedMerk) return [];
    return masterSepatuList.filter(p => p.merk === selectedMerk);
  }, [selectedMerk, masterSepatuList]);

  const handleMerkChange = (e) => {
    setSelectedMerk(e.target.value);
    setSelectedProdukKode(''); // Reset produk saat merk ganti
  };

  // 4. SUBMIT TRANSAKSI
  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setLoading(true);

    // Cari objek data lengkap berdasarkan pilihan user
    const produkTerpilih = masterSepatuList.find(p => p.kode_barang === selectedProdukKode);
    const paketTerpilih = paketList.find(p => p.id === parseInt(selectedPaketId));

    if (!produkTerpilih || !paketTerpilih) {
      alert("Data tidak valid. Mohon lengkapi form.");
      setLoading(false);
      return;
    }

    const totalPcs = parseInt(jumlahDus) * paketTerpilih.total_qty;

    // --- PROSES SIMPAN KE DATABASE ---
    try {
      // A. Simpan Riwayat Transaksi Masuk
      const { error: transError } = await supabase
        .from('transaksi_masuk')
        .insert([{
          kode_barang: produkTerpilih.kode_barang,
          nama_produk: produkTerpilih.nama_produk,
          merk: produkTerpilih.merk,
          nama_paket: paketTerpilih.nama_paket,
          jumlah_dus: parseInt(jumlahDus),
          total_pcs: totalPcs,
          supplier: supplier
        }]);

      if (transError) throw transError;

      // B. Update Stok di Master Sepatu (Opsional: Tambah Stok Gudang)
      // Stok di master biasanya dalam satuan DUS (sesuai request kamu sebelumnya)
      const stokBaru = (produkTerpilih.stok || 0) + parseInt(jumlahDus);
      
      const { error: updateError } = await supabase
        .from('master_sepatu')
        .update({ stok: stokBaru })
        .eq('kode_barang', produkTerpilih.kode_barang);

      if (updateError) throw updateError;

      // Sukses
      alert(`✅ Transaksi Berhasil!\nStok ${produkTerpilih.nama_produk} bertambah ${jumlahDus} Dus.`);
      
      // Reset Form
      setSelectedMerk('');
      setSelectedProdukKode('');
      setSelectedPaketId('');
      setJumlahDus('1');
      setSupplier('');
      
      // Refresh Data Master (Supaya stok di memori update)
      const { data: refreshData } = await supabase.from('master_sepatu').select('*');
      if(refreshData) setMasterSepatuList(refreshData);

    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="form-container">
      <h3>📥 Form Transaksi Sepatu Masuk (Grosir)</h3>
      
      <form onSubmit={handleSubmit}>

        {/* 1. PILIH MERK */}
        <div className="form-group">
          <label htmlFor="merk">Merk / Brand</label>
          <select
            id="merk"
            value={selectedMerk}
            onChange={handleMerkChange}
            required
          >
            <option value="" disabled>-- Pilih Merk --</option>
            {merkListUnik.map((merk, index) => (
              <option key={index} value={merk}>
                {merk}
              </option>
            ))}
          </select>
        </div>

        {/* 2. DROPDOWN KODE BARANG */}
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
                {produk.kode_barang}
              </option>
            ))}
          </select>
        </div>

        {/* 3. DROPDOWN NAMA PRODUK (Sinkron dengan Kode) */}
        <div className="form-group">
          <label htmlFor="namaProduk">Nama Produk</label>
          <select
            id="namaProduk"
            value={selectedProdukKode} // Value-nya sama: Kode Barang
            onChange={(e) => setSelectedProdukKode(e.target.value)}
            required
            disabled={!selectedMerk}
          >
            <option value="" disabled>-- Pilih Nama Produk --</option>
            {filteredProdukList.map(produk => (
              <option key={produk.kode_barang} value={produk.kode_barang}>
                {produk.nama_produk}
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
          <label htmlFor="jumlahDus">Jumlah Dus Masuk</label>
          <input
            type="number"
            id="jumlahDus"
            value={jumlahDus}
            onChange={(e) => setJumlahDus(e.target.value)}
            min="1"
            required
          />
        </div>

        {/* 6. SUPPLIER */}
        <div className="form-group">
          <label htmlFor="supplier">Supplier</label>
          <input
            type="text"
            id="supplier"
            placeholder="Contoh: PT. Sepatu Jaya"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;