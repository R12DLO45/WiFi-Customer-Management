import React from 'react';
import { Plus } from 'lucide-react';

function UserManagement() {
  return (
    <div>
      {/* Header Halaman */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <button className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <Plus size={20} className="mr-2" />
          Tambah User
        </button>
      </div>

      {/* Area Tabel Dummy */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <p className="text-gray-500">Tabel User akan muncul di sini nanti.</p>
      </div>
    </div>
  );
}

export default UserManagement;