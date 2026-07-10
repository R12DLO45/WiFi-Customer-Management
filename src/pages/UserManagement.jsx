import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Save, MapPin, Wallet, RotateCcw } from 'lucide-react'; // Tambah icon RotateCcw

function UserManagement() {
  // Data Dummy Awal
  const initialUsers = [
    { id: 1, name: 'Pak Budi', address: 'Jl. Mawar No. 12', bandwidth: '10 Mbps', price: 'Rp 100.000', status: 'Active' },
    { id: 2, name: 'Bu Siti', address: 'Gg. Kancil RT 02', bandwidth: '20 Mbps', price: 'Rp 150.000', status: 'Active' },
    { id: 3, name: 'Warnet Asep', address: 'Ruko Depan Pasar', bandwidth: '50 Mbps', price: 'Rp 350.000', status: 'Non-Active' },
  ];

  // --- LOGIC AUTO-SAVE ---
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('demo_users');
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });

  useEffect(() => {
    localStorage.setItem('demo_users', JSON.stringify(users));
  }, [users]);

  // --- LOGIC RESET DATA (BARU) ---
  const handleResetData = () => {
    if (window.confirm('⚠ Yakin ingin mereset data ke awal?\nSemua data inputan baru akan dihapus!')) {
      // Hapus memori User dan Transaksi
      localStorage.removeItem('demo_users');
      localStorage.removeItem('demo_transactions');
      // Reload halaman otomatis
      window.location.reload();
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payData, setPayData] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', address: '', bandwidth: '', price: '' });
  const [currentStatus, setCurrentStatus] = useState('Non-Active');

  // Helper
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID').format(num);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setFormData({ name: '', address: '', bandwidth: '', price: '' });
    setIsModalOpen(true);
  };

  const handleEditClick = (user) => {
    setIsEditing(true);
    setCurrentId(user.id);
    setCurrentStatus(user.status);
    const cleanBandwidth = user.bandwidth.replace(/[^0-9]/g, ''); 
    const cleanPrice = user.price.replace(/[^0-9]/g, '');
    setFormData({ name: user.name, address: user.address, bandwidth: cleanBandwidth, price: cleanPrice });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Hapus pelanggan ini?')) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    const finalBandwidth = `${formData.bandwidth} Mbps`;
    const finalPrice = `Rp ${formatRupiah(formData.price)}`;

    if (isEditing) {
      const updatedUsers = users.map((user) => 
        user.id === currentId ? { ...user, name: formData.name, address: formData.address, bandwidth: finalBandwidth, price: finalPrice, status: currentStatus } : user
      );
      setUsers(updatedUsers);
    } else {
      const newUser = {
        id: Date.now(),
        name: formData.name,
        address: formData.address, bandwidth: finalBandwidth, price: finalPrice, status: 'Non-Active',
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  const handlePayClick = (user) => {
    setPayData(user);
    setIsPayModalOpen(true);
  };

  const handleProcessPayment = () => {
    const updatedUsers = users.map((u) => u.id === payData.id ? { ...u, status: 'Active' } : u);
    setUsers(updatedUsers);

    const newTransaction = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      name: payData.name,
      address: payData.address,
      bandwidth: payData.bandwidth,
      amount: parseInt(payData.price.replace(/[^0-9]/g, '')), 
      status: 'Lunas'
    };

    const existingHistory = JSON.parse(localStorage.getItem('demo_transactions') || '[]');
    localStorage.setItem('demo_transactions', JSON.stringify([newTransaction, ...existingHistory]));

    alert(`Pembayaran Sukses!`);
    setIsPayModalOpen(false);
    setPayData(null);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Data Pelanggan</h2>
          <p className="text-sm text-gray-500">Kelola daftar pelanggan, status, dan pembayaran</p>
        </div>
        <div className="flex gap-2">
          {/* TOMBOL RESET (BARU) */}
          <button 
            onClick={handleResetData}
            className="flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-600 hover:bg-red-100 transition"
            title="Reset Data ke Default (Hapus semua perubahan)"
          >
            <RotateCcw size={20} className="mr-2" />
            Reset Demo
          </button>

          <button onClick={handleAddNew} className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">
            <Plus size={20} className="mr-2" /> Tambah
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Search size={20} className="text-gray-400" /></div>
          <input type="text" placeholder="Cari nama atau alamat..." className="block w-full rounded-md border border-gray-300 p-2.5 pl-10 focus:border-blue-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-lg bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Nama Pelanggan</th>
                <th className="px-6 py-3">Alamat</th>
                <th className="px-6 py-3">Bandwidth</th>
                <th className="px-6 py-3">Tagihan</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><MapPin size={16} className="mr-1 text-gray-400" />{user.address}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">{user.bandwidth}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-700">{user.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status === 'Active' ? 'Aktif' : 'Non-Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {user.status !== 'Active' && (
                      <button onClick={() => handlePayClick(user)} className="mr-3 text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-full hover:bg-green-100 transition animate-pulse" title="Bayar">
                        <Wallet size={18} />
                      </button>
                    )}
                    <button onClick={() => handleEditClick(user)} className="mr-3 text-blue-600 hover:text-blue-900"><Edit size={18} /></button>
                    <button onClick={() => handleDeleteClick(user.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL INPUT/EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-bold text-gray-800">{isEditing ? 'Edit Data' : 'Tambah Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium mb-1">Nama</label><input type="text" name="name" required className="w-full border p-2 rounded outline-none focus:border-blue-500" value={formData.name} onChange={handleInputChange} /></div>
              <div><label className="block text-sm font-medium mb-1">Alamat</label><textarea name="address" required className="w-full border p-2 rounded outline-none focus:border-blue-500" rows="2" value={formData.address} onChange={handleInputChange}></textarea></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Paket</label><div className="relative"><input type="number" name="bandwidth" required className="w-full border p-2 rounded outline-none focus:border-blue-500 pr-12" placeholder="10" value={formData.bandwidth} onChange={handleInputChange} /><span className="absolute right-3 top-2 text-gray-500 text-sm">Mbps</span></div></div>
                <div><label className="block text-sm font-medium mb-1">Harga</label><div className="relative"><span className="absolute left-3 top-2 text-gray-500 text-sm">Rp</span><input type="number" name="price" required className="w-full border p-2 rounded outline-none focus:border-blue-500 pl-10" placeholder="100000" value={formData.price} onChange={handleInputChange} /></div></div>
              </div>
              <div className="mt-6 flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Batal</button>
                <button type="submit" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"><Save size={18} className="mr-2" /> Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PEMBAYARAN */}
      {isPayModalOpen && payData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-2xl overflow-hidden">
            <div className="bg-green-600 p-4 text-white"><h3 className="text-lg font-bold flex items-center"><Wallet className="mr-2" /> Konfirmasi Pembayaran</h3></div>
            <div className="p-6">
              <p className="text-gray-500 text-sm mb-4">Terima pembayaran?</p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 mb-6 border border-gray-100">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Pelanggan:</span><span className="font-bold text-gray-800">{payData.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Paket:</span><span className="font-medium text-blue-600">{payData.bandwidth}</span></div>
                <div className="border-t border-dashed border-gray-300 my-2"></div>
                <div className="flex justify-between text-lg"><span className="font-bold text-gray-700">Total:</span><span className="font-bold text-green-600">{payData.price}</span></div>
              </div>
              <div className="flex gap-3"><button onClick={() => setIsPayModalOpen(false)} className="flex-1 border py-2 rounded hover:bg-gray-50">Batal</button><button onClick={handleProcessPayment} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold shadow-md">Terima Uang</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;