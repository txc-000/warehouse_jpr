// src/App.jsx

import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import layout
import LoginPage from './pages/LoginPage.jsx';
import MainLayout from './components/MainLayout.jsx';

// Import semua dashboard & halaman
import DashboardHomePage from './pages/DashboardHomePage.jsx';
import DashboardAdminMasuk from './pages/Dashboard.jsx'; 
import DashboardPemilik from './pages/PemilikDashboard.jsx'; 
import DashboardAdminKeluar from './pages/AdminKeluarDashboard.jsx'; 

import SepatuKeluar from './pages/SepatuKeluar.jsx';
import EditTransaksiPage from './pages/EditTransaksiPage.jsx';
import SepatuMasterPage from './pages/SepatuMasterPage.jsx';
import DataMasterSizePage from './pages/DataMasterSizePage.jsx';
import VerifikasiStokPage from './pages/VerifikasiStokPage.jsx';
import LaporanStokPage from './pages/LaporanStokPage.jsx';
import KelolaUserPage from './pages/KelolaUserPage.jsx';
import PaketSeriPage from './pages/PaketSeriPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import TransaksiMasukForm from './components/TransactionForm.jsx';
import StokBarangPage from './pages/StokBarangPage.jsx'; // Import Halaman Display
import AturHargaPage from './pages/AturHargaPage.jsx';

function App() {
  return (
    <Routes>
      {/* Rute untuk Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rute untuk semua halaman aplikasi utama */}
      <Route path="/" element={<MainLayout />}>
        
        {/* 'index' (halaman '/') memanggil 'DashboardHomePage' yang cerdas */}
        <Route index element={<DashboardHomePage />} />

        {/* Rute Dashboard */}
        <Route path="dashboard-pemilik" element={<DashboardPemilik />} />
        <Route path="dashboard-admin-masuk" element={<DashboardAdminMasuk />} />
        <Route path="dashboard-admin-keluar" element={<DashboardAdminKeluar />} />

        {/* Rute Halaman Lainnya */}
        <Route path="sepatu-masuk" element={<TransaksiMasukForm />} /> 
        <Route path="sepatu-keluar" element={<SepatuKeluar />} />
        <Route path="edit-transaksi" element={<EditTransaksiPage />} />
        <Route path="data-sepatu" element={<SepatuMasterPage />} />
        <Route path="data-size" element={<DataMasterSizePage />} />
        <Route path="verifikasi-stok" element={<VerifikasiStokPage />} />
        <Route path="laporan-stok" element={<LaporanStokPage />} /> 
        
        <Route path="kelola-user" element={<KelolaUserPage />} />
        <Route path="paket-seri" element={<PaketSeriPage />} />
        <Route path="history" element={<HistoryPage />} />

        {/* --- (PENTING) RUTE BARU UNTUK HALAMAN DISPLAY STOK & HARGA --- */}
        <Route path="info-stok" element={<StokBarangPage />} />
        <Route path="atur-harga" element={<AturHargaPage />} />

      </Route>

      {/* Jika ada rute yang tidak cocok, kembali ke login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;