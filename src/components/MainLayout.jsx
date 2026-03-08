import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Sidebar from './sidebar.jsx';
import '../App.css'; 

// 1. PERBAIKAN: Tambahkan parameter { session, onLogout } di sini
function MainLayout({ session, onLogout }) {
  return (
    <div className="app-container">
      
      {/* 2. PERBAIKAN: Kirim data 'role' dan fungsi 'onLogout' ke Sidebar */}
      <Sidebar 
        role={session?.role} 
        onLogout={onLogout} 
      />

      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;