
import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Upload, Trash2, Edit2, Search, Filter, Save, X, 
  Users, Heart, Sparkles, Phone, Mail, Cake, CircleDot, Eye, 
  ExternalLink, Calendar, MapPin, Award
} from 'lucide-react';
import { Devotee, InitiationStatus } from '../types';
import { storageService } from '../services/storageService';

interface Props {
  isNew?: boolean;
}

const DevoteeManagement: React.FC<Props> = ({ isNew }) => {
  const [devotees, setDevotees] = useState<Devotee[]>([]);
  const [showForm, setShowForm] = useState(isNew || false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevotee, setSelectedDevotee] = useState<Devotee | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Devotee>>({
    name: '',
    spiritualName: '',
    email: '',
    phone: '',
    dob: '',
    status: InitiationStatus.UNINITIATED,
    photo: '',
    hobbies: '',
    dailyMalas: 16
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDevotees(storageService.getDevotees());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all mandatory fields (Name, Email, Phone)");
      return;
    }

    const newDevotee: Devotee = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || '',
      spiritualName: formData.spiritualName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      dob: formData.dob || '',
      status: (formData.status as InitiationStatus) || InitiationStatus.UNINITIATED,
      photo: formData.photo || '',
      joinedAt: new Date().toISOString(),
      hobbies: formData.hobbies || '',
      dailyMalas: Number(formData.dailyMalas) || 0
    };

    const updated = [...devotees, newDevotee];
    setDevotees(updated);
    storageService.saveDevotees(updated);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      spiritualName: '',
      email: '',
      phone: '',
      dob: '',
      status: InitiationStatus.UNINITIATED,
      photo: '',
      hobbies: '',
      dailyMalas: 16
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteDevotee = (id: string) => {
    if (confirm('Are you sure you want to delete this devotee record?')) {
      const updated = devotees.filter(d => d.id !== id);
      setDevotees(updated);
      storageService.saveDevotees(updated);
    }
  };

  const filtered = devotees.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.spiritualName && d.spiritualName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Devotee Community</h2>
          <p className="text-slate-500">Full administrative access to devotee profiles and service data.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 bg-[#FF8C00] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 shadow-md transition-all active:scale-95"
          >
            <PlusCircle size={20} />
            Register Devotee
          </button>
        )}
      </div>

      {/* Devotee Details Modal */}
      {selectedDevotee && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 text-[#FF8C00] rounded-lg">
                  <Users size={20} />
                </div>
                <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Full Devotee Profile</h3>
              </div>
              <button 
                onClick={() => setSelectedDevotee(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Identity Side */}
                <div className="lg:col-span-4 space-y-6 text-center lg:text-left">
                  <div className="w-48 h-48 mx-auto lg:mx-0 rounded-[3rem] bg-slate-100 border-4 border-white shadow-xl overflow-hidden">
                    {selectedDevotee.photo ? (
                      <img src={selectedDevotee.photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Users size={64} />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-slate-900 leading-tight">
                      {selectedDevotee.spiritualName || selectedDevotee.name}
                    </h4>
                    {selectedDevotee.spiritualName && (
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Legal: {selectedDevotee.name}</p>
                    )}
                    <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-2">
                      <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black rounded-full border border-orange-100 uppercase tracking-widest">
                        {selectedDevotee.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Side */}
                <div className="lg:col-span-8 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact info */}
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Contact Info</h5>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-slate-600">
                          <Phone size={16} className="text-orange-400" />
                          <span className="text-sm font-bold">{selectedDevotee.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                          <Mail size={16} className="text-orange-400" />
                          <span className="text-sm font-medium">{selectedDevotee.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                          <Cake size={16} className="text-orange-400" />
                          <span className="text-sm font-medium">{selectedDevotee.dob ? new Date(selectedDevotee.dob).toLocaleDateString() : 'No DOB provided'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Sadhana info */}
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Sadhana & Practice</h5>
                      <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-orange-400 uppercase tracking-tight">Daily Rounds</p>
                          <p className="text-xl font-black text-orange-600">{selectedDevotee.dailyMalas} Malas</p>
                        </div>
                        <CircleDot className="text-orange-300" size={32} />
                      </div>
                    </div>
                  </div>

                  {/* Hobbies / Seva */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Seva Interests & Hobbies</h5>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <p className="text-slate-600 leading-relaxed italic text-sm">
                        {selectedDevotee.hobbies || "No specific seva interests or hobbies listed."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} /> Joined: {new Date(selectedDevotee.joinedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} /> Temple Registered
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedDevotee(null)}
                className="px-6 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors"
              >
                Close
              </button>
              <button className="flex items-center gap-2 bg-[#FF8C00] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md">
                <Edit2 size={16} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm ? (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300 max-w-5xl mx-auto mb-12">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Devotee Registration</h3>
              <p className="text-sm text-slate-500">Complete the profile for our newest family member.</p>
            </div>
            <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSave} className="p-8 lg:p-10 space-y-10">
            {/* Identity & Photo Section */}
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-40 h-40 rounded-[2.5rem] bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all overflow-hidden relative group shadow-inner"
                >
                  {formData.photo ? (
                    <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera className="text-slate-400 mb-2 group-hover:text-orange-500" size={40} />
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-orange-500 uppercase tracking-widest">Photo</span>
                    </>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload className="text-white" size={32} />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <Users size={14} className="text-orange-500" /> Legal Name*
                    </label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Smith"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles size={14} className="text-orange-500" /> Spiritual Name
                    </label>
                    <input 
                      type="text" 
                      value={formData.spiritualName}
                      onChange={e => setFormData({ ...formData, spiritualName: e.target.value })}
                      placeholder="Jagannath Das"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <Cake size={14} className="text-orange-500" /> Date of Birth
                    </label>
                    <input 
                      type="date" 
                      value={formData.dob}
                      onChange={e => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Initiation Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as InitiationStatus })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all appearance-none bg-no-repeat bg-[right_1rem_center]"
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundSize: '1.2em' }}
                    >
                      {Object.values(InitiationStatus).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-l-4 border-orange-500 pl-4">Contact Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Mail size={14} className="text-orange-500" /> Email Address*
                  </label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="devotee@example.com"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Phone size={14} className="text-orange-500" /> Mobile Number*
                  </label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Distinct Sadhana Section */}
              <div className="bg-orange-50 rounded-3xl p-8 border border-orange-100 space-y-6 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="relative z-10">
                  <h4 className="text-sm font-black text-orange-600 uppercase tracking-widest flex items-center gap-2 mb-6">
                    <CircleDot size={20} /> Daily Sadhana
                  </h4>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="text-base font-bold text-slate-700">Daily Japa Rounds (Malas)</label>
                      <span className="text-3xl font-black text-[#FF8C00]">{formData.dailyMalas}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="64" 
                      step="1"
                      value={formData.dailyMalas}
                      onChange={e => setFormData({ ...formData, dailyMalas: Number(e.target.value) })}
                      className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-[#FF8C00]"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-orange-400 uppercase tracking-tighter">
                      <span>0 Rounds</span>
                      <span>16 (Standard)</span>
                      <span>32 Rounds</span>
                      <span>64 Rounds</span>
                    </div>
                    <p className="text-xs text-orange-500 italic mt-4 bg-white/50 p-3 rounded-xl border border-orange-100">
                      "Chanting is the essence of our spiritual practice."
                    </p>
                  </div>
                </div>
              </div>

              {/* Hobbies Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-200 pl-4">Interests & Hobbies</h4>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Heart size={14} className="text-pink-500" /> Areas of Interest
                  </label>
                  <textarea 
                    rows={6}
                    value={formData.hobbies}
                    onChange={e => setFormData({ ...formData, hobbies: e.target.value })}
                    placeholder="E.g. Cooking prasadam, playing mridanga, teaching children, organic gardening, book distribution..."
                    className="w-full px-4 py-4 rounded-3xl border border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all resize-none shadow-inner"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <button 
                type="button"
                onClick={() => { setShowForm(false); resetForm(); }}
                className="px-8 py-4 font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex items-center gap-2 bg-[#FF8C00] text-white px-10 py-4 rounded-2xl font-bold hover:bg-orange-600 shadow-xl shadow-orange-200 transition-all hover:-translate-y-1 active:scale-95 active:translate-y-0"
              >
                <Save size={20} />
                Save Profile
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by name, spiritual name, email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all">
                <Filter size={18} />
                Filters
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5 text-left">Devotee Profile</th>
                  <th className="px-8 py-5 text-left">Status</th>
                  <th className="px-8 py-5 text-left">Sadhana</th>
                  <th className="px-8 py-5 text-left">Birth Date</th>
                  <th className="px-8 py-5 text-left">Contact</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(devotee => (
                  <tr key={devotee.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 shadow-sm border border-slate-200/50">
                          {devotee.photo ? (
                            <img src={devotee.photo} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Users size={24} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-slate-900 leading-tight truncate">{devotee.spiritualName || devotee.name}</p>
                          {devotee.spiritualName && <p className="text-[10px] text-slate-400 font-bold tracking-tight uppercase mt-1 truncate">{devotee.name}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        devotee.status.includes('Initiated') ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {devotee.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex flex-col items-center justify-center text-[#FF8C00] border border-orange-100">
                          <span className="font-black leading-none">{devotee.dailyMalas || 0}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Malas/Day</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Cake size={14} className="text-slate-300" />
                        <span className="text-sm">{devotee.dob ? new Date(devotee.dob).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-700 font-bold flex items-center gap-2">
                          <Phone size={12} className="text-slate-300" /> {devotee.phone}
                        </p>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                          <Mail size={12} className="text-slate-300" /> {devotee.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button 
                          onClick={() => setSelectedDevotee(devotee)}
                          className="p-3 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button className="p-3 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteDevotee(devotee.id)}
                          className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <Users size={40} className="text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold tracking-tight text-lg">No Devotees Found</p>
                        <p className="text-slate-300 text-sm mt-1">Try adjusting your search or register a new devotee.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Custom PlusCircle component
const PlusCircle: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export default DevoteeManagement;
