import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Save, MapPin, Wallet, RefreshCw } from 'lucide-react';
import { supabase } from '../supabaseClient';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payData, setPayData] = useState(null);
  const [paymentDuration, setPaymentDuration] = useState(1);

  const [formData, setFormData] = useState({ name: '', address: '', bandwidth: '', price: '' });
  const [currentStatus, setCurrentStatus] = useState('Non-Active');

  const fetchUsers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('pelanggan').select('*').order('id', { ascending: false });
    
    if (!error && data) {
      const todayStr = new Date().toISOString().split('T')[0];
      
      const checkedUsers = data.map((user) => {
        if (user.status === 'Active' && user.jatuh_tempo && todayStr > user.jatuh_tempo) {
          supabase.from('pelanggan').update({ status: 'Non-Active' }).eq('id', user.id).then();
          return { ...user, status: 'Non-Active' };
        }
        return user;
      });

      setUsers(checkedUsers);
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID').format(num);
  
  // HELPER UNTUK FORMAT TANGGAL CANTIK (Misal: 12 Apr 2026)
  const formatTanggalSingkat = (tgl) => {
    if (!tgl) return '-';
    return new Date(tgl).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddNew = () => {
    setIsEditing(false);
    setFormData({ name: '', address: '', bandwidth: '', price: '' });
    setIsModalOpen(true);
  };

  const handleEditClick = (user) => {
    setIsEditing(true);
    setCurrentId(user.id);
    setCurrentStatus(user.status);
    const cleanBandwidth = user.bandwidth.replace(/[^0-9]/g, ''); 
    const cleanPrice = user.price.replace(/[^0-9]/g, '');
    setFormData({ name: user.name, address: user.address, bandwidth: cleanBandwidth, price: cleanPrice });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Hapus pelanggan ini dari database permanen?')) {
      const { error } = await supabase.from('pelanggan').delete().eq('id', id);
      if (!error) setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    const finalBandwidth = `${formData.bandwidth} Mbps`;
    const finalPrice = `Rp ${formatRupiah(formData.price)}`;

    if (isEditing) {
      const { error } = await supabase.from('pelanggan').update({ name: formData.name, address: formData.address, bandwidth: finalBandwidth, price: finalPrice }).eq('id', currentId);
      if (!error) setUsers(users.map((user) => user.id === currentId ? { ...user, name: formData.name, address: formData.address, bandwidth: finalBandwidth, price: finalPrice, status: currentStatus } : user));
    } else {
      const { data, error } = await supabase.from('pelanggan').insert([{ name: formData.name, address: formData.address, bandwidth: finalBandwidth, price: finalPrice, status: 'Non-Active' }]).select();
      if (!error && data) setUsers([data[0], ...users]);
    }
    setIsModalOpen(false);
  };

  const handlePayClick = (user) => {
    setPayData(user);
    setPaymentDuration(1);
    setIsPayModalOpen(true);
  };

  const handleProcessPayment = async () => {
    const duration = paymentDuration > 0 ? paymentDuration : 1; 
    const basePrice = parseInt(payData.price.replace(/[^0-9]/g, ''));
    const totalAmount = basePrice * duration;

    const todayObj = new Date();
    todayObj.setDate(todayObj.getDate() + (duration * 30));
    const tanggalJatuhTempo = todayObj.toISOString().split('T')[0];

    const { error: userError } = await supabase
      .from('pelanggan')
      .update({ status: 'Active', jatuh_tempo: tanggalJatuhTempo })
      .eq('id', payData.id);
      
    if (userError) return alert('Gagal update status!');

    const today = new Date().toISOString().split('T')[0];
    await supabase.from('transaksi').insert([{ date: today, name: payData.name, address: payData.address, bandwidth: payData.bandwidth, amount: totalAmount, duration: duration, status: 'Lunas' }]);

    alert(`Pembayaran diterima!\nTotal: Rp ${formatRupiah(totalAmount)}\nAktif sampai: ${formatTanggalSingkat(tanggalJatuhTempo)}`);
    
    setUsers(users.map((u) => u.id === payData.id ? { ...u, status: 'Active', jatuh_tempo: tanggalJatuhTempo } : u));
    setIsPayModalOpen(false);
    setPayData(null);
  };

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.address.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="relative transition-colors duration-300">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">Data Pelanggan</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Kelola daftar pelanggan, status, dan pembayaran</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchUsers} className="flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm">
            <RefreshCw size={20} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button onClick={handleAddNew} className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition shadow-sm">
            <Plus size={20} className="mr-2" /> Tambah
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Search size={20} className="text-gray-400" /></div>
          <input type="text" placeholder="Cari nama atau alamat..." className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white p-2.5 pl-10 focus:border-blue-500 outline-none transition-colors" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 transition-colors">
              <tr>
                <th className="px-6 py-4">Nama Pelanggan</th>
                <th className="px-6 py-4">Alamat</th>
                <th className="px-6 py-4">Bandwidth</th>
                <th className="px-6 py-4">Tagihan</th>
                <th className="px-6 py-4">Status & Tempo</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500 dark:text-gray-400"><RefreshCw className="animate-spin mx-auto mb-2 text-blue-500" size={24} />Memuat data...</td></tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><MapPin size={16} className="mr-1 text-gray-400" />{user.address}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600 dark:text-blue-400">{user.bandwidth}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-700 dark:text-gray-300">{user.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* TAMPILAN STATUS + JATUH TEMPO YANG BARU */}
                      <div className="flex flex-col items-start gap-1">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold w-fit ${user.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {user.status === 'Active' ? 'Aktif' : 'Non-Aktif'}
                        </span>
                        {/* Munculkan text s/d jika status aktif dan ada tanggalnya */}
                        {user.status === 'Active' && user.jatuh_tempo && (
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium ml-1">
                            s/d {formatTanggalSingkat(user.jatuh_tempo)}
                          </span>
                        )}
                        {/* Munculkan peringatan lewat tempo jika non-aktif tapi punya history tanggal */}
                        {user.status === 'Non-Active' && user.jatuh_tempo && (
                          <span className="text-[10px] text-red-500 dark:text-red-400 font-medium ml-1">
                            Lewat: {formatTanggalSingkat(user.jatuh_tempo)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {user.status !== 'Active' && (
                        <button onClick={() => handlePayClick(user)} className="mr-3 text-green-600 dark:text-green-400 hover:text-green-900 bg-green-50 dark:bg-green-900/20 p-2 rounded-full transition animate-pulse" title="Bayar"><Wallet size={18} /></button>
                      )}
                      <button onClick={() => handleEditClick(user)} className="mr-3 text-blue-600 dark:text-blue-400 hover:text-blue-900 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full transition"><Edit size={18} /></button>
                      <button onClick={() => handleDeleteClick(user.id)} className="text-red-600 dark:text-red-400 hover:text-red-900 bg-red-50 dark:bg-red-900/20 p-2 rounded-full transition"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center py-8 text-gray-400">Belum ada pelanggan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH/EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden border dark:border-gray-700">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-900">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">{isEditing ? 'Edit Data' : 'Tambah Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nama</label><input type="text" name="name" required className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white p-2.5 rounded-lg outline-none focus:border-blue-500" value={formData.name} onChange={handleInputChange} /></div>
              <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Alamat</label><textarea name="address" required className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white p-2.5 rounded-lg outline-none focus:border-blue-500" rows="2" value={formData.address} onChange={handleInputChange}></textarea></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Paket</label><div className="relative"><input type="number" name="bandwidth" required className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white p-2.5 rounded-lg outline-none focus:border-blue-500 pr-12" value={formData.bandwidth} onChange={handleInputChange} /><span className="absolute right-3 top-3 text-gray-400 text-sm">Mbps</span></div></div>
                <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Harga</label><div className="relative"><span className="absolute left-3 top-3 text-gray-400 text-sm">Rp</span><input type="number" name="price" required className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white p-2.5 rounded-lg outline-none focus:border-blue-500 pl-10" value={formData.price} onChange={handleInputChange} /></div></div>
              </div>
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Batal</button>
                <button type="submit" className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Save size={18} className="mr-2" /> Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PEMBAYARAN */}
      {isPayModalOpen && payData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden border dark:border-gray-700">
            <div className="bg-green-600 p-5 text-white"><h3 className="text-lg font-bold flex items-center"><Wallet className="mr-2" /> Terima Pembayaran</h3></div>
            <div className="p-6">
              <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-xl space-y-4 mb-6 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center text-sm"><span className="text-gray-500 dark:text-gray-400">Pelanggan:</span><span className="font-bold text-gray-900 dark:text-white">{payData.name}</span></div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Durasi (Bulan)</label>
                  <div className="relative mt-2">
                    <input type="number" min="1" className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white font-bold focus:border-green-500 outline-none pr-16" value={paymentDuration} onChange={(e) => setPaymentDuration(parseInt(e.target.value) || '')} />
                    <span className="absolute right-4 top-3.5 text-gray-400 text-sm">Bulan</span>
                  </div>
                </div>
                <div className="border-t border-dashed border-gray-300 dark:border-gray-600 my-3"></div>
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">Total Tagihan:</span>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block mb-1">{payData.price} x {paymentDuration || 0}</span>
                    <span className="font-black text-2xl text-green-600 dark:text-green-400">Rp {formatRupiah(parseInt(payData.price.replace(/[^0-9]/g, '')) * (paymentDuration || 0))}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsPayModalOpen(false)} className="flex-1 border border-gray-300 dark:border-gray-600 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Batal</button>
                <button onClick={handleProcessPayment} className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-bold">Lunas</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;