
import React, { useState } from 'react';
import { AlertTriangle, Phone, ShieldAlert, Zap, Droplets, Flame, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const EmergencyHub: React.FC = () => {
  const [activeEmergency, setActiveEmergency] = useState<string | null>(null);
  const [aiChecklist, setAiChecklist] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTriggerEmergency = async (type: string) => {
    setActiveEmergency(type);
    setIsProcessing(true);
    const checklist = await geminiService.suggestEmergencyAction(type);
    setAiChecklist(checklist);
    setIsProcessing(false);
  };

  const emergencies = [
    { id: 'water', label: 'Allagamento', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'fire', label: 'Incendio / Fumo', icon: Flame, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'power', label: 'Blackout Totale', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'danger', label: 'Pericolo Strutturale', icon: ShieldAlert, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-800">Crisis Center</h2>
        <p className="text-slate-500">Gestisci le urgenze in tempo reale con il supporto dell'intelligenza artificiale.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {emergencies.map((em) => (
          <button
            key={em.id}
            onClick={() => handleTriggerEmergency(em.label)}
            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${
              activeEmergency === em.label 
                ? 'border-red-500 bg-red-50 scale-105 shadow-xl shadow-red-100' 
                : 'border-transparent bg-white hover:border-slate-200 shadow-sm'
            }`}
          >
            <div className={`p-4 rounded-2xl ${em.bg} ${em.color}`}>
              <em.icon className="w-8 h-8" />
            </div>
            <span className="text-sm font-bold text-slate-700">{em.label}</span>
          </button>
        ))}
      </div>

      {activeEmergency && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in duration-300">
          <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              <h3 className="text-xl font-black uppercase tracking-tight">Protocollo {activeEmergency}</h3>
            </div>
            
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200">
                <span>CHIAMA PRONTO INTERVENTO</span>
                <Phone className="w-5 h-5" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-colors">
                <span>AVVISA TUTTI I CONDÒMINI (SMS/PUSH)</span>
                <ShieldAlert className="w-5 h-5" />
              </button>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Contatti Rapidi</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Idraulico H24</p>
                  <p className="text-sm font-bold text-slate-800">02 123 4567</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Manut. Ascensore</p>
                  <p className="text-sm font-bold text-slate-800">800 99 88 77</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="w-24 h-24 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-emerald-400" /> Guida Operativa AI
            </h3>
            
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center h-48 gap-4">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                <p className="text-emerald-400 text-sm animate-pulse">L'AI sta analizzando la procedura...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                  <p className="text-sm text-slate-300 leading-relaxed italic whitespace-pre-wrap">
                    {aiChecklist}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Fornitori Allertati</p>
                    <p className="text-xs text-slate-500">2 aziende hanno ricevuto la notifica</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyHub;
