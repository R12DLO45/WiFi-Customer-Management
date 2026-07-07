import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, X, Save } from 'lucide-react';

function UserManagement() {
  // 1. Data Awal Dummy
  const initialUsers = [
    { id: 1, name: 'Budi Santoso', code: 'V-8821', package: '2 Jam', status: 'Active', price: 'Rp 2.000' },
    { id: 2, name: 'Siti Aminah', code: 'V-9902', package: '24 Jam', status: 'Active', price: 'Rp 5.000' },
  ];

  // --- STATE ---
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Untuk buka/tutup modal
  
  // State untuk Form Tambah Data
  const [formData, setFormData] = useState({
    name: '',
    package: '2 Jam', // Default
  });

  // --- LOGIC ---

  // 1. Handle Input Form Berubah
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 2. Handle Simpan Data (Fake Submit)
  const handleSaveUser = (e) => {
    e.preventDefault();
    
    // Generate data dummy tambahan otomatis
    const newId = users.length + 1;
    const randomCode = 'V-' + Math.floor(1000 + Math.random() * 9000); // Kode acak
    const priceMap = { '2 Jam': 'Rp 2.000', '24 Jam': 'Rp 5.000', 'Mingguan': 'Rp 15.000', 'Bulanan': 'Rp 50.000' };
    
    const newUser = {
      id: newId,
      name: formData.name,
      code: randomCode,
      package: formData.package,
      status: 'Active', // Default aktif
      price: priceMap[formData.package] || 'Rp 0',
    };

    // Tambahkan ke state users (Data bertambah di tabel)
    setUsers([...users, newUser]);

    // Reset Form & Tutup Modal
    setFormData({ name: '', package: '2 Jam' });
    setIsModalOpen(false);
  };

  // 3. Filter Pencarian
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      
      {/* --- HEADER --- */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-sm text-gray-500">Kelola daftar pengguna WiFi</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} // Buka Modal
          className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          <Plus size={20} className="mr-2" />
          Tambah User
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
            placeholder="Cari nama user..."
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
                <th className="px-6 py-3">Nama User</th>
                <th className="px-6 py-3">Kode</th>
                <th className="px-6 py-3">Paket</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Harga</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 font-mono text-blue-600 whitespace-nowrap">{user.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.package}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.price}</td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <button className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL POPUP (Overlay) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          {/* Card Modal */}
          <div className="w-full max-w-md rounded-lg bg-white shadow-2xl">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-bold text-gray-800">Tambah User Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500">
                <X size={24} />
              </button>
            </div>

            {/* Body Modal (Form) */}
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              
              {/* Input Nama */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Nama Pelanggan</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Contoh: Asep Kopi"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              {/* Select Paket */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Pilih Paket</label>
                <select
                  name="package"
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  value={formData.package}
                  onChange={handleInputChange}
                >
                  <option value="2 Jam">Paket 2 Jam (Rp 2.000)</option>
                  <option value="24 Jam">Paket 24 Jam (Rp 5.000)</option>
                  <option value="Mingguan">Paket Mingguan (Rp 15.000)</option>
                  <option value="Bulanan">Paket Bulanan (Rp 50.000)</option>
                </select>
              </div>

              {/* Footer Modal (Tombol) */}
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
                  Simpan Data
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