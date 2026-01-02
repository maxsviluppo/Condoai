
import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronRight, 
  ChevronLeft,
  MessageSquare, 
  CheckSquare,
  Sparkles,
  FileText,
  Mic,
  LayoutList,
  CalendarDays
} from 'lucide-react';
import { Assembly } from '../types';
import VoiceCommand from './VoiceCommand';
import { geminiService } from '../services/geminiService';

const Assemblies: React.FC = () => {
  const [assemblies, setAssemblies] = useState<Assembly[]>([
    { id: '1', title: 'Assemblea Ordinaria 2023', date: '2023-10-15', location: 'Sala Comune', status: 'Pianificata', agenda: ['Approvazione Bilancio 2022', 'Rinnovo Amministratore', 'Manutenzione Tetto'] },
    { id: '2', title: 'Assemblea Straordinaria - Superbonus', date: '2023-09-12', location: 'Online Zoom', status: 'Conclusa', agenda: ['Delibera Lavori 110%', 'Scelta Impresa'] },
    { id: '3', title: 'Revisione Regolamento', date: '2023-11-05', location: 'Ufficio Studio Rossi', status: 'Pianificata', agenda: ['Modifica Orari Silenzio', 'Uso Parti Comuni'] },
  ]);

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(new Date(2023, 9, 1)); // Oct 2023 as base
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

  // Calendar Logic
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);
  
  // Adjust start day (0 is Sunday, so if we want Monday as first day)
  const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

  const calendarDays = [];
  for (let i = 0; i < adjustedStartDay; i++) calendarDays.push(null);
  for (let d = 1; d <= days; d++) calendarDays.push(d);

  const getAssembliesForDay = (day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return assemblies.filter(a => a.date === formattedDate);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestione Assemblee</h2>
          <p className="text-slate-500">Pianifica, convoca e verbalizza con supporto AI.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-xl border border-slate-200 flex shadow-sm">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutList className="w-4 h-4" /> Elenco
            </button>
            <button 
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'calendar' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <CalendarDays className="w-4 h-4" /> Calendario
            </button>
          </div>
          <button className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-600 font-bold shadow-lg shadow-emerald-100 transition-all text-sm">
            <Plus className="w-4 h-4" /> Nuova Assemblea
          </button>
        </div>
      </header>

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-700 mb-2 uppercase tracking-widest text-[10px]">Assemblee in Programma</h3>
            {assemblies.map((assembly) => (
              <div key={assembly.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-black text-slate-800 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{assembly.title}</h4>
                    <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                      <CalendarIcon className="w-4 h-4 text-emerald-500" /> {assembly.date} • {assembly.location}
                    </p>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border ${
                    assembly.status === 'Conclusa' ? 'bg-slate-50 text-slate-400 border-slate-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}>
                    {assembly.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-6 bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ordine del Giorno</p>
                  {assembly.agenda.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-50">
                  <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 hover:text-emerald-600 transition-colors">
                    <FileText className="w-4 h-4" /> Convoca
                  </button>
                  <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 hover:text-emerald-600 ml-auto transition-colors">
                    Vedi Dettagli <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                <Sparkles className="w-32 h-32 text-emerald-400" />
              </div>
              <h3 className="text-xl font-black flex items-center gap-3 mb-4 uppercase tracking-tight">
                <Sparkles className="w-6 h-6 text-emerald-400" />
                Verbale Istantaneo AI
              </h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Durante l'assemblea, attiva la dettatura vocale. L'intelligenza artificiale riassumerà i punti discussi, le delibere e i voti.
              </p>
              
              <VoiceCommand onResult={handleProcessTranscript} placeholder="Clicca il microfono e inizia a parlare..." />
              
              {isGenerating && (
                <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/10 animate-pulse text-sm text-emerald-400 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                  Sto analizzando la discussione e generando il verbale...
                </div>
              )}

              {minutes && (
                <div className="mt-8 p-8 bg-slate-800 rounded-[32px] border border-emerald-500/30 overflow-y-auto max-h-96 shadow-inner custom-scrollbar animate-in slide-in-from-top-4">
                  <div className="flex justify-between items-center mb-6">
                    <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Anteprima Verbale AI</h5>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors" onClick={() => setMinutes(null)}><XIcon className="w-4 h-4 text-slate-400" /></button>
                  </div>
                  <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-medium">
                    {minutes}
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/10 flex gap-6">
                    <button className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300">Esporta PDF</button>
                    <button className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300">Esporta DOCX</button>
                    <button className="text-[10px] font-black uppercase tracking-widest text-white bg-emerald-600 px-4 py-2 rounded-xl hover:bg-emerald-500 ml-auto">Invia ai Condòmini</button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-widest">Archivio Verbali</h3>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">Verbale Assemblea 202{i}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Firmato digitalmente</p>
                    </div>
                    <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
               <CalendarDays className="w-6 h-6 text-emerald-500" />
               Cronologia Assemblee
            </h3>
            <div className="flex items-center gap-6">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><ChevronLeft className="w-6 h-6" /></button>
              <span className="text-lg font-black text-slate-800 min-w-[150px] text-center uppercase tracking-widest">
                {monthNames[month]} {year}
              </span>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><ChevronRight className="w-6 h-6" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-[32px] overflow-hidden">
            {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
              <div key={day} className="bg-slate-50 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
            {calendarDays.map((d, i) => {
              const dayAssemblies = d ? getAssembliesForDay(d) : [];
              return (
                <div key={i} className={`min-h-[140px] bg-white p-4 transition-all ${d ? 'hover:bg-slate-50/50' : ''}`}>
                  {d && (
                    <>
                      <span className="text-xs font-black text-slate-300 mb-2 block">{d}</span>
                      <div className="space-y-2">
                        {dayAssemblies.map(a => (
                          <div 
                            key={a.id} 
                            className={`p-2 rounded-xl border text-[10px] font-black leading-tight cursor-pointer shadow-sm animate-in zoom-in-50 ${
                              a.status === 'Conclusa' 
                                ? 'bg-slate-50 text-slate-500 border-slate-200' 
                                : 'bg-emerald-500 text-white border-emerald-400'
                            }`}
                          >
                            <p className="truncate uppercase">{a.title}</p>
                            <div className="flex items-center gap-1 mt-1 opacity-80">
                               <ClockIcon className="w-3 h-3" /> {a.location}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400 justify-center">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" /> In Programma
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-200 rounded-full" /> Concluse
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default Assemblies;
