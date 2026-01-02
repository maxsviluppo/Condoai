
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Filter, 
  Download, 
  Search,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Share2,
  Check,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  X
} from 'lucide-react';
import { Transaction } from '../types';
import VoiceCommand from './VoiceCommand';

type FilterMode = 'ALL' | 'MONTH' | 'QUARTER' | 'YEAR';

const Accounting: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', date: '2023-10-01', description: 'Pulizia Scale Settembre', amount: -450.00, category: 'Spese Generali', status: 'Pagato' },
    { id: '2', date: '2023-10-02', description: 'Bolletta Acqua Q3', amount: -1200.50, category: 'Acqua', status: 'In sospeso' },
    { id: '3', date: '2023-10-05', description: 'Versamento MAV Condòmino Rossi', amount: 350.00, category: 'Amministrazione', status: 'Pagato' },
    { id: '4', date: '2023-09-28', description: 'Manutenzione Ascensore', amount: -850.00, category: 'Manutenzione', status: 'Scaduto' },
    { id: '5', date: '2023-06-15', description: 'Assicurazione Fabbricato', amount: -2400.00, category: 'Spese Generali', status: 'Pagato' },
    { id: '6', date: '2022-12-10', description: 'Riscaldamento Invernale 22', amount: -4500.00, category: 'Riscaldamento', status: 'Pagato' },
  ]);

  const [filterMode, setFilterMode] = useState<FilterMode>('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const months = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  const quarters = ["Q1 (Gen-Mar)", "Q2 (Apr-Giu)", "Q3 (Lug-Set)", "Q4 (Ott-Dic)"];
  const years = ["2023", "2022", "2021"];

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const date = new Date(t.date);
      const year = date.getFullYear().toString();
      const monthIndex = date.getMonth(); // 0-11
      const quarter = Math.floor(monthIndex / 3); // 0-3

      // 1. Text Search Filter
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.category.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // 2. Date Filter
      if (filterMode === 'ALL') return true;
      if (filterMode === 'YEAR') return year === selectedPeriod;
      if (filterMode === 'MONTH') return months[monthIndex] === selectedPeriod;
      if (filterMode === 'QUARTER') {
        const qIndex = quarters.indexOf(selectedPeriod);
        return quarter === qIndex;
      }
      return true;
    });
  }, [transactions, filterMode, selectedPeriod, searchQuery]);

  // Dynamic Totals based on filter
  const financialSummary = useMemo(() => {
    return filteredTransactions.reduce((acc, curr) => {
      if (curr.amount > 0) acc.income += curr.amount;
      else acc.expense += Math.abs(curr.amount);
      acc.balance = acc.income - acc.expense;
      return acc;
    }, { income: 0, expense: 0, balance: 0 });
  }, [filteredTransactions]);

  const handleVoiceInput = (text: string) => {
    if (text.toLowerCase().includes('aggiungi spesa')) {
        alert("Simulazione: Apertura modulo nuova spesa con testo: " + text);
    }
  };

  const handleShare = async (t: Transaction) => {
    const shareText = `CondoAI - Dettaglio Transazione:\n\n` +
      `Descrizione: ${t.description}\n` +
      `Importo: ${t.amount.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}\n` +
      `Data: ${t.date}\n` +
      `Stato: ${t.status}\n\n` +
      `Gestionale CondoAI - Amministrazione Digitale.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Transazione: ${t.description}`,
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        console.error("Errore condivisione:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\nLink: ${window.location.href}`);
        setCopiedId(t.id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (err) {
        alert("Impossibile copiare i dettagli.");
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Contabilità & Flussi</h2>
          <p className="text-slate-500">Gestisci entrate, uscite e scadenze fiscali con filtri intelligenti.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 font-bold text-sm">
            <Plus className="w-4 h-4" /> Nuova Registrazione
          </button>
          <button className="p-2.5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </header>

      {/* NEW: Financial Summary Bar based on Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group overflow-hidden">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Entrate Periodo</p>
            <p className="text-xl font-black text-emerald-600">+{financialSummary.income.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</p>
          </div>
          <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group overflow-hidden">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Uscite Periodo</p>
            <p className="text-xl font-black text-red-500">-{financialSummary.expense.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</p>
          </div>
          <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-slate-900 p-5 rounded-3xl shadow-lg flex items-center justify-between group overflow-hidden">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Saldo Periodo</p>
            <p className={`text-xl font-black ${financialSummary.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {financialSummary.balance.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-white/50 group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col gap-4 bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca per descrizione o categoria..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all"
                />
              </div>
              <div className="h-8 w-px bg-slate-100 mx-2 hidden md:block" />
              <VoiceCommand onResult={handleVoiceInput} placeholder="Dì 'Aggiungi spesa 50€'..." />
            </div>

            {/* Date Filtering Controls */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Periodo:</span>
                <div className="bg-slate-100 p-1 rounded-xl flex border border-slate-200">
                  {(['ALL', 'MONTH', 'QUARTER', 'YEAR'] as FilterMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setFilterMode(mode);
                        if (mode === 'ALL') setSelectedPeriod('');
                        else if (mode === 'MONTH') setSelectedPeriod(months[new Date().getMonth()]);
                        else if (mode === 'QUARTER') setSelectedPeriod(quarters[0]);
                        else if (mode === 'YEAR') setSelectedPeriod('2023');
                      }}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${
                        filterMode === mode 
                          ? 'bg-white text-emerald-600 shadow-sm' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {mode === 'ALL' ? 'Tutto' : mode === 'MONTH' ? 'Mese' : mode === 'QUARTER' ? 'Trim.' : 'Anno'}
                    </button>
                  ))}
                </div>
              </div>

              {filterMode !== 'ALL' && (
                <div className="relative animate-in slide-in-from-left-2 flex items-center gap-3">
                  <div className="relative">
                    <select 
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-10 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm cursor-pointer min-w-[140px]"
                    >
                      {filterMode === 'MONTH' && months.map(m => <option key={m} value={m}>{m}</option>)}
                      {filterMode === 'QUARTER' && quarters.map(q => <option key={q} value={q}>{q}</option>)}
                      {filterMode === 'YEAR' && years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                  </div>
                  <button 
                    onClick={() => { setFilterMode('ALL'); setSelectedPeriod(''); }}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                    title="Rimuovi Filtro"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              <div className="ml-auto flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Risultati: {filteredTransactions.length}</span>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrizione</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Importo</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stato</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-400">
                         <Search className="w-12 h-12 opacity-20" />
                         <p className="text-sm italic font-medium">Nessuna transazione trovata per il periodo selezionato.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-5 text-sm font-medium text-slate-500 font-mono">{t.date}</td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-800">{t.description}</td>
                      <td className="px-6 py-5">
                        <span className="text-[10px] font-black uppercase tracking-tight bg-slate-100 text-slate-500 px-3 py-1 rounded-full border border-slate-200">
                          {t.category}
                        </span>
                      </td>
                      <td className={`px-6 py-5 text-sm font-black text-right ${t.amount < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {t.amount.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          {t.status === 'Pagato' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          {t.status === 'In sospeso' && <Clock className="w-4 h-4 text-amber-500" />}
                          {t.status === 'Scaduto' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          <span className="text-xs font-bold text-slate-700">{t.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          <button 
                            onClick={() => handleShare(t)}
                            title="Condividi via email o link"
                            className={`p-2 rounded-xl transition-all ${
                              copiedId === t.id 
                              ? 'bg-emerald-100 text-emerald-600' 
                              : 'hover:bg-blue-50 text-slate-400 hover:text-blue-500'
                            }`}
                          >
                            {copiedId === t.id ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                          </button>
                          <button className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="bg-emerald-600 text-white p-7 rounded-[40px] shadow-2xl shadow-emerald-200 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
               <Calendar className="w-32 h-32" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-6 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Smart Import AI
            </h4>
            <div className="border-2 border-dashed border-white/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white/10 hover:border-white/50 transition-all">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-lg backdrop-blur-sm">
                <Plus className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold">Trascina Fattura</p>
              <p className="text-[10px] opacity-60 mt-2 font-medium leading-relaxed">L'AI estrarrà automaticamente dati, importi e scadenze.</p>
            </div>
          </div>

          <div className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Report Generabili</h4>
            <div className="space-y-3">
              {[
                { label: 'Stato Patrimoniale', icon: '📊' },
                { label: 'Consuntivo Spese', icon: '📈' },
                { label: 'Analisi Morosità', icon: '⚠️' }
              ].map((report, idx) => (
                <button 
                  key={idx}
                  className="w-full text-left text-xs font-bold text-slate-700 p-4 rounded-2xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm transition-all flex items-center gap-3 group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{report.icon}</span>
                  {report.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounting;
