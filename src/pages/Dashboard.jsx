import React from 'react';

function Dashboard() {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-gray-500">User Online</h3>
          <p className="text-3xl font-bold text-blue-600">24</p>
        </div>
        {/* Card 2 */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-gray-500">Total Voucher</h3>
          <p className="text-3xl font-bold text-green-600">150</p>
        </div>
        {/* Card 3 */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-gray-500">Pendapatan</h3>
          <p className="text-3xl font-bold text-purple-600">Rp 500.000</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;