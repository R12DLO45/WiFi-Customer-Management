import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

// Layout menerima "children", yaitu konten halaman (Dashboard/UserManagement)
const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      
      {/* Sidebar Global */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Area Konten Utama */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Header Mobile Global */}
        <header className="flex h-16 items-center bg-white px-4 shadow-sm md:hidden">
          <button onClick={toggleSidebar} className="text-gray-600 focus:outline-none">
            <Menu size={28} />
          </button>
          <span className="ml-4 text-lg font-semibold text-gray-800">Menu</span>
        </header>

        {/* Di sini konten halaman akan muncul */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;