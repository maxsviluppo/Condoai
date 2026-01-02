
import React, { useState } from 'react';
import { Gavel, ShieldCheck, FileWarning, Sparkles, HelpCircle, Loader2, Scale, ExternalLink, Calendar } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const LegalFiscal: React.FC = () => {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);

  const askLegalAI = async () => {
    if (!query) return;
    setIsConsulting(true);
    try {
      const response = await geminiService.legalConsultant(query);
      setAiResponse(response);
    } catch (e) {
      setAiResponse("Errore nella consultazione.");
    } finally {
      setIsConsulting(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Legal & Fiscal Compliance</h2>
        <p className="text-slate-500">Monitoraggio adempimenti, privacy e consulenza normativa assistita.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Scale className="w-32 h-32" />
            </div>
            <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-emerald-400" /> AI Legal Consultant
            </h3>
            <div className="space-y-4 relative z-10">
              <p className="text-sm text-slate-400">Poni un quesito legale (es. "Quorum per rifacimento facciata" o "Nuova normativa ascensori 2024")</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Scrivi la tua domanda..." 
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button 
                  onClick={askLegalAI}
                  disabled={isConsulting}
                  className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-2xl font-bold transition-all disabled:opacity-50"
                >
                  {isConsulting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Chiedi'}
                </button>
              </div>
              
              {aiResponse && (
                <div className="mt-6 p-6 bg-white/5 rounded-3xl border border-white/10 animate-in fade-in slide-in-from-bottom-4">
                  <p className="text-sm text-slate-300 leading-relaxed italic whitespace-pre-wrap">{aiResponse}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800">Privacy & GDPR</h4>
              </div>
              <ul className="space-y-3">
                {['Registro Trattamenti Dati', 'Nomina Responsabili Esterni', 'Informativa Condòmini'].map((item, i) => (
                  <li key={i} className="flex items-center justify-between text-sm text-slate-600 p-2 hover:bg-slate-50 rounded-lg">
                    <span>{item}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <FileWarning className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800">Scadenze Fiscali</h4>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-100">
                  <p className="text-[10px] text-amber-600 font-bold uppercase mb-1">In Scadenza</p>
                  <p className="text-sm font-bold text-slate-800">Modello 770 / 2024</p>
                  <p className="text-xs text-slate-500">Mancano 12 giorni</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Checklist Sicurezza</h4>
            <div className="space-y-4">
              {[
                { label: 'Verifica Antincendio', status: 'OK', date: 'Maggio 2023' },
                { label: 'Analisi Acque (Legionella)', status: 'Pending', date: 'Giugno 2024' },
                { label: 'Messa a terra elettrica', status: 'OK', date: 'Aprile 2022' },
              ].map((check, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${check.status === 'OK' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">{check.label}</p>
                    <p className="text-[10px] text-slate-400">{check.date}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${check.status === 'OK' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {check.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 text-white p-6 rounded-[32px] shadow-lg relative overflow-hidden">
            <h4 className="text-lg font-bold mb-2">Aggiornamenti Normativi</h4>
            <p className="text-xs text-indigo-100 leading-relaxed mb-4">L'AI ha rilevato una nuova circolare dell'Agenzia delle Entrate sul Bonus Barriere Architettoniche.</p>
            <button className="text-xs font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">
              Leggi Approfondimento <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalFiscal;
