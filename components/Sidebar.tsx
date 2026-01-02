
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  MessageSquare, 
  Truck, 
  FileText,
  Mic,
  Wrench,
  AlertOctagon,
  LineChart,
  Scale,
  Building2,
  ChevronDown,
  LayoutGrid
} from 'lucide-react';
import { AppSection, Condominium } from '../types';

interface SidebarProps {
  currentSection: AppSection;
  onNavigate: (section: AppSection) => void;
  selectedCondoId: string;
  setSelectedCondoId: (id: string) => void;
  condos: Condominium[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentSection, 
  onNavigate, 
  selectedCondoId, 
  setSelectedCondoId,
  condos 
}) => {
  const [isCondoMenuOpen, setIsCondoMenuOpen] = useState(false);

  const menuItems = [
    { id: AppSection.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppSection.CONDOMINIUMS, label: 'Anagrafica & Unità', icon: Building2 },
    { id: AppSection.ACCOUNTING, label: 'Contabilità', icon: Receipt },
    { id: AppSection.DOCUMENTS, label: 'Archivio AI', icon: FileText },
    { id: AppSection.MAINTENANCE, label: 'Manutenzioni', icon: Wrench },
    { id: AppSection.RESIDENTS, label: 'Comunicazioni', icon: MessageSquare },
    { id: AppSection.ASSEMBLIES, label: 'Assemblee', icon: Users },
    { id: AppSection.ANALYTICS, label: 'Analisi & Prev.', icon: LineChart },
    { id: AppSection.LEGAL, label: 'Legal & Fisco', icon: Scale },
    { id: AppSection.SUPPLIERS, label: 'Fornitori', icon: Truck },
  ];

  const selectedCondo = condos.find(c => c.id === selectedCondoId);

  return (
    <div className="w-64 bg-slate-800 text-slate-100 h-screen flex flex-col fixed left-0 top-0 z-30">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
          <Mic className="w-6 h-6" /> CondoAI
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Gestione Intelligente</p>
      </div>
      
      <nav className="flex-1 mt-2 overflow-y-auto custom-scrollbar">
        {/* NEW: Primary Category - Condominium Selector */}
        <div className="px-4 mb-6">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 px-2">Focus Attivo</p>
          <div className="relative">
            <button 
              onClick={() => setIsCondoMenuOpen(!isCondoMenuOpen)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all border ${
                isCondoMenuOpen 
                  ? 'bg-slate-700 border-emerald-500/50 shadow-lg' 
                  : 'bg-slate-900/40 border-slate-700 hover:bg-slate-700/50 hover:border-slate-600'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                {selectedCondoId === 'all' ? <LayoutGrid className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-100 truncate">
                  {selectedCondoId === 'all' ? 'Tutti i Condomini' : selectedCondo?.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate leading-none mt-0.5">
                  {selectedCondoId === 'all' ? 'Vista aggregata' : selectedCondo?.address}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isCondoMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown in Sidebar */}
            {isCondoMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <button 
                  onClick={() => { setSelectedCondoId('all'); setIsCondoMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-xs hover:bg-slate-800 flex items-center gap-3 transition-colors ${selectedCondoId === 'all' ? 'text-emerald-400 font-bold bg-emerald-400/5' : 'text-slate-400'}`}
                >
                  <LayoutGrid className="w-3 h-3" /> Tutti i Condomini
                </button>
                <div className="h-px bg-slate-800 mx-3" />
                {condos.map(condo => (
                  <button 
                    key={condo.id}
                    onClick={() => { setSelectedCondoId(condo.id); setIsCondoMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-xs hover:bg-slate-800 flex items-center gap-3 transition-colors ${selectedCondoId === condo.id ? 'text-emerald-400 font-bold bg-emerald-400/5' : 'text-slate-400'}`}
                  >
                    <Building2 className="w-3 h-3" /> {condo.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 px-6">Navigazione</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-3.5 transition-all duration-200 ${
                isActive 
                  ? 'bg-slate-700 text-white border-r-4 border-emerald-400 shadow-inner' 
                  : 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : ''}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 space-y-4">
        <button 
          onClick={() => onNavigate(AppSection.EMERGENCY)}
          className={`w-full p-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${
            currentSection === AppSection.EMERGENCY 
              ? 'bg-red-500 text-white scale-105 shadow-lg shadow-red-500/20' 
              : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'
          }`}
        >
          <AlertOctagon className="w-5 h-5" />
          <span>EMERGENZA</span>
        </button>

        <div className="p-4 bg-slate-900/50 rounded-3xl border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center ring-2 ring-emerald-500/10">
              <span className="text-emerald-400 font-bold">A</span>
            </div>
            <div>
              <p className="text-sm font-medium">Amministratore</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Premium AI Plan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
