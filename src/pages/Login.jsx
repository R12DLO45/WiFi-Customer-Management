import React, { useState } from 'react';
import { Wifi } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  
  // NILA AWAL EMAIL LANGSUNG DIISI DI SINI 👇
  const [email, setEmail] = useState('admin@wifi.com'); 
  
  // Password tetap kosong
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // Proses pencocokan ke database Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setErrorMsg('Password salah!');
      setIsLoading(false);
    } else {
      // Kalau sukses, langsung arahkan ke Dashboard
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Wifi size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">WiFi Management</h2>
          <p className="mt-1 text-sm text-gray-500">Silakan login untuk masuk ke panel admin</p>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600 border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Email / Username</label>
            <input
              type="email"
              required
              placeholder="admin@wifi.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-500 bg-gray-50 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-not-allowed"
              value={email}
              readOnly // Bikin inputnya nggak bisa dihapus/diganti orang iseng
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus // Kursor langsung otomatis kedip di sini pas halaman dibuka!
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-700 shadow-md ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Memeriksa...' : 'Masuk'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs font-medium text-gray-400">
          © 2026 WiFi Project System
        </p>
      </div>
    </div>
  );
}

export default Login;