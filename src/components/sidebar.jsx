import React from 'react';
import './Sidebar.css';
import { NavLink, useNavigate } from 'react-router-dom'; 

// Komponen NavItem
const NavItem = ({ title, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
  >
    {title}
  </NavLink>
);

// Komponen NavSection (Mendukung fitur lipat/collapsible)
const NavSection = ({ title, items, collapsible = false }) => {
  if (collapsible) {
    return (
      <details className="nav-details">
        <summary className="nav-summary">{title}</summary>
        {items.map((item) => (
          <NavItem key={item.title} title={item.title} to={item.to} />
        ))}
      </details>
    );
  }

  return (
    <div className="nav-section">
      <h3>{title}</h3>
      {items.map((item) => (
        <NavItem key={item.title} title={item.title} to={item.to} />
      ))}
    </div>
  );
};

function Sidebar() {
  const navigate = useNavigate();
  
  // --- SAKLAR ROLE ---
  const userRole = 'pemilik'; 
  // -------------------

  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/login');
  };
  
  // --- DAFTAR MENU ---

  const adminMasukItems = [
    { title: 'Dashboard', to: '/dashboard-admin-masuk' },
    { title: 'Info Stok & Harga', to: '/info-stok' },
    { title: 'Pengelolaan Data Sepatu Master', to: '/data-sepatu' },
    { title: 'Pengelolaan Data Master Size', to: '/data-size' },
    { title: 'Pengelolaan Paket Seri', to: '/paket-seri' },
    { title: 'Transaksi Sepatu Masuk', to: '/sepatu-masuk' },
    { title: 'Edit Transaksi Barang Masuk', to: '/edit-transaksi' },
  ];

  const adminKeluarItems = [
    { title: 'Dashboard', to: '/dashboard-admin-keluar' },
    { title: 'Info Stok & Harga', to: '/info-stok' },
    { title: 'Transaksi Sepatu Keluar', to: '/sepatu-keluar' },
  ];

  // --- MENU PEMILIK LENGKAP NAMUN TETAP RAPI ---
  const pemilikItems = [
    { title: 'Dashboard', to: '/dashboard-pemilik' },
    
    // Menu Penting yang Anda Minta:
    { title: 'Atur Harga Barang', to: '/atur-harga' }, 
    { title: 'Info Stok & Harga', to: '/info-stok' },
    
    { title: 'Verifikasi Stok Barang', to: '/verifikasi-stok' },
    { title: 'Mencetak Laporan Stok', to: '/laporan-stok' },
    { title: 'History Transaksi', to: '/history' }, 
    { title: 'Kelola Akses User', to: '/kelola-user' },
  ];

  return (
    <div className="sidebar">
      
      <h2>Manajemen Gudang</h2>
      
      <div className="sidebar-menu-wrapper">
        
        {/* 1. MENU PEMILIK (Selalu Terbuka & Lengkap) */}
        {userRole === 'pemilik' && (
          <NavSection title="MENU PEMILIK" items={pemilikItems} />
        )}

        {/* 2. MENU ADMIN MASUK (Dilipat jika Pemilik agar Simple) */}
        {(userRole === 'admin_masuk' || userRole === 'pemilik') && (
          <NavSection 
            title="ADMIN BARANG MASUK" 
            items={adminMasukItems} 
            collapsible={userRole === 'pemilik'} 
          />
        )}
        
        {/* 3. MENU ADMIN KELUAR (Dilipat jika Pemilik agar Simple) */}
        {(userRole === 'admin_keluar' || userRole === 'pemilik') && (
          <NavSection 
            title="ADMIN BARANG KELUAR" 
            items={adminKeluarItems} 
            collapsible={userRole === 'pemilik'} 
          />
        )}
        
      </div> 
      
      <a href="#" className="logout-link" onClick={handleLogout}>
       Logout (Login User)
      </a>
    </div>
  );
}

export default Sidebar;