import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import './PaketSeri.css'; 

function PaketSeriPage() {
  const [namaPaket, setNamaPaket] = useState('');
  const [masterUkuranList, setMasterUkuranList] = useState([]); 
  const [riwayatPaket, setRiwayatPaket] = useState([]); // STATE BARU: Untuk list riwayat
  const [loading, setLoading] = useState(false);
  
  // State komposisi form
  const [komposisi, setKomposisi] = useState([
    { ukuran_id: '', jumlah: 1 }
  ]);

  // LOAD DATA AWAL
  useEffect(() => {
    fetchMasterUkuran();
    fetchRiwayatPaket(); // Ambil riwayat saat halaman dibuka
  }, []);

  const fetchMasterUkuran = async () => {
    const { data } = await supabase
      .from('master_ukuran')
      .select('*')
      .order('id', { ascending: true });
    setMasterUkuranList(data || []);
  };

  // --- FUNGSI BARU: AMBIL RIWAYAT PAKET ---
  const fetchRiwayatPaket = async () => {
    // Teknik Join Supabase: Ambil paket, DAN ambil detailnya, DAN ambil ukuran aslinya
    const { data, error } = await supabase
      .from('paket_seri')
      .select(`
        *,
        detail_paket_seri (
          id,
          jumlah,
          master_ukuran ( size ) 
        )
      `)
      .order('id', { ascending: false }); // Yang terbaru diatas

    if (error) console.log("Error fetch riwayat:", error.message);
    else setRiwayatPaket(data || []);
  };

  // --- FUNGSI BARU: HAPUS PAKET ---
  const handleDeletePaket = async (id) => {
    if(!window.confirm("Yakin hapus paket ini? Semua data transaksi terkait mungkin akan error jika paket dihapus.")) return;
    
    // Karena kita sudah set 'Cascade' di database, cukup hapus induknya
    const { error } = await supabase.from('paket_seri').delete().eq('id', id);
    
    if(error) alert("Gagal hapus: " + error.message);
    else {
      alert("Paket berhasil dihapus.");
      fetchRiwayatPaket();
    }
  };

  // --- LOGIC FORM ---
  const handleKomposisiChange = (index, event) => {
    const values = [...komposisi];
    values[index][event.target.name] = event.target.value;
    setKomposisi(values);
  };

  const handleTambahBaris = () => {
    setKomposisi([...komposisi, { ukuran_id: '', jumlah: 1 }]);
  };

  const handleHapusBaris = (index) => {
    const values = [...komposisi];
    if (values.length === 1) return; 
    values.splice(index, 1);
    setKomposisi(values);
  };

  const totalSepatu = useMemo(() => {
    return komposisi.reduce((total, item) => {
      return total + (parseInt(item.jumlah) || 0);
    }, 0);
  }, [komposisi]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (komposisi.some(k => !k.ukuran_id)) {
      alert("Mohon pilih ukuran sepatu untuk semua baris!");
      setLoading(false);
      return;
    }

    try {
      // 1. Simpan KEPALA PAKET
      const { data: paketData, error: paketError } = await supabase
        .from('paket_seri')
        .insert([{ 
            nama_paket: namaPaket, 
            total_qty: totalSepatu 
        }])
        .select()
        .single();

      if (paketError) throw paketError;

      const paketIdBaru = paketData.id;

      // 2. Siapkan data RINCIAN
      const detailData = komposisi.map(item => ({
        paket_id: paketIdBaru,
        ukuran_id: item.ukuran_id,
        jumlah: parseInt(item.jumlah)
      }));

      // 3. Simpan RINCIAN
      const { error: detailError } = await supabase
        .from('detail_paket_seri')
        .insert(detailData);

      if (detailError) throw detailError;

      alert('✅ Paket Seri Berhasil Dibuat!');
      setNamaPaket('');
      setKomposisi([{ ukuran_id: '', jumlah: 1 }]);
      fetchRiwayatPaket(); // Refresh tabel riwayat di bawah

    } catch (error) {
      alert('Gagal menyimpan: ' + error.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="paket-seri-container">
      <h2>Pengelolaan Paket Seri Grosir</h2>
      <p>Buat resep paket untuk penjualan grosir per dus.</p>

      {/* --- BAGIAN ATAS: FORM INPUT --- */}
      <form onSubmit={handleSubmit} style={{marginBottom: '50px'}}>
        <div className="form-card">
          <h3>Buat Paket Baru</h3>
          <div className="form-group">
            <label htmlFor="namaPaket">Nama Paket</label>
            <input
              type="text"
              id="namaPaket"
              value={namaPaket}
              onChange={(e) => setNamaPaket(e.target.value)}
              placeholder="Contoh: Seri 39-43 (Isi 12)"
              required
              className="input-text"
            />
          </div>

          <div className="komposisi-header">
            <div className="col-ukuran">Ukuran Sepatu</div>
            <div className="col-jumlah">Jumlah (pcs)</div>
            <div className="col-aksi">Aksi</div>
          </div>

          <div>
            {komposisi.map((item, index) => (
              <div className="komposisi-row" key={index}>
                <div className="col-ukuran">
                  <select
                    name="ukuran_id"
                    value={item.ukuran_id}
                    onChange={(e) => handleKomposisiChange(index, e)}
                    required
                    className="select-ukuran"
                  >
                    <option value="" disabled>-- Pilih --</option>
                    {masterUkuranList.map((ukuran) => (
                      <option key={ukuran.id} value={ukuran.id}>
                        Size {ukuran.size}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-jumlah">
                  <input
                    type="number"
                    name="jumlah"
                    value={item.jumlah}
                    onChange={(e) => handleKomposisiChange(index, e)}
                    min="1"
                    required
                    className="input-jumlah"
                  />
                </div>
                <div className="col-aksi">
                  <button
                    type="button"
                    onClick={() => handleHapusBaris(index)}
                    className="btn-hapus-mini"
                    disabled={komposisi.length === 1}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button type="button" onClick={handleTambahBaris} className="btn-tambah-baris">
            + Tambah Baris Ukuran
          </button>

          <div className="total-display">
            Total per Dus: <span className="total-angka">{totalSepatu} Pcs</span>
          </div>
        </div>

        <button type="submit" className="btn-simpan-paket" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Paket Seri'}
        </button>
      </form>

      {/* --- BAGIAN BAWAH: RIWAYAT PAKET --- */}
      <div className="riwayat-section">
        <h3>📚 Daftar Paket Tersedia</h3>
        <p style={{fontSize:'0.9rem', color:'#666', marginBottom:'20px'}}>
           Berikut adalah daftar resep paket yang sudah Anda buat sebelumnya.
        </p>

        <div className="grid-paket">
          {riwayatPaket.length > 0 ? (
            riwayatPaket.map((paket) => (
              <div key={paket.id} className="card-paket">
                <div className="card-paket-header">
                   <h4 className="nama-paket-title">{paket.nama_paket}</h4>
                   <button onClick={() => handleDeletePaket(paket.id)} className="btn-hapus-paket">Hapus</button>
                </div>
                
                <div className="info-total">
                    Isi: <strong>{paket.total_qty} Pasang / Dus</strong>
                </div>
                
                <div className="rincian-list">
                    <p style={{fontSize:'0.8rem', fontWeight:'bold', color:'#888', marginBottom:'5px'}}>Rincian:</p>
                    <div className="rincian-tags">
                        {paket.detail_paket_seri && paket.detail_paket_seri.map((detail) => (
                            <span key={detail.id} className="tag-ukuran">
                                Size <b>{detail.master_ukuran?.size}</b> : {detail.jumlah}
                            </span>
                        ))}
                    </div>
                </div>
              </div>
            ))
          ) : (
             <p style={{textAlign:'center', color:'#999'}}>Belum ada paket yang dibuat.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaketSeriPage;