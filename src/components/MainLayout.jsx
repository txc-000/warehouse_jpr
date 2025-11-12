import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import Sidebar from './Sidebar.jsx';
import '../App.css'; // Pastikan App.css di-import

function MainLayout() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="content-area">
        {/* <Outlet> adalah placeholder di mana React Router 
          akan me-render halaman yang cocok (Dashboard, SepatuKeluar, dll)
        */}
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;