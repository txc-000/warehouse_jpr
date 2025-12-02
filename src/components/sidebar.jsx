import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

// Komponen Item Navigasi (Clean - Tanpa Icon)
const NavItem = ({ title, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
  >
    <span className="nav-text">{title}</span>
  </NavLink>
);

// Komponen Dropdown
const NavDropdown = ({ title, items, isOpen, onToggle }) => {
  return (
    <div className="dropdown-container">
      <div className={`dropdown-header ${isOpen ? 'open' : ''}`} onClick={onToggle}>
        <span className="nav-text">{title}</span>
        {/* Panah Chevron Rotasi */}
        <svg 
          className={`chevron ${isOpen ? 'rotate' : ''}`} 
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>
      <div className={`dropdown-content ${isOpen ? 'show' : ''}`}>
        {items.map((item) => (
          <NavItem key={item.title} title={item.title} to={item.to} />
        ))}
      </div>
    </div>
  );
};

function Sidebar() {
  const navigate = useNavigate();

  // --- SETTING ROLE DISINI (Ganti untuk testing) ---
  // Pilihan: 'pemilik', 'admin_masuk', 'admin_keluar'
  const userRole = 'pemilik'; 
  // -------------------------------------------------

  const [openMasuk, setOpenMasuk] = useState(false);
  const [openKeluar, setOpenKeluar] = useState(false);

  // Helper Logika Hak Akses
  const isPemilik = userRole === 'pemilik';
  const canAccessMasuk = userRole === 'pemilik' || userRole === 'admin_masuk';
  const canAccessKeluar = userRole === 'pemilik' || userRole === 'admin_keluar';

  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const adminMasukItems = [
    { title: 'Dashboard', to: '/dashboard-admin-masuk' },
    { title: 'Info Stok & Harga', to: '/info-stok' },
    { title: 'Data Sepatu Master', to: '/data-sepatu' },
    { title: 'Data Master Size', to: '/data-size' },
    { title: 'Paket Seri', to: '/paket-seri' },
    { title: 'Transaksi Masuk', to: '/sepatu-masuk' },
    { title: 'Edit Transaksi', to: '/edit-transaksi' },
  ];

  const adminKeluarItems = [
    { title: 'Dashboard', to: '/dashboard-admin-keluar' },
    { title: 'Info Stok & Harga', to: '/info-stok' },
    { title: 'Transaksi Keluar', to: '/sepatu-keluar' },
  ];

  return (
    <div className="sidebar">
      
      {/* HEADER LOGO */}
      <div className="sidebar-header">
        <div className="logo-box">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12L20 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12L4 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="brand-text">
          <h3>GudangApp</h3>
        </div>
      </div>
      
      {/* MENU WRAPPER */}
      <div className="sidebar-menu-wrapper">
        
        {/* 1. KHUSUS PEMILIK: MENU UTAMA LENGKAP */}
        {isPemilik && (
          <div className="menu-group">
            <div className="menu-label">MENU UTAMA</div>
            <NavItem title="Dashboard" to="/dashboard-pemilik" />
            <NavItem title="Edit Harga" to="/atur-harga" />
            <NavItem title="Info Stok & Harga" to="/info-stok" />
            <NavItem title="Verifikasi Stok" to="/verifikasi-stok" />
            <NavItem title="Laporan Stok" to="/laporan-stok" />
            <NavItem title="History Transaksi" to="/history" />
            <NavItem title="Kelola Akses User" to="/kelola-user" />
          </div>
        )}

        {/* 2. ADMIN SECTION (Dibungkus logika per role) */}
        <div className="menu-group">
          {(canAccessMasuk || canAccessKeluar) && (
            <div className="menu-label">
              {isPemilik ? 'ADMINISTRASI' : 'MENU ADMIN'}
            </div>
          )}
          
          {/* Dropdown Admin Masuk (Hanya Pemilik & Admin Masuk) */}
          {canAccessMasuk && (
            <NavDropdown 
              title="Admin Barang Masuk" 
              items={adminMasukItems} 
              isOpen={openMasuk}
              onToggle={() => setOpenMasuk(!openMasuk)}
            />
          )}

          {/* Dropdown Admin Keluar (Hanya Pemilik & Admin Keluar) */}
          {canAccessKeluar && (
            <NavDropdown 
              title="Admin Barang Keluar" 
              items={adminKeluarItems} 
              isOpen={openKeluar}
              onToggle={() => setOpenKeluar(!openKeluar)}
            />
          )}
        </div>
        
      </div> 
      
      {/* FOOTER LOGOUT */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          Logout ({userRole.replace('_', ' ')})
        </button>
      </div>

    </div>
  );
}

export default Sidebar;