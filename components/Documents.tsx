
import React, { useState } from 'react';
import { FileText, Search, Sparkles, Download, Clock, ShieldCheck, Plus } from 'lucide-react';
import { Document } from '../types';
import { geminiService } from '../services/geminiService';

const Documents: React.FC = () => {
  const [docs, setDocs] = useState<Document[]>([
    { id: '1', name: 'Regolamento Condominiale.pdf', category: 'Regolamento', uploadDate: '2023-01-15', aiSummary: 'Il regolamento vieta l\'uso dei balconi come depositi e disciplina gli orari del silenzio dalle 22:00 alle 08:00.' },
    { id: '2', name: 'Certificato Prevenzione Incendi.pdf', category: 'Certificazione', uploadDate: '2023-05-20', expiryDate: '2028-05-20' },
    { id: '3', name: 'Contratto Manutenzione Ascensori.pdf', category: 'Contratto', uploadDate: '2023-03-10', expiryDate: '2024-03-10' },
  ]);

  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const handleAIQuery = async (doc: Document) => {
    setAnalyzingId(doc.id);
    // Simuliamo l'interrogazione del documento
    const summary = await geminiService.analyzeDocument(doc.name, "Simulated content of " + doc.name);
    setDocs(docs.map(d => d.id === doc.id ? { ...d, aiSummary: summary } : d));
    setAnalyzingId(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Archivio Documentale</h2>
          <p className="text-slate-500">Documenti categorizzati e indicizzati tramite AI.</p>
        </div>
        <button className="bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-600 transition-colors">
          <Plus className="w-4 h-4" /> Carica Documento
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Cerca nel regolamento o nei contratti..." className="flex-1 border-none focus:ring-0 text-sm bg-transparent" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Documento</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Categoria</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Scadenza</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {docs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{doc.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Caricato il {doc.uploadDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">{doc.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      {doc.expiryDate ? (
                        <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {doc.expiryDate}
                        </span>
                      ) : <span className="text-xs text-slate-300">N/D</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleAIQuery(doc)}
                          className={`p-2 rounded-lg transition-colors ${analyzingId === doc.id ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400 hover:text-emerald-500'}`}
                          title="Chiedi all'AI"
                        >
                          {analyzingId === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        </button>
                        <button className="p-2 text-slate-400 hover:text-blue-500"><Download className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform">
              <ShieldCheck className="w-32 h-32" />
            </div>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-400" /> Compliance Checker
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Stato Normativo</p>
                <p className="text-sm text-slate-300 italic">"Tutti i certificati obbligatori sono in corso di validità. Il CPI scade tra 5 anni."</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Prossimi Adempimenti</p>
                <div className="flex items-center justify-between text-xs p-2 hover:bg-white/5 rounded cursor-pointer">
                  <span>Aggiornamento DVR</span>
                  <span className="text-amber-400">Dic 2023</span>
                </div>
              </div>
            </div>
          </div>

          {docs.some(d => d.aiSummary) && (
            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm animate-in fade-in slide-in-from-right-4">
              <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Analisi Documento AI
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed italic">
                {docs.find(d => d.aiSummary)?.aiSummary}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

export default Documents;
