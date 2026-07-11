import React from 'react';
import { Home, Users, ClipboardList, LogOut, X, Moon, Sun } from 'lucide-react'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 

const Sidebar = ({ isOpen, toggleSidebar, isDarkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Untuk mendeteksi halaman aktif

  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/' }, 
    { name: 'User Management', icon: <Users size={20} />, path: '/users' },
    { name: 'Riwayat Transaksi', icon: <ClipboardList size={20} />, path: '/transactions' },
  ];

  const handleLogout = async () => {
    if (window.confirm('Yakin ingin keluar dari panel admin?')) {
      await supabase.auth.signOut();
    }
  };

  return (
    <>
      {/* Overlay Gelap di HP */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm transition-opacity"
          onClick={toggleSidebar} 
        ></div>
      )}

      {/* Sidebar Utama */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out
        bg-white dark:bg-gray-800 shadow-2xl md:static md:translate-x-0 md:w-64 md:shadow-xl
        border-r border-gray-100 dark:border-gray-700
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Header Sidebar */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 dark:border-gray-700 px-6">
          <h1 className="text-xl font-black tracking-tight text-blue-600 dark:text-blue-400">WiFi Admin</h1>
          <button onClick={toggleSidebar} className="text-gray-400 hover:text-red-500 md:hidden bg-gray-50 dark:bg-gray-700 rounded-lg p-1.5 transition">
            <X size={20} />
          </button>
        </div>

        {/* Menu Navigasi */}
        <nav className="mt-6 flex-1 space-y-2 px-4 h-[calc(100vh-200px)] overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  toggleSidebar(); // Otomatis tutup sidebar kalau di HP
                }}
                className={`
                  flex w-full items-center rounded-xl px-4 py-3.5 transition-all font-medium
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-md dark:bg-blue-600' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-white'
                  }
                `}
              >
                <span className={`mr-3 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-400'}`}>
                  {item.icon}
                </span>
                {item.name}
              </button>
            )
          })}
        </nav>

        {/* Bagian Bawah (Toggle Mode & Logout) */}
        <div className="absolute bottom-0 w-full border-t border-gray-100 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          
          {/* Toggle Dark Mode */}
          <button 
            onClick={toggleDarkMode}
            className="flex w-full items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-700 px-4 py-3 mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
          >
            <span className="flex items-center">
              {isDarkMode ? <Moon size={18} className="mr-2 text-indigo-400" /> : <Sun size={18} className="mr-2 text-orange-400" />}
              {isDarkMode ? 'Mode Gelap' : 'Mode Terang'}
            </span>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-indigo-500' : 'bg-gray-300'}`}>
               <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isDarkMode ? 'left-5' : 'left-0.5'}`}></div>
            </div>
          </button>

          {/* Tombol Logout */}
          <button 
            onClick={handleLogout} 
            className="flex w-full items-center justify-center rounded-xl border-2 border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-500/10 py-3 text-sm font-bold text-red-600 dark:text-red-400 transition hover:bg-red-100 dark:hover:bg-red-500/20"
          >
            <LogOut size={18} className="mr-2" />
            Keluar Sistem
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;