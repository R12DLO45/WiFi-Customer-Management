import React, { useState, useEffect } from 'react';
import { Users, Wallet, Activity, ArrowUpRight, Clock, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({
    activeUsers: 0,
    todayIncome: 0,
    totalTransactions: 0
  });
  
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [chartData, setChartData] = useState([
    { day: '-', val: '0%', income: 0 }, { day: '-', val: '0%', income: 0 },
    { day: '-', val: '0%', income: 0 }, { day: '-', val: '0%', income: 0 },
    { day: '-', val: '0%', income: 0 }, { day: '-', val: '0%', income: 0 },
    { day: '-', val: '0%', income: 0 }
  ]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const { data: users, error: userError } = await supabase.from('pelanggan').select('status');
      const { data: transactions, error: trxError } = await supabase.from('transaksi').select('*').order('id', { ascending: false });

      if (userError || trxError) return;

      const activeCount = users?.filter(u => u.status === 'Active').length || 0;
      
      const getLocalDateString = (dateObj) => {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const todayDateString = getLocalDateString(new Date());
      const todayIncome = transactions
        ?.filter(t => t.date === todayDateString && t.status === 'Lunas')
        .reduce((total, t) => total + t.amount, 0) || 0;

      const totalTrx = transactions?.length || 0;
      const recent = transactions?.slice(0, 5) || []; 

      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7Days.push(d);
      }

      const dailyData = last7Days.map(dateObj => {
        const dateString = getLocalDateString(dateObj);
        const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(dateObj);
        const income = transactions
          ?.filter(t => t.date === dateString && t.status === 'Lunas')
          .reduce((sum, t) => sum + t.amount, 0) || 0;
        return { day: dayName, income };
      });

      const maxIncome = Math.max(...dailyData.map(d => d.income));
      
      const finalChartData = dailyData.map(d => ({
        day: d.day,
        val: maxIncome === 0 ? '0%' : `${Math.round((d.income / maxIncome) * 100)}%`, 
        income: d.income 
      }));

      setStats({ activeUsers: activeCount, todayIncome: todayIncome, totalTransactions: totalTrx });
      setRecentTransactions(recent);
      setChartData(finalChartData);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

  return (
    <div className="transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">Dashboard Overview</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Pantau performa bisnis WiFi Anda hari ini.</p>
        </div>
        <button 
          onClick={fetchDashboardData} 
          className="flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm w-fit"
        >
          <RefreshCw size={18} className={`mr-2 ${isLoading ? 'animate-spin text-blue-500' : ''}`} /> 
          Segarkan Data
        </button>
      </div>

      {/* --- KARTU STATISTIK --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between">
            <div className="z-10">
              <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">User Aktif</p>
              {isLoading ? (
                <div className="h-9 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-2"></div>
              ) : (
                <p className="text-4xl font-black text-gray-800 dark:text-white mt-2 transition-colors">{stats.activeUsers}</p>
              )}
            </div>
            <div className="rounded-full bg-blue-50 dark:bg-blue-900/30 p-4 text-blue-600 dark:text-blue-400 z-10"><Users size={28} /></div>
          </div>
          <div className="mt-5 flex items-center text-sm text-green-600 dark:text-green-400 font-medium z-10"><ArrowUpRight size={16} className="mr-1" />Data Realtime Database</div>
          <div className="absolute -right-6 -bottom-6 opacity-5 dark:opacity-10 text-blue-600 dark:text-blue-400"><Users size={120} /></div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between">
            <div className="z-10">
              <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Pendapatan Hari Ini</p>
              {isLoading ? (
                <div className="h-9 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-2"></div>
              ) : (
                <p className="text-3xl font-black text-gray-800 dark:text-white mt-2 transition-colors">{formatRupiah(stats.todayIncome)}</p>
              )}
            </div>
            <div className="rounded-full bg-green-50 dark:bg-green-900/30 p-4 text-green-600 dark:text-green-400 z-10"><Wallet size={28} /></div>
          </div>
          <div className="mt-5 flex items-center text-sm text-green-600 dark:text-green-400 font-medium z-10"><ArrowUpRight size={16} className="mr-1" />Pembayaran Masuk</div>
          <div className="absolute -right-6 -bottom-6 opacity-5 dark:opacity-10 text-green-600 dark:text-green-400"><Wallet size={120} /></div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between">
            <div className="z-10">
              <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Transaksi</p>
              {isLoading ? (
                <div className="h-9 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-2"></div>
              ) : (
                <p className="text-4xl font-black text-gray-800 dark:text-white mt-2 transition-colors">{stats.totalTransactions}</p>
              )}
            </div>
            <div className="rounded-full bg-purple-50 dark:bg-purple-900/30 p-4 text-purple-600 dark:text-purple-400 z-10"><Activity size={28} /></div>
          </div>
          <div className="mt-5 flex items-center text-sm text-gray-500 dark:text-gray-400 font-medium z-10">Riwayat tercatat</div>
          <div className="absolute -right-6 -bottom-6 opacity-5 dark:opacity-10 text-purple-600 dark:text-purple-400"><Activity size={120} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* --- GRAFIK --- */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2 transition-colors">
          <h3 className="font-bold text-gray-800 dark:text-white mb-6 flex items-center transition-colors"><Activity size={18} className="mr-2 text-blue-500 dark:text-blue-400"/> Tren Pendapatan (7 Hari)</h3>
          
          <div className="flex items-end justify-between gap-3 h-64 w-full px-2 mt-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex flex-col items-center w-full h-full justify-end group cursor-pointer relative">
                <div className="absolute -top-10 bg-gray-800 dark:bg-white text-white dark:text-gray-800 text-[10px] font-bold py-1.5 px-3 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-lg">
                  {formatRupiah(item.income)}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800 dark:border-t-white"></div>
                </div>
                <div className="w-full bg-blue-50 dark:bg-gray-700 rounded-t-lg relative h-full transition-colors"> 
                   <div 
                     className="absolute bottom-0 w-full bg-blue-500 dark:bg-blue-600 rounded-t-lg transition-all duration-700 ease-out group-hover:bg-blue-600 dark:group-hover:bg-blue-500" 
                     style={{ height: item.val }}
                   ></div>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-bold mt-3 capitalize transition-colors">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- LIST TRANSAKSI TERBARU --- */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <h3 className="font-bold text-gray-800 dark:text-white mb-6 flex items-center transition-colors"><Clock size={18} className="mr-2 text-blue-500 dark:text-blue-400"/> Transaksi Terbaru</h3>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-6">
                <RefreshCw className="animate-spin mx-auto text-blue-500 dark:text-blue-400 mb-2" size={24} />
                <p className="text-sm text-gray-400 font-medium">Memuat data...</p>
              </div>
            ) : recentTransactions.length > 0 ? (
              recentTransactions.map((trx) => (
                <div key={trx.id} className="flex items-center justify-between border-b border-gray-50 dark:border-gray-700 pb-4 last:border-0 last:pb-0 transition-colors">
                  <div className="flex items-center">
                    <div className="mr-3 rounded-full bg-green-50 dark:bg-green-900/30 p-2.5 text-green-600 dark:text-green-400"><Wallet size={16} /></div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100 transition-colors">{trx.name}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-0.5 transition-colors">{trx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-green-600 dark:text-green-400">+{formatRupiah(trx.amount)}</p>
                    {trx.duration > 1 && <span className="text-[9px] bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{trx.duration} Bln</span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-6 text-sm font-medium bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors">Belum ada transaksi di database.</div>
            )}
            
            <button 
              onClick={() => navigate('/transactions')} 
              className="w-full mt-4 py-3 text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-xl transition-all shadow-sm"
            >
              Lihat Semua Transaksi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;