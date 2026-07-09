import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, X, Save, MapPin } from 'lucide-react';

function UserManagement() {
  // 1. Data Dummy Baru (Model ISP Rumahan)
  const initialUsers = [
    { id: 1, name: 'Pak Budi', address: 'Jl. Mawar No. 12', bandwidth: '10 Mbps', price: 'Rp 100.000', status: 'Active' },
    { id: 2, name: 'Bu Siti', address: 'Gg. Kancil RT 02', bandwidth: '20 Mbps', price: 'Rp 150.000', status: 'Active' },
    { id: 3, name: 'Warnet Asep', address: 'Ruko Depan Pasar', bandwidth: '50 Mbps', price: 'Rp 350.000', status: 'Non-Aktif' },
  ];

  // --- STATE ---
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State Form (Sekarang semua Input Manual)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    bandwidth: '',
    price: ''
  });

  // --- LOGIC ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    
    // Format Harga otomatis ada "Rp" depannya jika user lupa ngetik
    let finalPrice = formData.price;
    if (!finalPrice.toLowerCase().startsWith('rp')) {
      finalPrice = 'Rp ' + finalPrice;
    }

    const newUser = {
      id: users.length + 1,
      name: formData.name,
      address: formData.address,      // Data Alamat
      bandwidth: formData.bandwidth,  // Data Bandwidth
      price: finalPrice,              // Data Harga Manual
      status: 'Active',
    };

    setUsers([...users, newUser]);
    setFormData({ name: '', address: '', bandwidth: '', price: '' }); // Reset Form
    setIsModalOpen(false);
  };

  // Filter Pencarian (Berdasarkan Nama atau Alamat)
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      
      {/* --- HEADER --- */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Data Pelanggan</h2>
          <p className="text-sm text-gray-500">Kelola daftar pelanggan WiFi dan tagihan</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          <Plus size={20} className="mr-2" />
          Tambah Pelanggan
        </button>
      </div>

      {/* --- SEARCH --- */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama atau alamat..."
            className="block w-full rounded-md border border-gray-300 p-2.5 pl-10 focus:border-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="rounded-lg bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Nama Pelanggan</th>
                <th className="px-6 py-3">Alamat</th>
                <th className="px-6 py-3">Bandwidth</th>
                <th className="px-6 py-3">Tagihan Bulanan</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{user.name}</td>
                  {/* Kolom Alamat Baru */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1 text-gray-400" />
                      {user.address}
                    </div>
                  </td>
                  {/* Kolom Bandwidth Baru */}
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                    {user.bandwidth}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-700">{user.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'Active' ? 'Aktif' : 'Non-Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <button className="mr-3 text-blue-600 hover:text-blue-900"><Edit size={18} /></button>
                    <button className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL POPUP (Form Baru) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white shadow-2xl">
            
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-bold text-gray-800">Tambah Pelanggan Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              
              {/* Input Nama */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Nama Pelanggan</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Contoh: Pak Budi"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input Alamat (BARU) */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Alamat Pemasangan</label>
                <textarea
                  name="address"
                  required
                  rows="2"
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Contoh: Jl. Mawar No. 12, RT 01/RW 02"
                  value={formData.address}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Input Bandwidth (MANUAL) */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Paket Bandwidth</label>
                  <input
                    type="text"
                    name="bandwidth"
                    required
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                    placeholder="Cth: 10 Mbps"
                    value={formData.bandwidth}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Input Harga (MANUAL) */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Harga / Bulan</label>
                  <input
                    type="text"
                    name="price"
                    required
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                    placeholder="Cth: 100.000"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  <Save size={18} className="mr-2" />
                  Simpan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;