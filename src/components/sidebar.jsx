import React from 'react';
import './Sidebar.css';
import { NavLink, useNavigate } from 'react-router-dom'; // <-- UBAH BARIS INI

// 2. Ubah NavItem agar menggunakan NavLink
const NavItem = ({ title, to }) => (
  <NavLink
    to={to}
    // Ini akan otomatis menambahkan class 'active' jika URL-nya cocok
    className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
  >
    {title}
  </NavLink>
);

// Komponen helper untuk grup navigasi
const NavSection = ({ title, items }) => (
  <div className="nav-section">
    <h3>{title}</h3>
    {items.map((item) => (
      // 3. Pastikan 'to' prop diteruskan
      <NavItem key={item.title} title={item.title} to={item.to} />
    ))}
  </div>
);

function Sidebar() {
  const navigate = useNavigate();
  
  const handleLogout = (e) => {
    e.preventDefault();
    // Kirim user kembali ke halaman login
    navigate('/login');
  };
  // 4. Tambahkan properti 'to' (URL tujuan) ke data kita
  const adminMasukItems = [
    { title: 'Pengelolaan Data Sepatu Master', to: '/data-sepatu' },
    { title: 'Pengelolaan Data Master Size', to: '/data-size' },
    { title: 'Transaksi Sepatu Masuk', to: '/sepatu-masuk' },
    { title: 'Edit Transaksi Barang Masuk', to: '/edit-transaksi' },
  ];

  const adminKeluarItems = [
    { title: 'Transaksi Sepatu Keluar', to: '/sepatu-keluar' },
  ];

  const pemilikItems = [
    { title: 'Verifikasi Stok Barang', to: '/verifikasi-stok' },
    { title: 'Mencetak Laporan Stok', to: '/laporan-stok' },
    { title: 'Kelola Akses User', to: '/kelola-user' },
  ];

  return (
    <div className="sidebar">
      <h2>Manajemen Gudang</h2>
      
      <NavSection title="ADMIN BARANG MASUK" items={adminMasukItems} />
      <NavSection title="ADMIN BARANG KELUAR" items={adminKeluarItems} />
      <NavSection title="PEMILIK" items={pemilikItems} />

    <a href="#" className="logout-link" onClick={handleLogout}>
       Logout (Login User)
    </a>
    </div>
  );
}

export default Sidebar;