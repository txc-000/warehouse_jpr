import React, { useState, useMemo } from 'react';
import './PaketSeri.css'; // Kita akan buat file CSS ini selanjutnya

// Nanti, 'masterUkuranList' ini akan Anda dapatkan dari API/backend.
// Untuk sekarang, kita gunakan data contoh (dummy data).
const masterUkuranList = [
  { id: 1, nomor: 38 },
  { id: 2, nomor: 39 },
  { id: 3, nomor: 40 },
  { id: 4, nomor: 41 },
  { id: 5, nomor: 42 },
  { id: 6, nomor: 43 },
];

function PaketSeriPage() {
  const [namaPaket, setNamaPaket] = useState('');
  
  // 'komposisi' adalah state yang menyimpan daftar ukuran dan jumlahnya
  const [komposisi, setKomposisi] = useState([
    { id_master_ukuran: '', jumlah: 1 }
  ]);

  // Fungsi untuk mengubah data di baris komposisi
  const handleKomposisiChange = (index, event) => {
    const values = [...komposisi];
    values[index][event.target.name] = event.target.value;
    setKomposisi(values);
  };

  // Fungsi untuk menambah baris baru
  const handleTambahBaris = () => {
    setKomposisi([...komposisi, { id_master_ukuran: '', jumlah: 1 }]);
  };

  // Fungsi untuk menghapus baris
  const handleHapusBaris = (index) => {
    const values = [...komposisi];
    values.splice(index, 1);
    setKomposisi(values);
  };

  // Fungsi untuk menghitung total sepatu secara otomatis
  const totalSepatu = useMemo(() => {
    return komposisi.reduce((total, item) => {
      return total + (Number(item.jumlah) || 0);
    }, 0);
  }, [komposisi]);

  // Fungsi ini akan dijalankan saat tombol 'Simpan' diklik
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Ini adalah data yang akan Anda kirim ke backend
    const dataUntukBackend = {
      nama_paket: namaPaket,
      total_per_dus: totalSepatu,
      detail_paket: komposisi.map(item => ({
        id_master_ukuran: item.id_master_ukuran,
        jumlah: Number(item.jumlah)
      }))
    };

    // Karena ini hanya frontend, kita tampilkan di console
    console.log('Data yang akan dikirim ke Backend:', dataUntukBackend);
    alert('Paket Seri berhasil dibuat! (Cek console log untuk melihat datanya)');
    
    // Reset form
    setNamaPaket('');
    setKomposisi([{ id_master_ukuran: '', jumlah: 1 }]);
  };

  return (
    // Asumsi Anda punya layout dengan class 'main-content' atau sejenisnya
    <div className="paket-seri-container">
      <h2>Pengelolaan Paket Seri Grosir</h2>
      <p>Buat resep paket untuk penjualan grosir per dus.</p>

      <form onSubmit={handleSubmit} className="paket-seri-form">
        
        {/* --- Bagian Informasi Paket --- */}
        <div className="form-card">
          <h3>Informasi Paket</h3>
          <div className="form-group">
            <label htmlFor="namaPaket">Nama Paket</label>
            <input
              type="text"
              id="namaPaket"
              value={namaPaket}
              onChange={(e) => setNamaPaket(e.target.value)}
              placeholder="Contoh: Seri 38-42 (Isi 12)"
              required
            />
          </div>
        </div>

        {/* --- Bagian Komposisi Isi Paket --- */}
        <div className="form-card">
          <h3>Komposisi Isi Paket (per Dus)</h3>
          
          <div className="komposisi-header">
            <div className="komposisi-col-ukuran">Ukuran Sepatu</div>
            <div className="komposisi-col-jumlah">Jumlah (pcs)</div>
            <div className="komposisi-col-aksi">Aksi</div>
          </div>

          <div className="komposisi-body">
            {komposisi.map((item, index) => (
              <div className="komposisi-row" key={index}>
                
                <select
                  name="id_master_ukuran"
                  value={item.id_master_ukuran}
                  onChange={(e) => handleKomposisiChange(index, e)}
                  required
                  className="komposisi-col-ukuran"
                >
                  <option value="" disabled>-- Pilih Ukuran --</option>
                  {masterUkuranList.map((ukuran) => (
                    <option key={ukuran.id} value={ukuran.id}>
                      {ukuran.nomor}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  name="jumlah"
                  value={item.jumlah}
                  onChange={(e) => handleKomposisiChange(index, e)}
                  min="1"
                  required
                  className="komposisi-col-jumlah"
                />

                <button
                  type="button"
                  onClick={() => handleHapusBaris(index)}
                  className="btn-hapus-baris komposisi-col-aksi"
                >
                  Hapus
                </button>

              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleTambahBaris}
            className="btn-tambah-baris"
          >
            + Tambah Ukuran
          </button>

          <hr className="divider" />

          <div className="total-display">
            Total Sepatu per Dus:
            <span className="total-angka">{totalSepatu} pcs</span>
          </div>

        </div>

        {/* --- Tombol Simpan Utama --- */}
        <button type="submit" className="btn-simpan-paket">
          Simpan Paket Seri
        </button>
      </form>
    </div>
  );
}

export default PaketSeriPage;