import React from 'react';
import './Sidebar.css';
import { NavLink, useNavigate } from 'react-router-dom'; 

// Komponen NavItem (sudah benar)
const NavItem = ({ title, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
  >
    {title}
  </NavLink>
);

// Komponen NavSection (sudah benar)
const NavSection = ({ title, items }) => (
  <div className="nav-section">
    <h3>{title}</h3>
    {items.map((item) => (
      <NavItem key={item.title} title={item.title} to={item.to} />
    ))}
  </div>
);

function Sidebar() {
  const navigate = useNavigate();
  
  // --- INI ADALAH SAKLAR ROLE ANDA ---
  const userRole = 'pemilik'; // <-- Atur role di sini
  // ------------------------------------

  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/login');
  };
  
  // Path dashboard sudah unik (ini sudah benar)
  const adminMasukItems = [
    { title: 'Dashboard', to: '/dashboard-admin-masuk' }, 
    { title: 'Pengelolaan Data Sepatu Master', to: '/data-sepatu' },
    { title: 'Pengelolaan Data Master Size', to: '/data-size' },
    { title: 'Pengelolaan Paket Seri', to: '/paket-seri' },
    { title: 'Transaksi Sepatu Masuk', to: '/sepatu-masuk' },
    { title: 'Edit Transaksi Barang Masuk', to: '/edit-transaksi' },
  ];

  const adminKeluarItems = [
    { title: 'Dashboard', to: '/dashboard-admin-keluar' }, 
    { title: 'Transaksi Sepatu Keluar', to: '/sepatu-keluar' },
  ];

  const pemilikItems = [
    { title: 'Dashboard', to: '/dashboard-pemilik' }, 
    { title: 'Verifikasi Stok Barang', to: '/verifikasi-stok' },
    { title: 'Mencetak Laporan Stok', to: '/laporan-stok' },
    // --- (INI PERUBAHANNYA) ---
    { title: 'History Transaksi', to: '/history' }, 
    { title: 'Kelola Akses User', to: '/kelola-user' },
  ];

  return (
    <div className="sidebar">
      
      <h2>Manajemen Gudang</h2>
      
      <div className="sidebar-menu-wrapper">
        {(userRole === 'admin_masuk' || userRole === 'pemilik') && (
          <NavSection title="ADMIN BARANG MASUK" items={adminMasukItems} />
        )}
        
        {(userRole === 'admin_keluar' || userRole === 'pemilik') && (
          <NavSection title="ADMIN BARANG KELUAR" items={adminKeluarItems} />
        )}
        
        {userRole === 'pemilik' && (
          <NavSection title="PEMILIK" items={pemilikItems} />
        )}
      </div> 
      
      <a href="#" className="logout-link" onClick={handleLogout}>
       Logout (Login User)
      </a>
    </div>
  );
}

export default Sidebar;