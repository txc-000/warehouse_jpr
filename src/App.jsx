import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import layout
import LoginPage from './pages/LoginPage.jsx';
import MainLayout from './components/MainLayout.jsx';

// <-- TAMBAHKAN SEMUA INI (Ini yang menyebabkan error)
import Dashboard from './pages/Dashboard.jsx';
import SepatuKeluar from './pages/SepatuKeluar.jsx';
import EditTransaksiPage from './pages/EditTransaksiPage.jsx';
import SepatuMasterPage from './pages/SepatuMasterPage.jsx';
import DataMasterSizePage from './pages/DataMasterSizePage.jsx';
import VerifikasiStokPage from './pages/VerifikasiStokPage.jsx';
import LaporanStokPage from './pages/LaporanStokPage.jsx';
import KelolaUserPage from './pages/KelolaUserPage.jsx';
// <-- SAMPAI SINI -->

function App() {
  return (
    <Routes>
      {/* Rute untuk Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rute untuk semua halaman aplikasi utama */}
      <Route path="/" element={<MainLayout />}>
        {/* Ini akan me-redirect '/' ke '/sepatu-masuk' */}
        <Route index element={<Navigate to="/sepatu-masuk" replace />} />

        <Route path="sepatu-masuk" element={<Dashboard />} />
        <Route path="sepatu-keluar" element={<SepatuKeluar />} />
        <Route path="edit-transaksi" element={<EditTransaksiPage />} />
        <Route path="data-sepatu" element={<SepatuMasterPage />} />
        <Route path="data-size" element={<DataMasterSizePage />} />
        <Route path="verifikasi-stok" element={<VerifikasiStokPage />} />
        <Route path="laporan-stok" element={<LaporanStokPage />} />
        <Route path="kelola-user" element={<KelolaUserPage />} />
      </Route>

      {/* Jika ada rute yang tidak cocok, kembali ke login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;