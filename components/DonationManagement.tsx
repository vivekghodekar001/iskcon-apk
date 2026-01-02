
import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  ChevronRight,
  Save,
  X
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { Donation } from '../types';

const DonationManagement: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Partial<Donation>>({
    donorName: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    purpose: 'General',
    method: 'Cash'
  });

  useEffect(() => {
    setDonations(storageService.getDonations());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.donorName || !formData.amount) return;

    const newDonation: Donation = {
      id: Math.random().toString(36).substr(2, 9),
      donorName: formData.donorName || '',
      amount: Number(formData.amount),
      date: formData.date || new Date().toISOString(),
      purpose: formData.purpose as any,
      method: formData.method as any
    };

    const updated = [newDonation, ...donations];
    setDonations(updated);
    storageService.saveDonations(updated);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      donorName: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      purpose: 'General',
      method: 'Cash'
    });
  };

  const totalCollected = donations.reduce((acc, curr) => acc + curr.amount, 0);
  const filtered = donations.filter(d => 
    d.donorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Laxmi Seva Management</h2>
          <p className="text-slate-500">Track temple contributions and recognize donor devotion.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 bg-[#FF8C00] text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 shadow-xl shadow-orange-100 transition-all active:scale-95"
        >
          <Plus size={20} />
          Record Donation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Contributions</p>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-black text-slate-900">₹{totalCollected.toLocaleString()}</h3>
            <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1 mb-1">
              <TrendingUp size={12} /> 12%
            </span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Building Fund</p>
          <h3 className="text-4xl font-black text-slate-900">₹{donations.filter(d => d.purpose === 'Building').reduce((a, b) => a + b.amount, 0).toLocaleString()}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Feast Sponsors</p>
          <h3 className="text-4xl font-black text-slate-900">{donations.filter(d => d.purpose === 'Feast').length} <span className="text-slate-300 text-xl font-medium">Donors</span></h3>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900">New Donation Entry</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Donor Name</label>
                <input 
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.donorName}
                  onChange={e => setFormData({...formData, donorName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Amount (₹)</label>
                  <input 
                    required
                    type="number"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Purpose</label>
                  <select 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold appearance-none"
                    value={formData.purpose}
                    onChange={e => setFormData({...formData, purpose: e.target.value as any})}
                  >
                    <option value="General">General Seva</option>
                    <option value="Building">Building Fund</option>
                    <option value="Feast">Sunday Feast</option>
                    <option value="Goshala">Goshala Seva</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Cash', 'Online', 'Cheque'].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormData({...formData, method: m as any})}
                      className={`py-3 rounded-xl font-bold text-xs border transition-all ${
                        formData.method === m 
                        ? 'bg-orange-500 text-white border-orange-500' 
                        : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-[#FF8C00] text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-100 hover:bg-orange-600 active:scale-[0.98] transition-all">
                Record Contribution
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text"
              placeholder="Search donor name..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all border border-slate-100">
            <Filter size={18} />
            Advanced Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-left">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Donor Detail</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Purpose</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(donation => (
                <tr key={donation.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <User size={20} />
                      </div>
                      <p className="font-bold text-slate-900">{donation.donorName}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-900">₹{donation.amount.toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1.5 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-orange-100">
                      {donation.purpose}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <CreditCard size={14} className="text-slate-300" />
                      {donation.method}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-slate-400 text-xs font-medium">
                    {new Date(donation.date).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <ChevronRight size={18} className="text-slate-200 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Coins size={48} className="text-slate-100" />
                      <p className="font-bold">No records found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DonationManagement;
