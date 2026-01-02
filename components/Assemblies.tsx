
import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  ChevronRight, 
  MessageSquare, 
  CheckSquare,
  Sparkles,
  FileText,
  Mic
} from 'lucide-react';
import { Assembly } from '../types';
import VoiceCommand from './VoiceCommand';
import { geminiService } from '../services/geminiService';

const Assemblies: React.FC = () => {
  const [assemblies, setAssemblies] = useState<Assembly[]>([
    { id: '1', title: 'Assemblea Ordinaria 2023', date: '2023-10-15', location: 'Sala Comune', status: 'Pianificata', agenda: ['Approvazione Bilancio 2022', 'Rinnovo Amministratore', 'Manutenzione Tetto'] },
    { id: '2', title: 'Assemblea Straordinaria - Superbonus', date: '2023-09-12', location: 'Online Zoom', status: 'Conclusa', agenda: ['Delibera Lavori 110%', 'Scelta Impresa'] },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [minutes, setMinutes] = useState<string | null>(null);

  const handleProcessTranscript = async (text: string) => {
    setIsGenerating(true);
    try {
      const result = await geminiService.generateAssemblyMinutes(text);
      setMinutes(result || 'Nessun risultato.');
    } catch (e) {
      alert("Errore AI: " + e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestione Assemblee</h2>
          <p className="text-slate-500">Pianifica, convoca e verbalizza con supporto AI.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 font-medium">
          <Plus className="w-4 h-4" /> Nuova Assemblea
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Assemblee in Programma</h3>
          {assemblies.map((assembly) => (
            <div key={assembly.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{assembly.title}</h4>
                  <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4" /> {assembly.date} • {assembly.location}
                  </p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                  assembly.status === 'Conclusa' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {assembly.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ordine del Giorno</p>
                {assembly.agenda.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-50">
                <button className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-emerald-600">
                  <FileText className="w-4 h-4" /> Convoca
                </button>
                <button className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-emerald-600 ml-auto">
                  Vedi Dettagli <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 text-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              Verbale Istantaneo AI
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Durante l'assemblea, attiva la dettatura vocale. L'intelligenza artificiale riassumerà i punti discussi, le delibere e i voti.
            </p>
            
            <VoiceCommand onResult={handleProcessTranscript} placeholder="Clicca il microfono e inizia a parlare..." />
            
            {isGenerating && (
              <div className="mt-6 p-4 bg-slate-700/50 rounded-xl border border-slate-600 animate-pulse text-sm text-slate-300">
                Sto analizzando la discussione e generando il verbale...
              </div>
            )}

            {minutes && (
              <div className="mt-6 p-6 bg-slate-900 rounded-xl border border-emerald-500/30 overflow-y-auto max-h-96 custom-scrollbar">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Anteprima Verbale AI</h5>
                  <button className="text-xs bg-emerald-500 text-white px-2 py-1 rounded" onClick={() => setMinutes(null)}>Chiudi</button>
                </div>
                <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {minutes}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex gap-4">
                  <button className="text-xs font-bold text-emerald-400 hover:underline">PDF</button>
                  <button className="text-xs font-bold text-emerald-400 hover:underline">DOCX</button>
                  <button className="text-xs font-bold text-emerald-400 hover:underline ml-auto">INVIA AI CONDÒMINI</button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Archivio Verbali</h3>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Verbale Assemblea 202{i}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Firmato digitalmente</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assemblies;
