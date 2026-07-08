import React from 'react';
import { Home, Users, ClipboardList, LogOut, X } from 'lucide-react'; // Ganti Wifi dengan ClipboardList
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { name: 'User Management', icon: <Users size={20} />, path: '/users' },
    // Menu baru: Riwayat Transaksi
    { name: 'Riwayat Transaksi', icon: <ClipboardList size={20} />, path: '/transactions' },
  ];

  return (
    <>
      {/* Overlay Gelap */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={toggleSidebar} 
        ></div>
      )}

      {/* Sidebar Utama */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out
        md:static md:translate-x-0 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        <div className="flex h-16 items-center justify-between border-b px-6">
          <h1 className="text-xl font-bold text-blue-600">WiFi Admin</h1>
          <button onClick={toggleSidebar} className="text-gray-500 md:hidden">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 space-y-2 px-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                navigate(item.path);
                toggleSidebar();
              }}
              className="flex w-full items-center rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

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