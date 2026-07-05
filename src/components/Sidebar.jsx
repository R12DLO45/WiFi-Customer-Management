import React from 'react';
import { Home, Users, Wifi, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  // Daftar menu agar kodenya lebih rapi (tidak hardcode berulang-ulang)
  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { name: 'User Management', icon: <Users size={20} />, path: '/users' }, // Nanti kita buat
    { name: 'WiFi Status', icon: <Wifi size={20} />, path: '/wifi' },       // Nanti kita buat
  ];

  return (
    <>
      {/* --- OVERLAY GELAP (Hanya muncul di Mobile saat menu terbuka) --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={toggleSidebar} 
        ></div>
      )}

      {/* --- SIDEBAR UTAMA --- */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out
        md:static md:translate-x-0 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Header Sidebar */}
        <div className="flex h-16 items-center justify-between border-b px-6">
          <h1 className="text-xl font-bold text-blue-600">WiFi Admin</h1>
          {/* Tombol Close (Hanya muncul di Mobile) */}
          <button onClick={toggleSidebar} className="text-gray-500 md:hidden">
            <X size={24} />
          </button>
        </div>

        {/* List Menu */}
        <nav className="mt-6 space-y-2 px-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)} // Pindah halaman
              className="flex w-full items-center rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Footer Sidebar (Logout) */}
        <div className="absolute bottom-0 w-full border-t p-4">
          <button 
            onClick={() => navigate('/')} 
            className="flex w-full items-center justify-center rounded-lg border border-red-500 py-2 text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;