import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; 

// --- IMPORT COMPONENT ---
import MainLayout from './components/MainLayout.jsx'; 
import LoginPage from './pages/LoginPage.jsx';
import DashboardHomePage from './pages/DashboardHomePage.jsx';

// Halaman Admin Masuk
import TransaksiMasukForm from './components/TransactionForm.jsx'; 
import SepatuKeluar from './pages/SepatuKeluar.jsx'; 
import EditTransaksiPage from './pages/EditTransaksiPage.jsx';
import SepatuMasterPage from './pages/SepatuMasterPage.jsx';
import PaketSeriPage from './pages/PaketSeriPage.jsx';

// Halaman Stok & Umum
import StokBarangPage from './pages/StokBarangPage.jsx'; 
import AturHargaPage from './pages/AturHargaPage.jsx';   
import VerifikasiStokPage from './pages/VerifikasiStokPage.jsx'; 
import LaporanStokPage from './pages/LaporanStokPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx'; 

// Halaman Pemilik
import KelolaUserPage from './pages/KelolaUserPage.jsx';

// =================================================================
// 🛡️ KOMPONEN "SATPAM" (PROTECTED ROUTE)
// =================================================================
const SatpamRoute = ({ children, allowedRoles }) => {
  const sessionString = localStorage.getItem('user_session');
  
  if (!sessionString) {
    return <Navigate to="/login" replace />;
  }

  const session = JSON.parse(sessionString);
  const userRole = session.role ? session.role.toLowerCase().trim() : '';

  if (allowedRoles) {
    // Mengecek apakah role user ada dalam daftar role yang diizinkan
    if (!allowedRoles.includes(userRole)) {
      alert("⛔️ AKSES DITOLAK: Anda tidak punya izin masuk ke halaman ini!");
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

// =================================================================
// APP UTAMA
// =================================================================
function App() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate(); 

  // Memeriksa session saat aplikasi pertama kali dimuat
  useEffect(() => {
    const savedSession = localStorage.getItem('user_session');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
  }, []);

  // FUNGSI LOGIN: Mengambil data lengkap termasuk kolom nama_staff
  const handleLogin = async (username, password) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*') // MENGAMBIL SEMUA KOLOM (Penting: agar nama_staff terbawa)
        .eq('username', username)
        .eq('password', password)
        .maybeSingle();

      if (error) {
        alert("Error Database: " + error.message);
        return false;
      } else if (!data) {
        alert("Username atau Password Salah!");
        return false;
      } else {
        // Menyimpan data lengkap ke State dan LocalStorage
        setSession(data);
        localStorage.setItem('user_session', JSON.stringify(data));
        
        console.log("Login Berhasil! Staff:", data.nama_staff);
        navigate('/dashboard'); 
        return true;
      }
    } catch (err) {
      console.error("Login Error:", err);
      return false;
    }
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('user_session');
    navigate('/login');
  };

  return (
    <Routes>
      {/* Route Login */}
      <Route path="/login" element={
        !session ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />
      } />

      {/* Main App dengan Layout & Sidebar */}
      <Route path="/" element={
        session ? <MainLayout session={session} onLogout={handleLogout} /> : <Navigate to="/login" replace />
      }>
        
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* 1. DASHBOARD UTAMA */}
        <Route path="dashboard" element={<DashboardHomePage role={session?.role} />} />

        {/* 2. AREA ADMIN BARANG MASUK */}
        <Route path="transaksi-masuk" element={
          <SatpamRoute allowedRoles={['admin_masuk', 'admin barang masuk', 'pemilik']}>
            <TransaksiMasukForm />
          </SatpamRoute>
        } />
        <Route path="edit-transaksi" element={
          <SatpamRoute allowedRoles={['admin_masuk', 'admin barang masuk', 'pemilik']}>
            <EditTransaksiPage />
          </SatpamRoute>
        } />
        <Route path="sepatu-master" element={
          <SatpamRoute allowedRoles={['admin_masuk', 'admin barang masuk', 'pemilik']}>
            <SepatuMasterPage />
          </SatpamRoute>
        } />
        <Route path="paket-seri" element={
          <SatpamRoute allowedRoles={['admin_masuk', 'admin barang masuk', 'pemilik']}>
            <PaketSeriPage />
          </SatpamRoute>
        } />

        {/* 3. AREA ADMIN BARANG KELUAR */}
        <Route path="transaksi-keluar" element={
          <SatpamRoute allowedRoles={['admin_keluar', 'admin barang keluar', 'pemilik']}>
            <SepatuKeluar />
          </SatpamRoute>
        } />

        {/* 4. AREA KHUSUS PEMILIK */}
        <Route path="kelola-user" element={
          <SatpamRoute allowedRoles={['pemilik']}>
            <KelolaUserPage />
          </SatpamRoute>
        } />
        <Route path="edit-harga" element={
          <SatpamRoute allowedRoles={['pemilik']}>
            <AturHargaPage />
          </SatpamRoute>
        } />
        <Route path="verifikasi-stok" element={
          <SatpamRoute allowedRoles={['pemilik']}>
            <VerifikasiStokPage />
          </SatpamRoute>
        } />
        <Route path="laporan-stok" element={
          <SatpamRoute allowedRoles={['pemilik']}>
            <LaporanStokPage />
          </SatpamRoute>
        } /> 
        <Route path="history" element={
          <SatpamRoute allowedRoles={['pemilik']}>
            <HistoryPage />
          </SatpamRoute>
        } />

        {/* 5. AREA UMUM / INFO STOK */}
        <Route path="stok-barang" element={<StokBarangPage />} /> 

      </Route>

      {/* Redirect jika route tidak ditemukan */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;