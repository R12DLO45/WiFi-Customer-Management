import React, { useState, useEffect } from 'react';
import { Search, ArrowDownLeft, Printer, RefreshCw, Edit, Trash2, X, Save, Calendar, Filter } from 'lucide-react';
import { supabase } from '../supabaseClient';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ id: null, date: '', amount: '', duration: 1, name: '' });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const fetchTransactions = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('transaksi').select('*').order('id', { ascending: false });
    if (!error) setTransactions(data || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Hapus transaksi dari ${name}? Data tidak bisa dikembalikan!`)) {
      const { error } = await supabase.from('transaksi').delete().eq('id', id);
      if (!error) setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const openEditModal = (trx) => {
    setEditData({ id: trx.id, date: trx.date, amount: trx.amount, duration: trx.duration || 1, name: trx.name });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('transaksi').update({ date: editData.date, amount: parseInt(editData.amount), duration: parseInt(editData.duration) }).eq('id', editData.id);
    if (!error) {
      setTransactions(transactions.map(t => t.id === editData.id ? { ...t, date: editData.date, amount: parseInt(editData.amount), duration: parseInt(editData.duration) } : t));
      setIsEditModalOpen(false);
    }
  };

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  
  const getBillingPeriod = (trx) => {
    if (!trx.date) return '-';
    if (trx.duration && trx.duration > 1) return `${trx.duration} Bulan`;
    return new Date(trx.date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  const handlePrint = (trx) => {
    const rawDate = trx.date ? trx.date.replaceAll('-', '') : '000000';
    const transactionID = `TRX-${rawDate}-${String(trx.id).slice(-3)}`;
    const printWindow = window.open('', '', 'width=400,height=700');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Struk - ${trx.name}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; padding: 20px; color: #000; font-size: 12px; max-width: 320px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 15px; border-bottom: 2px dashed #000; padding-bottom: 15px; }
            .header h2 { margin: 0 0 5px 0; font-size: 20px; font-weight: 900; letter-spacing: 1px; }
            .header p { margin: 3px 0; font-size: 11px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 6px; }
            .label { font-weight: bold; color: #333; }
            .value { text-align: right; max-width: 65%; word-wrap: break-word; }
            .divider { border-bottom: 1px dashed #000; margin: 12px 0; }
            .section-title { font-weight: 900; text-transform: uppercase; margin-bottom: 8px; font-size: 11px; }
            .total-box { border-top: 2px dashed #000; border-bottom: 2px dashed #000; padding: 12px 0; margin: 15px 0; text-align: center; background-color: #f9f9f9; -webkit-print-color-adjust: exact; }
            .total-text { font-size: 22px; font-weight: 900; margin-top: 5px; }
            .lunas-stamp { border: 3px solid #000; padding: 6px 24px; font-weight: 900; display: inline-block; transform: rotate(-5deg); border-radius: 6px; font-size: 18px; letter-spacing: 3px; margin-top: 10px; }
            .footer { text-align: center; margin-top: 25px; font-size: 11px; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>"RAHMA" CELLULER</h2>
            <p>Jl. Slamet Riyadi No.100 C, Semen, Kediri</p>
            <p>WA: 0856-4881-9661</p>
          </div>

          <div class="row"><span class="label">No. TRX</span><span class="value"><b>${transactionID}</b></span></div>
          <div class="row"><span class="label">Tanggal</span><span class="value">${trx.date}</span></div>
          <div class="row"><span class="label">Admin</span><span class="value">Arifin</span></div>
          
          <div class="divider"></div>
          
          <div class="section-title">Data Pelanggan</div>
          <div class="row"><span class="label">Nama</span><span class="value" style="text-transform: uppercase;"><b>${trx.name}</b></span></div>
          <div class="row"><span class="label">Alamat</span><span class="value">${trx.address}</span></div>
          
          <div class="divider"></div>
          
          <div class="section-title">Detail Layanan</div>
          <div class="row"><span class="label">Paket Internet</span><span class="value">${trx.bandwidth}</span></div>
          <div class="row"><span class="label">Periode Aktif</span><span class="value">${getBillingPeriod(trx)}</span></div>
          
          <div class="total-box">
            <div style="font-size: 11px; font-weight: bold;">TOTAL TAGIHAN (${trx.duration || 1} BLN)</div>
            <div class="total-text">${formatRupiah(trx.amount)}</div>
          </div>
          
          <div style="text-align: center;">
            <div class="lunas-stamp">LUNAS</div>
          </div>
          
          <div class="footer">
            <p><b>Terima Kasih!</b><br>Koneksi lancar, rezeki mengalir.</p>
            <p style="font-size: 9px; margin-top: 10px;">-- Harap simpan struk ini sebagai bukti --</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  const filteredData = transactions.filter((item) => {
    const trxDate = new Date(item.date);
    const matchMonth = selectedMonth === 'all' || String(trxDate.getMonth() + 1).padStart(2, '0') === selectedMonth;
    const matchYear = selectedYear === 'all' || String(trxDate.getFullYear()) === selectedYear;
    return item.name.toLowerCase().includes(searchTerm.toLowerCase()) && matchMonth && matchYear;
  });

  return (
    <div className="relative transition-colors duration-300">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Riwayat Pembayaran</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Rekap dan filter tagihan pelanggan</p>
        </div>
        <button onClick={fetchTransactions} className="flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          <RefreshCw size={20} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* KOTAK PENDAPATAN */}
      <div className="mb-6 grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
        <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 shadow-sm border border-green-200 dark:border-green-800/50 lg:col-span-1 transition-colors">
          <div className="flex items-center text-green-700 dark:text-green-500 mb-2">
            <div className="bg-white dark:bg-green-900/50 p-2 rounded-lg mr-3 shadow-sm"><ArrowDownLeft size={24} /></div>
            <span className="font-bold">Total Pendapatan</span>
          </div>
          <p className="text-3xl font-black text-green-800 dark:text-green-400 mt-3">{formatRupiah(filteredData.reduce((acc, curr) => acc + curr.amount, 0))}</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-3 transition-colors">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Search size={20} className="text-gray-400" /></div>
          <input type="text" placeholder="Cari pelanggan..." className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white p-2.5 pl-10 focus:border-blue-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Calendar size={18} className="text-gray-400" /></div>
            <select className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white p-2.5 pl-10 pr-8 text-sm outline-none" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option value="all">Semua Bulan</option>
              {['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].map((m, i) => <option key={i} value={String(i+1).padStart(2,'0')}>{m}</option>)}
            </select>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Filter size={18} className="text-gray-400" /></div>
            <select className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white p-2.5 pl-10 pr-8 text-sm outline-none" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="all">Semua Tahun</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4">Tanggal</th><th className="px-6 py-4">Pelanggan</th><th className="px-6 py-4">Paket</th><th className="px-6 py-4">Nominal</th><th className="px-6 py-4 text-center">Aksi / Cetak</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" className="text-center py-10"><RefreshCw className="animate-spin mx-auto mb-3 text-blue-500" size={28} /></td></tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((trx) => (
                  <tr key={trx.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">{trx.date}</td>
                    <td className="px-6 py-4"><div className="font-bold text-gray-900 dark:text-white">{trx.name}</div><div className="text-xs text-gray-400 max-w-[200px] truncate">{trx.address}</div></td>
                    <td className="px-6 py-4 text-blue-600 dark:text-blue-400 font-bold">{trx.bandwidth}</td>
                    <td className="px-6 py-4 font-black text-gray-800 dark:text-gray-100">{formatRupiah(trx.amount)} {trx.duration > 1 && <span className="ml-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded text-[10px]">{trx.duration} Bln</span>}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handlePrint(trx)} className="rounded-lg bg-green-50 dark:bg-green-900/20 p-2 text-green-600 dark:text-green-400 hover:bg-green-600 dark:hover:bg-green-500 hover:text-white"><Printer size={18} /></button>
                        <button onClick={() => openEditModal(trx)} className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(trx.id, trx.name)} className="rounded-lg bg-red-50 dark:bg-red-900/20 p-2 text-red-600 dark:text-red-400 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (<tr><td colSpan="5" className="text-center py-10">Tidak ada transaksi.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL EDIT */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden border dark:border-gray-700">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Edit Darurat</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm font-bold text-gray-600 dark:text-gray-300">User: {editData.name}</div>
              <div><label className="mb-1 block text-sm font-semibold dark:text-gray-300">Tanggal</label><input type="date" required className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white p-2.5 outline-none focus:border-blue-500 border" value={editData.date} onChange={(e) => setEditData({...editData, date: e.target.value})} /></div>
              <div><label className="mb-1 block text-sm font-semibold dark:text-gray-300">Durasi</label><input type="number" min="1" required className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white p-2.5 outline-none focus:border-blue-500 border" value={editData.duration} onChange={(e) => setEditData({...editData, duration: e.target.value})} /></div>
              <div><label className="mb-1 block text-sm font-semibold dark:text-gray-300">Nominal</label><input type="number" required className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white p-2.5 outline-none focus:border-blue-500 border font-bold" value={editData.amount} onChange={(e) => setEditData({...editData, amount: e.target.value})} /></div>
              <div className="mt-6 flex gap-3 pt-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 border-gray-300 dark:border-gray-600 dark:text-gray-300 border py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Batal</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-bold"><Save size={18} className="mr-2 inline"/> Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionHistory;