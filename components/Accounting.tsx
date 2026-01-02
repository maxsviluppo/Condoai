
import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import { Transaction } from '../types';
import VoiceCommand from './VoiceCommand';

const Accounting: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', date: '2023-10-01', description: 'Pulizia Scale Settembre', amount: -450.00, category: 'Spese Generali', status: 'Pagato' },
    { id: '2', date: '2023-10-02', description: 'Bolletta Acqua Q3', amount: -1200.50, category: 'Acqua', status: 'In sospeso' },
    { id: '3', date: '2023-10-05', description: 'Versamento MAV Condòmino Rossi', amount: 350.00, category: 'Amministrazione', status: 'Pagato' },
    { id: '4', date: '2023-09-28', description: 'Manutenzione Ascensore', amount: -850.00, category: 'Manutenzione', status: 'Scaduto' },
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);

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
      // Fallback: Copy to clipboard
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
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Contabilità & Flussi</h2>
          <p className="text-slate-500">Gestisci entrate, uscite e scadenze fiscali.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 transition-shadow shadow-sm font-medium">
            <Plus className="w-4 h-4" /> Nuova Registrazione
          </button>
          <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
            <Download className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cerca transazione..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>
            <button className="flex items-center gap-2 text-sm font-medium text-slate-600 px-3 py-2 hover:bg-slate-50 rounded-lg">
              <Filter className="w-4 h-4" /> Filtri
            </button>
            <div className="w-px h-6 bg-slate-200" />
            <VoiceCommand onResult={handleVoiceInput} placeholder="Dì 'Aggiungi spesa 50€ per pulizia'..." />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Descrizione</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Importo</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stato</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-slate-600">{t.date}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{t.description}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{t.category}</span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold text-right ${t.amount < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {t.amount.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {t.status === 'Pagato' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {t.status === 'In sospeso' && <Clock className="w-4 h-4 text-amber-500" />}
                        {t.status === 'Scaduto' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        <span className="text-xs font-medium text-slate-600">{t.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => handleShare(t)}
                          title="Condividi via email o link"
                          className={`p-1.5 rounded-lg transition-colors ${
                            copiedId === t.id 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'hover:bg-slate-200 text-slate-400 hover:text-blue-500'
                          }`}
                        >
                          {copiedId === t.id ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg shadow-emerald-200">
            <h4 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-4">Caricamento Rapido AI</h4>
            <div className="border-2 border-dashed border-emerald-400/50 rounded-xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-emerald-500 transition-colors">
              <div className="w-12 h-12 bg-emerald-400/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">Trascina fattura o clicca qui</p>
              <p className="text-[10px] opacity-60 mt-2">L'AI estrarrà automaticamente dati, importi e scadenze.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Report Rapidi</h4>
            <div className="space-y-2">
              <button className="w-full text-left text-sm p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">Stato Patrimoniale</button>
              <button className="w-full text-left text-sm p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">Consuntivo Spese</button>
              <button className="w-full text-left text-sm p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">Analisi Morosità</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounting;
