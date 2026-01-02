
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Sparkles, AlertCircle, Target, Loader2, Zap, UserX, BarChart3, ShieldAlert, RefreshCw } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';

const mockData = [
  { name: 'Gen', costi: 2400, prev: 2300, morosita: 400 },
  { name: 'Feb', costi: 2100, prev: 2200, morosita: 350 },
  { name: 'Mar', costi: 4500, prev: 2500, morosita: 800 },
  { name: 'Apr', costi: 2800, prev: 2600, morosita: 600 },
  { name: 'Mag', costi: 2300, prev: 2700, morosita: 450 },
  { name: 'Giu', costi: 2600, prev: 2800, morosita: 500 },
];

const Analytics: React.FC = () => {
  const [insight, setInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleManualAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await geminiService.analyzeRisksAndPrevention({
        costs: mockData,
        complaints: ['ascensore rumoroso', 'luci accese h24 garage'],
        delays: '3 condòmini in ritardo'
      });
      setInsight(result);
    } catch (e) {
      setInsight("Analisi non disponibile. Riprova più tardi.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Analisi & Prevenzione</h2>
          <p className="text-slate-500">Anticipa i problemi monitorando pattern di spesa e impianti.</p>
        </div>
        <button 
          onClick={handleManualAnalyze}
          disabled={isAnalyzing}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-emerald-400" />}
          Analizza con AI
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Anomalie Costi', value: '+12%', icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-50', trend: 'In aumento vs 2022' },
          { label: 'Efficienza Energia', value: 'B+', icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Consumi stabili' },
          { label: 'Rischio Morosità', value: 'Medio', icon: UserX, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Monitoraggio attivo' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}><stat.icon className="w-6 h-6" /></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="text-3xl font-black text-slate-800 mb-1">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-8">Spese: Reale vs Previsione</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData}>
                  <defs>
                    <linearGradient id="colorCosti" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="costi" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCosti)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><Sparkles className="w-6 h-6 text-emerald-400" /> Insight Strategico</h3>
          {insight ? (
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-sm leading-relaxed text-slate-300 italic">
              {insight}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center space-y-4">
              <BarChart3 className="w-12 h-12 opacity-20" />
              <p className="text-sm">Nessuna analisi generata.<br/>Clicca il tasto in alto per iniziare.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
