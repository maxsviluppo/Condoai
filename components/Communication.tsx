
import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, Filter, ShieldAlert, Info, Coffee, Search, Send, Loader2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { Message } from '../types';

const Communication: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'Rossi (Int. 4)', text: 'C\'è una macchia di umidità nel corridoio del terzo piano, vicino all\'ascensore.', timestamp: '10:15', category: 'Urgente' },
    { id: '2', sender: 'Bianchi (Int. 12)', text: 'Qualcuno sa quando passa il tecnico della caldaia? Mi serve saperlo per organizzarmi.', timestamp: '11:30', category: 'Informativo' },
    { id: '3', sender: 'Verdi (Int. 7)', text: 'Auguri di buon compleanno alla signora Maria!', timestamp: '12:00', category: 'Social' },
    { id: '4', sender: 'Anonimo', text: 'Ma perché le luci del garage sono sempre accese anche di giorno? Che spreco.', timestamp: '14:20', category: 'Informativo' },
  ]);

  const [activeTab, setActiveTab] = useState<string>('Tutti');
  const [isProcessing, setIsProcessing] = useState(false);

  const runAIFilter = async () => {
    setIsProcessing(true);
    try {
      const results = await geminiService.classifyAndSummarizeMessages(messages);
      const updatedMessages = messages.map(msg => {
        const aiInfo = results.find((r: any) => r.id === msg.id);
        return aiInfo ? { ...msg, category: aiInfo.category, summary: aiInfo.summary } : msg;
      });
      setMessages(updatedMessages);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const categories = [
    { label: 'Tutti', icon: MessageSquare },
    { label: 'Urgente', icon: ShieldAlert, color: 'text-red-500' },
    { label: 'Informativo', icon: Info, color: 'text-blue-500' },
    { label: 'Social', icon: Coffee, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Hub Comunicazione</h2>
          <p className="text-slate-500">Gestione messaggi con filtraggio intelligente AI.</p>
        </div>
        <button 
          onClick={runAIFilter}
          disabled={isProcessing}
          className="bg-slate-900 text-white px-6 py-2 rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-emerald-400" />}
          <span>AI Smart Filter</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Filtra per Categoria</p>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveTab(cat.label)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    activeTab === cat.label ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <cat.icon className={`w-4 h-4 ${cat.color || ''}`} />
                  <span className="text-sm">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20">
            <h4 className="text-sm font-bold text-emerald-700 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" /> AI FAQ Auto-Reply
            </h4>
            <p className="text-xs text-emerald-600/80 leading-relaxed">
              L'AI sta rispondendo a 3 domande comuni riguardanti il tecnico caldaia e le rate scadute.
            </p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-300" />
            <input type="text" placeholder="Cerca tra i messaggi o chiedi all'AI..." className="flex-1 bg-transparent border-none focus:ring-0 text-sm" />
          </div>

          <div className="space-y-3">
            {messages
              .filter(m => activeTab === 'Tutti' || m.category === activeTab)
              .map((msg) => (
              <div key={msg.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                      msg.category === 'Urgente' ? 'bg-red-100 text-red-600' : 
                      msg.category === 'Social' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {msg.sender.substring(0, 1)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{msg.sender}</h4>
                      <p className="text-[10px] text-slate-400 uppercase">{msg.timestamp}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                    msg.category === 'Urgente' ? 'bg-red-50 text-red-600' :
                    msg.category === 'Social' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {msg.category}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{msg.text}</p>
                {msg.summary && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs italic text-slate-500 flex items-start gap-2">
                    <Sparkles className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    <span>AI Summary: {msg.summary}</span>
                  </div>
                )}
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-xs font-bold text-slate-400 hover:text-emerald-500">Rispondi</button>
                  <button className="text-xs font-bold text-slate-400 hover:text-blue-500">Converti in Ticket</button>
                  <button className="text-xs font-bold text-slate-400 hover:text-red-500 ml-auto">Archivia</button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-lg flex items-center gap-3">
            <input type="text" placeholder="Scrivi un avviso condominiale..." className="flex-1 bg-transparent border-none focus:ring-0 text-sm" />
            <button className="p-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communication;
