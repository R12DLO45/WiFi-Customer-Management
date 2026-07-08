import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, Wifi, Wallet } from 'lucide-react';

function Dashboard() {
  
  // 1. Data Dummy untuk Grafik (Pendapatan Mingguan)
  const chartData = [
    { name: 'Sen', total: 45000 },
    { name: 'Sel', total: 30000 },
    { name: 'Rab', total: 60000 },
    { name: 'Kam', total: 55000 },
    { name: 'Jum', total: 80000 }, // Puncak keramaian (misal malam minggu)
    { name: 'Sab', total: 95000 },
    { name: 'Min', total: 70000 },
  ];

  // 2. Data Dummy Transaksi Terakhir
  const recentTransactions = [
    { id: 1, user: 'Budi Santoso', paket: '24 Jam', time: 'Baru saja', status: 'Lunas' },
    { id: 2, user: 'Siti Aminah', paket: 'Bulanan', time: '15 menit lalu', status: 'Pending' },
    { id: 3, user: 'Asep Kopi', paket: '2 Jam', time: '1 jam lalu', status: 'Lunas' },
    { id: 4, user: 'Dani Cell', paket: 'Mingguan', time: '2 jam lalu', status: 'Lunas' },
  ];

  // Helper Rupiah
  const formatRupiah = (val) => "Rp " + val.toLocaleString('id-ID');

  return (
    <div className="space-y-6">
      
      {/* --- HEADER --- */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-sm text-gray-500">Pantau performa bisnis WiFi Anda hari ini.</p>
      </div>

      {/* --- KARTU STATISTIK (Cards) --- */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: User Aktif */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">User Aktif</p>
              <h3 className="text-3xl font-bold text-gray-800">24</h3>
            </div>
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <Users size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUpRight size={16} className="mr-1" />
            <span>+12% dari kemarin</span>
          </div>
        </div>

        {/* Card 2: Pendapatan Hari Ini */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pendapatan Hari Ini</p>
              <h3 className="text-3xl font-bold text-gray-800">Rp 150.000</h3>
            </div>
            <div className="rounded-full bg-green-100 p-3 text-green-600">
              <Wallet size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUpRight size={16} className="mr-1" />
            <span>+8% dari kemarin</span>
          </div>
        </div>

        {/* Card 3: Voucher Terjual */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Voucher</p>
              <h3 className="text-3xl font-bold text-gray-800">1,240</h3>
            </div>
            <div className="rounded-full bg-purple-100 p-3 text-purple-600">
              <Wifi size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-red-500">
            <ArrowDownRight size={16} className="mr-1" />
            <span>-2% dari minggu lalu</span>
          </div>
        </div>
      </div>

      {/* --- AREA GRAFIK & TRANSAKSI --- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Kolom Kiri: GRAFIK (Lebar 2/3 layar di desktop) */}
        <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-lg font-bold text-gray-800">Tren Pendapatan (7 Hari)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                  formatter={(value) => formatRupiah(value)}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kolom Kanan: TRANSAKSI TERBARU (Lebar 1/3 layar) */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-800">Transaksi Terbaru</h3>
          <div className="space-y-4">
            {recentTransactions.map((trx) => (
              <div key={trx.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-gray-800">{trx.user}</p>
                  <p className="text-xs text-gray-500">{trx.paket} • {trx.time}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  trx.status === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {trx.status}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Lihat Semua Transaksi
          </button>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;