import React, { useState } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

function TransactionHistory() {
  // Data Dummy Transaksi
  const initialTransactions = [
    { id: 1, date: '2025-10-12', name: 'Budi Santoso', type: 'Voucher 24 Jam', amount: 5000, status: 'Lunas' },
    { id: 2, date: '2025-10-12', name: 'Siti Aminah', type: 'Bulanan', amount: 50000, status: 'Belum Bayar' },
    { id: 3, date: '2025-10-11', name: 'Asep Kopi', type: 'Voucher 2 Jam', amount: 2000, status: 'Lunas' },
    { id: 4, date: '2025-10-11', name: 'Warung Sebelah', type: 'Mingguan', amount: 15000, status: 'Lunas' },
    { id: 5, date: '2025-10-10', name: 'Dani Cell', type: 'Bulanan', amount: 50000, status: 'Batal' },
  ];

  const [searchTerm, setSearchTerm] = useState('');

  // Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  // Filter Logic
  const filteredData = initialTransactions.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Riwayat Transaksi</h2>
        <p className="text-sm text-gray-500">Pantau pemasukan dan status pembayaran pelanggan</p>
      </div>

      {/* Ringkasan Singkat (Cards) */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-green-50 p-4 border border-green-100">
          <div className="flex items-center text-green-700">
            <ArrowDownLeft size={20} className="mr-2" />
            <span className="font-semibold">Pemasukan Hari Ini</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-800">Rp 57.000</p>
        </div>
        <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-100">
          <div className="flex items-center text-yellow-700">
            <Filter size={20} className="mr-2" />
            <span className="font-semibold">Belum Dibayar</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-800">Rp 50.000</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama pelanggan..."
            className="block w-full rounded-md border border-gray-300 p-2 pl-10 focus:border-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="rounded-md border bg-white px-4 py-2 text-gray-600 hover:bg-gray-50">
          Filter Tanggal
        </button>
      </div>

      {/* Tabel Transaksi */}
      <div className="rounded-lg bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Nama Pelanggan</th>
                <th className="px-6 py-3">Paket</th>
                <th className="px-6 py-3">Nominal</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((trx) => (
                <tr key={trx.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{trx.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{trx.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trx.type}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {formatRupiah(trx.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${
                      trx.status === 'Lunas' 
                        ? 'bg-green-100 text-green-700' 
                        : trx.status === 'Belum Bayar' 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {trx.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransactionHistory;