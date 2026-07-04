import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Lock, User } from 'lucide-react'; // Import icon

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Di sini nanti logika validasi ke backend.
    // Untuk sekarang, kita langsung arahkan ke dashboard.
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        
        {/* Header / Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Wifi size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">WiFi Management</h1>
          <p className="text-gray-500">Silakan login untuk masuk ke panel admin</p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Input Username */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border border-gray-300 p-3 pl-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="admin"
                required
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock size={20} className="text-gray-400" />
              </div>
              <input
                type="password"
                className="block w-full rounded-md border border-gray-300 p-3 pl-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Masuk
          </button>
        </form>

        {/* Footer Kecil */}
        <p className="mt-6 text-center text-sm text-gray-400">
          &copy; 2025 WiFi Project System
        </p>
      </div>
    </div>
  );
}

export default Login;