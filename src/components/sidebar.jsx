import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css'; 

// Komponen Item Navigasi
const NavItem = ({ title, to }) => (
  <NavLink
    to={to}
    // Menggunakan isActive dari NavLink untuk styling otomatis
    className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
  >
    <span className="nav-text">{title}</span>
  </NavLink>
);

// Komponen Dropdown untuk Menu Admin
const NavDropdown = ({ title, items, isOpen, onToggle }) => {
  return (
    <div className="dropdown-container">
      <div className={`dropdown-header ${isOpen ? 'open' : ''}`} onClick={onToggle}>
        <span className="nav-text">{title}</span>
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

function Sidebar({ role, onLogout }) {
  // State untuk kontrol buka-tutup dropdown admin
  const [openMasuk, setOpenMasuk] = useState(true);
  const [openKeluar, setOpenKeluar] = useState(true);

  // Normalisasi Role (Menangani huruf besar/kecil dan spasi dari database)
  const userRole = role ? role.toLowerCase().trim() : '';

  // Variabel Helper Izin Akses
  const isPemilik = userRole === 'pemilik';
  const canAccessMasuk = isPemilik || userRole === 'admin_masuk' || userRole === 'admin barang masuk';
  const canAccessKeluar = isPemilik || userRole === 'admin_keluar' || userRole === 'admin barang keluar';

  // Daftar Menu Admin Masuk
  const adminMasukItems = [
    { title: 'Dashboard', to: '/dashboard' },
    { title: 'Info Stok & Harga', to: '/stok-barang' },
    { title: 'Data Sepatu Master', to: '/sepatu-master' },
    { title: 'Paket Seri', to: '/paket-seri' },
    { title: 'Transaksi Masuk', to: '/transaksi-masuk' },
    { title: 'Edit Transaksi', to: '/edit-transaksi' },
  ];

  // Daftar Menu Admin Keluar
  const adminKeluarItems = [
    { title: 'Dashboard', to: '/dashboard' },
    { title: 'Info Stok & Harga', to: '/stok-barang' },
    { title: 'Transaksi Keluar', to: '/transaksi-keluar' },
  ];

  return (
    <div className="sidebar">
      {/* --- HEADER LOGO --- */}
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
          <h3>GudangSepatuku</h3>
        </div>
      </div>
      
      {/* --- MENU WRAPPER --- */}
      <div className="sidebar-menu-wrapper">
        
        {/* 1. KHUSUS PEMILIK (Menu Utama) */}
        {isPemilik && (
          <div className="menu-group">
            <div className="menu-label">MENU UTAMA</div>
            <NavItem title="Dashboard" to="/dashboard" />
            <NavItem title="Edit Harga" to="/edit-harga" />
            <NavItem title="Info Stok & Harga" to="/stok-barang" />
            <NavItem title="Verifikasi Stok" to="/verifikasi-stok" />
            <NavItem title="Laporan Stok" to="/laporan-stok" />
            <NavItem title="History Transaksi" to="/history" />
            <NavItem title="Kelola Akses User" to="/kelola-user" />
          </div>
        )}

        {/* 2. AREA ADMINISTRASI (Admin Masuk & Keluar) */}
        <div className="menu-group">
          {(canAccessMasuk || canAccessKeluar) && (
            <div className="menu-label">
              {isPemilik ? 'ADMINISTRASI' : 'MENU ADMIN'}
            </div>
          )}
          
          {/* Dropdown Admin Masuk */}
          {canAccessMasuk && (
            <NavDropdown 
              title="Admin Barang Masuk" 
              items={adminMasukItems} 
              isOpen={openMasuk}
              onToggle={() => setOpenMasuk(!openMasuk)}
            />
          )}

          {/* Dropdown Admin Keluar */}
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
      
      {/* --- FOOTER LOGOUT --- */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          Logout ({userRole.replace(/_/g, ' ')})
        </button>
      </div>

    </div>
  );
}

export default Sidebar;