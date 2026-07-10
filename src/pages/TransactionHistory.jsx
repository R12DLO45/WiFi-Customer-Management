import React, { useState, useEffect } from 'react';
import { Search, ArrowDownLeft, AlertCircle, Printer } from 'lucide-react';

function TransactionHistory() {
  // --- BAGIAN INI NANTI TINGGAL DIHAPUS SAAT CONNECT DB ---
  const starterPackData = [
    { id: 1, date: '2025-10-12', name: 'Pak Budi', address: 'Jl. Mawar No. 12', bandwidth: '10 Mbps', amount: 100000, status: 'Lunas' },
    { id: 2, name: 'Bu Siti', address: 'Gg. Kancil RT 02', bandwidth: '20 Mbps', amount: 150000, status: 'Belum Bayar' },
    { id: 3, date: '2025-10-11', name: 'Warnet Asep', address: 'Ruko Pasar', bandwidth: '50 Mbps', amount: 350000, status: 'Lunas' },
  ];
  // -------------------------------------------------------

  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // --- LOGIC PINTAR (LOAD DATA) ---
  useEffect(() => {
    // 1. Coba ambil data dari penyimpanan
    const savedData = localStorage.getItem('demo_transactions');

    if (savedData) {
      // A. Kalau sudah ada data (entah inputan baru atau sisa demo), pakai itu
      setTransactions(JSON.parse(savedData));
    } else {
      // B. Kalau kosong (pengguna baru), ISI DENGAN STARTER PACK (Dummy)
      // Supaya pas demo nggak kosong melompong
      localStorage.setItem('demo_transactions', JSON.stringify(starterPackData));
      setTransactions(starterPackData);
    }
    
    // Listener biar kalau di-reset dari halaman sebelah, sini ikut berubah
    const handleStorageChange = () => {
      const newData = localStorage.getItem('demo_transactions');
      setTransactions(newData ? JSON.parse(newData) : starterPackData);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- LOGIC TAMPILAN (SAMA KAYAK SEBELUMNYA) ---
  
  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  
  const getBillingPeriod = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
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
            body { font-family: 'Courier New', monospace; padding: 20px; color: #000; font-size: 12px; }
            .header { text-align: center; margin-bottom: 15px; border-bottom: 2px dashed #000; padding-bottom: 10px; }
            .header h2 { margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; }
            .header p { margin: 2px 0; font-size: 10px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 3px; }
            .label { font-weight: bold; }
            .divider { border-bottom: 1px dashed #000; margin: 10px 0; }
            .total-box { border-top: 2px dashed #000; border-bottom: 2px dashed #000; padding: 8px 0; margin: 10px 0; text-align: center; }
            .total-text { font-size: 18px; font-weight: bold; }
            .lunas-stamp { border: 3px solid #000; padding: 5px 20px; font-weight: 900; display: inline-block; margin-top: 10px; transform: rotate(-5deg); border-radius: 8px; }
            .footer { text-align: center; margin-top: 30px; font-size: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>"RAHMA" CELLULER</h2>
            <p>Jl. Slamet Riyadi No.100 C, Semen, Kediri</p>
            <p>WA: +62 856-4881-9661</p>
          </div>
          <div style="margin-bottom: 10px;">
            <div class="row"><span class="label">ID Transaksi</span><span>${transactionID}</span></div>
            <div class="row"><span class="label">Tanggal</span><span>${trx.date || 'Hari Ini'}</span></div>
            <div class="row"><span class="label">Periode</span><span>${getBillingPeriod(trx.date)}</span></div>
          </div>
          <div class="divider"></div>
          <div style="margin-bottom: 10px;">
            <div class="row"><span class="label">Pelanggan</span><span style="text-transform: uppercase;">${trx.name}</span></div>
            <div class="row"><span class="label">Alamat</span><span style="font-size: 10px; max-width: 150px; text-align:right;">${trx.address}</span></div>
          </div>
          <div class="divider"></div>
          <div style="display: flex; justify-content: space-between; font-weight: bold; margin: 15px 0;">
            <span>Paket ${trx.bandwidth}</span><span>${formatRupiah(trx.amount)}</span>
          </div>
          <div class="total-box">
            <div>Total Tagihan (All-in)</div>
            <div class="total-text">${formatRupiah(trx.amount)}</div>
          </div>
          <div style="text-align: center;"><div class="lunas-stamp">LUNAS</div></div>
          <div class="footer"><p>Harap simpan struk ini sebagai bukti pembayaran yang sah</p></div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  const filteredData = transactions.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Riwayat Pembayaran</h2>
        <p className="text-sm text-gray-500">Rekap tagihan bulanan pelanggan</p>
      </div>

      {/* Ringkasan */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-green-50 p-4 border border-green-100">
          <div className="flex items-center text-green-700"><ArrowDownLeft size={20} className="mr-2" /><span className="font-semibold">Lunas Bulan Ini</span></div>
          <p className="mt-2 text-2xl font-bold text-gray-800">
            {formatRupiah(transactions.filter(t => t.status === 'Lunas').reduce((acc, curr) => acc + curr.amount, 0))}
          </p>
        </div>
        <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-100">
          <div className="flex items-center text-yellow-700"><AlertCircle size={20} className="mr-2" /><span className="font-semibold">Belum Bayar (Piutang)</span></div>
          <p className="mt-2 text-2xl font-bold text-gray-800">
            {formatRupiah(transactions.filter(t => t.status === 'Belum Bayar').reduce((acc, curr) => acc + curr.amount, 0))}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Search size={18} className="text-gray-400" /></div>
          <input type="text" placeholder="Cari nama pelanggan..." className="block w-full rounded-md border border-gray-300 p-2 pl-10 focus:border-blue-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* Tabel */}
      <div className="rounded-lg bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Pelanggan</th>
                <th className="px-6 py-3">Paket</th>
                <th className="px-6 py-3">Nominal</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Cetak</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((trx) => (
                  <tr key={trx.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{trx.date || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{trx.name}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[150px]">{trx.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600 font-medium">{trx.bandwidth}</td>
                    <td className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">{formatRupiah(trx.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`rounded-full px-2 py-1 text-xs font-bold ${trx.status === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {trx.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {trx.status === 'Lunas' ? (
                        <button onClick={() => handlePrint(trx)} className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-blue-600 hover:text-white transition" title="Cetak Struk">
                          <Printer size={18} />
                        </button>
                      ) : <span className="text-gray-300">-</span>}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-400">Belum ada riwayat transaksi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransactionHistory;