import React from 'react';
import DashboardAdminMasuk from './Dashboard.jsx'; 
import DashboardPemilik from './PemilikDashboard.jsx'; 
import DashboardAdminKeluar from './AdminKeluarDashboard.jsx'; 

function DashboardHomePage({ role }) {
  // Normalisasi: ubah ke huruf kecil dan hapus spasi di awal/akhir
  const userRole = role ? role.toLowerCase().trim() : '';

  console.log("Dashboard Loaded. Role User:", userRole);

  // LOGIKA: Menerima format dengan underscore (_) maupun SPASI
  
  if (userRole === 'pemilik') {
    return <DashboardPemilik />;
  } 
  else if (userRole === 'admin_masuk' || userRole === 'admin barang masuk') {
    return <DashboardAdminMasuk />;
  } 
  else if (userRole === 'admin_keluar' || userRole === 'admin barang keluar') {
    return <DashboardAdminKeluar />;
  } 
  else {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
        <h2>Selamat Datang!</h2>
        <p>Sistem mendeteksi role Anda sebagai: <strong>"{userRole}"</strong></p>
        <p>Dashboard untuk role ini sedang disiapkan.</p>
      </div>
    );
  }
}

export default DashboardHomePage;