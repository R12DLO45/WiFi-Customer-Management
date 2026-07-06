import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';

function Dashboard() {
  // State untuk mengontrol apakah sidebar terbuka (khusus mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fungsi toggle (buka/tutup)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      
      {/* 1. Panggil Component Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* 2. Konten Utama (Sebelah Kanan) */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Header Mobile (Hanya muncul di layar kecil / md:hidden) */}
        <header className="flex h-16 items-center bg-white px-4 shadow-sm md:hidden">
          <button onClick={toggleSidebar} className="text-gray-600 focus:outline-none">
            <Menu size={28} />
          </button>
          <span className="ml-4 text-lg font-semibold text-gray-800">Dashboard</span>
        </header>

        {/* Area Konten (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-6">
          
          {/* Contoh Konten Dashboard */}
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Selamat Datang, Admin!</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card Contoh 1 */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-gray-500">User Online</h3>
              <p className="text-3xl font-bold text-blue-600">24</p>
            </div>
            {/* Card Contoh 2 */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-gray-500">Total Voucher</h3>
              <p className="text-3xl font-bold text-green-600">150</p>
            </div>
             {/* Card Contoh 3 */}
             <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-gray-500">Pendapatan</h3>
              <p className="text-3xl font-bold text-purple-600">Rp 500.000</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default Dashboard;