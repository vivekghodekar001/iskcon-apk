
import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, 
  Plus, 
  Search, 
  AlertTriangle, 
  Package, 
  Clock, 
  ChefHat, 
  BarChart2,
  Settings,
  MoreVertical,
  Minus,
  Save,
  X
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { InventoryItem } from '../types';

const KitchenManagement: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'inventory' | 'planner'>('inventory');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: '',
    category: 'Grains',
    quantity: 0,
    unit: 'kg',
    minThreshold: 10
  });

  useEffect(() => {
    setInventory(storageService.getInventory());
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: InventoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItem.name || '',
      category: newItem.category as any,
      quantity: Number(newItem.quantity),
      unit: newItem.unit || 'kg',
      minThreshold: Number(newItem.minThreshold)
    };

    const updated = [...inventory, item];
    setInventory(updated);
    storageService.saveInventory(updated);
    setShowAddForm(false);
    setNewItem({ name: '', category: 'Grains', quantity: 0, unit: 'kg', minThreshold: 10 });
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = inventory.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    });
    setInventory(updated);
    storageService.saveInventory(updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Prasadam Seva Kitchen</h2>
          <p className="text-slate-500">Manage temple inventory and daily meal planning for the congregation.</p>
        </div>
        <div className="flex p-1.5 bg-slate-100 rounded-2xl">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'inventory' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}
          >
            Inventory
          </button>
          <button 
            onClick={() => setActiveTab('planner')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'planner' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}
          >
            Menu Planner
          </button>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                placeholder="Search stock (e.g. Rice, Ghee, Spices)..."
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
              />
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-[1.5rem] font-bold hover:bg-slate-800 transition-all"
            >
              <Plus size={20} />
              Add Item
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {inventory.map(item => {
              const isLow = item.quantity <= item.minThreshold;
              const stockPercent = Math.min((item.quantity / (item.minThreshold * 2)) * 100, 100);

              return (
                <div key={item.id} className={`bg-white p-6 rounded-[2rem] border transition-all ${isLow ? 'border-red-100 shadow-lg shadow-red-50/50' : 'border-slate-100 shadow-sm'}`}>
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-3 rounded-2xl ${isLow ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                      <Package size={24} />
                    </div>
                    {isLow && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-100">
                        <AlertTriangle size={12} />
                        Low Stock
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{item.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.category}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-end justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900">{item.quantity}</span>
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.unit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Stock Health</span>
                        <span>{Math.round(stockPercent)}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${isLow ? 'bg-red-500' : 'bg-orange-400'}`}
                          style={{ width: `${stockPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Clock size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Today's Prasad Menu</h3>
                </div>
                <p className="text-sm font-bold text-slate-400">{new Date().toDateString()}</p>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-6 group hover:bg-white hover:shadow-md transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-500 font-bold">BF</div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Breakfast (08:30 AM)</p>
                    <p className="font-bold text-slate-800">Suvji Upma & Fruits</p>
                  </div>
                  <button className="text-slate-300 hover:text-slate-600"><Settings size={20} /></button>
                </div>
                <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 flex items-center gap-6 group hover:shadow-md transition-all relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-full bg-orange-100/30 -skew-x-12 translate-x-12"></div>
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-500 font-bold">LN</div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Lunch Feast (01:30 PM)</p>
                    <p className="font-black text-slate-800">Paneer Butter Masala, Jeera Rice, Dal Fry & Gulab Jamun</p>
                  </div>
                  <button className="text-orange-300 hover:text-orange-600"><Settings size={20} /></button>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-6 group hover:bg-white hover:shadow-md transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-500 font-bold">DN</div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dinner (08:00 PM)</p>
                    <p className="font-bold text-slate-800">Kichadi & Kadhi</p>
                  </div>
                  <button className="text-slate-300 hover:text-slate-600"><Settings size={20} /></button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden">
              <ChefHat className="absolute bottom-[-20px] right-[-20px] w-48 h-48 opacity-10" />
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BarChart2 size={24} className="text-orange-500" />
                Seva Analytics
              </h3>
              <div className="space-y-4 relative z-10">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Plates Served</p>
                  <p className="text-2xl font-black">250 <span className="text-xs font-normal text-slate-500">per meal</span></p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Waste Reduction</p>
                  <p className="text-2xl font-black text-emerald-400">+18% <span className="text-xs font-normal text-slate-500">this month</span></p>
                </div>
              </div>
              <button className="w-full py-4 bg-orange-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900">Add Stock Item</h3>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddItem} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Item Name</label>
                <input 
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-orange-500/10 transition-all font-bold"
                  placeholder="e.g. Cardamom"
                  value={newItem.name}
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Initial Quantity</label>
                  <input 
                    required
                    type="number"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-orange-500/10 transition-all font-bold"
                    value={newItem.quantity}
                    onChange={e => setNewItem({...newItem, quantity: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Category</label>
                  <select 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-orange-500/10 transition-all font-bold appearance-none"
                    value={newItem.category}
                    onChange={e => setNewItem({...newItem, category: e.target.value as any})}
                  >
                    <option value="Grains">Grains</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Spices">Spices</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-[#FF8C00] text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all">
                Add to Stock Room
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenManagement;
