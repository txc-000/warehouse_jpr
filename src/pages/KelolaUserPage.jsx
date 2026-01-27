import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// --- KOMPONEN MODAL INTERNAL (Disatukan agar pasti terbaca) ---
function ModalUserInternal({ initialData, onClose, onSave }) {
  const [formData, setFormData] = useState({
    username: '',    
    nama_staff: '', 
    password: '',
    role: 'ADMIN BARANG MASUK'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || '',
        nama_staff: initialData.nama_staff || '', 
        password: initialData.password || '',
        role: initialData.role || 'ADMIN BARANG MASUK'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', 
      alignItems: 'center', zIndex: 9999
    }}>
      <div className="form-container" style={{ 
        backgroundColor: 'white', padding: '30px', borderRadius: '12px', 
        width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' 
      }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
          {initialData ? '✏️ Edit User' : '➕ Tambah User Baru'}
        </h2>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          {/* 1. USERNAME (Paling Atas) */}
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Username (Login)</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          
          {/* 2. NAMA STAFF */}
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Nama Staff (Nama Asli)</label>
            <input type="text" name="nama_staff" value={formData.nama_staff} onChange={handleChange} required />
          </div>

          {/* 3. PASSWORD */}
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Password</label>
            <input type="text" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          {/* 4. ROLE */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="PEMILIK">PEMILIK</option>
              <option value="ADMIN BARANG MASUK">ADMIN BARANG MASUK</option>
              <option value="ADMIN BARANG KELUAR">ADMIN BARANG KELUAR</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="submit-button" style={{ flex: 1 }}>Simpan</button>
            <button type="button" onClick={onClose} style={{ 
              flex: 1, backgroundColor: '#f3f4f6', border: 'none', 
              borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
            }}>Batal</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- HALAMAN UTAMA ---
function KelolaUserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('users').select('*').order('id', { ascending: true });
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (formData) => {
    try {
      if (selectedUser) {
        // Update menggunakan ID database
        await supabase.from('users').update(formData).eq('id', selectedUser.id);
        alert("User diperbarui!");
      } else {
        // Simpan data baru
        await supabase.from('users').insert([formData]);
        alert("User baru ditambahkan!");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert("Gagal: " + err.message);
    }
  };

  const handleDelete = async (user) => {
    const konfirmasi = window.confirm(`Hapus user "${user.username}" secara permanen?`);
    if (konfirmasi) {
      try {
        await supabase.from('users').delete().eq('id', user.id);
        fetchUsers();
      } catch (err) {
        alert("Gagal hapus: " + err.message);
      }
    }
  };

  return (
    <div className="dashboard-content">
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Kelola Akses User</h1>
          <p>Manajemen staff gudang.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="submit-button" style={{ width: 'auto', padding: '10px 20px' }}>
          + Tambah User Staff
        </button>
      </header>

      <div className="tabel-container-full" style={{ marginTop: '20px' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '50px' }}>No</th>
              <th>Nama Staff</th>
              <th>Username</th>
              <th>Role</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {!loading && users.map((user, index) => (
              <tr key={user.id}>
                {/* NOMOR URUT VISUAL (index + 1) */}
                <td>{index + 1}</td>
                <td style={{ fontWeight: 'bold' }}>{user.nama_staff || '-'}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td style={{ textAlign: 'center' }}>
                  <button onClick={() => handleOpenModal(user)} style={{ color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', marginRight: '15px' }}>Edit</button>
                  <button onClick={() => handleDelete(user)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ModalUserInternal 
          initialData={selectedUser} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveUser} 
        />
      )}
    </div>
  );
}

export default KelolaUserPage;