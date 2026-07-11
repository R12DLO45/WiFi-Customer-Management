import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Menu } from 'lucide-react'; // Import ikon Menu

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import TransactionHistory from './pages/TransactionHistory';
import Login from './pages/Login';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // LOGIKA DARK MODE
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Cek apakah user sebelumnya pakai dark mode
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    // Terapkan class 'dark' ke elemen <html> paling luar
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    // Background utama akan berubah jadi hitam kalau mode malam
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER KHUSUS HP (Muncul kalau layar kecil) */}
        <div className="md:hidden flex items-center bg-white dark:bg-gray-800 p-4 shadow-sm z-10 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="mr-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">WiFi Admin</h1>
        </div>

        {/* AREA KONTEN UTAMA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </div>
        
      </div>
    </div>
  );
};

function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
        {session ? (
          <>
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/users" element={<Layout><UserManagement /></Layout>} />
            <Route path="/transactions" element={<Layout><TransactionHistory /></Layout>} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;