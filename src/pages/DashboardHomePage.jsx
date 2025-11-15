// src/pages/DashboardHomePage.jsx

import React from 'react';

// Import semua dashboard yang sudah kita buat
import DashboardAdminMasuk from './Dashboard.jsx'; // Dashboard Admin Masuk
import DashboardPemilik from './PemilikDashboard.jsx'; // Dashboard Pemilik
import DashboardAdminKeluar from './AdminKeluarDashboard.jsx'; // Dashboard Admin Keluar

function DashboardHomePage() {
  
  // --- INI ADALAH SAKLAR UNTUK TES ---
  // Ganti nilai di bawah ini untuk melihat dashboard yang berbeda.
  // Pilihan: 'pemilik', 'admin_masuk', 'admin_keluar'
  
  const userRole = 'pemilik'; // <-- GANTI INI UNTUK TES
  
  // ------------------------------------
  // Di aplikasi nyata, 'userRole' ini akan Anda dapatkan dari
  // state login, local storage, atau context.
  // ------------------------------------

  // Tampilkan dashboard yang sesuai berdasarkan role
  if (userRole === 'pemilik') {
    return <DashboardPemilik />;
  } 
  
  else if (userRole === 'admin_masuk') {
    return <DashboardAdminMasuk />;
  } 
  
  else if (userRole === 'admin_keluar') {
    return <DashboardAdminKeluar />;
  } 
  
  else {
    // Jika role tidak dikenal, tampilkan default
    return <DashboardAdminMasuk />;
  }
}

export default DashboardHomePage;