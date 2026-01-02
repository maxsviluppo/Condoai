
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Sparkles, AlertCircle, Target, Loader2, Zap, UserX, BarChart3, ShieldAlert } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const result = await geminiService.analyzeRisksAndPrevention({
          costs: mockData,
          complaints: ['ascensore rumoroso', 'luci accese h24 garage', 'pulizia insufficiente cortile'],
          delays: '3 condòmini in ritardo cronico, picco a Marzo'
        });
        setInsight(result);
      } catch (e) {
        setInsight("Analisi temporaneamente non disponibile.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInsight();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Analisi & Prevenzione</h2>
        <p className="text-slate-500">Anticipa i problemi monitorando pattern di spesa, impianti e morosità.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Anomalie Costi', value: '+12%', icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-50', trend: 'Rilevato picco riscaldamento' },
          { label: 'Efficienza Energia', value: 'B+', icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Risparmio 5% vs 2022' },
          { label: 'Rischio Morosità', value: 'Medio', icon: UserX, color: 'text-amber-600', bg: 'bg-amber-50', trend: '3 posizioni critiche identificate' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
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
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-slate-800">Spese: Reale vs Previsione AI</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-3 h-1 bg-indigo-500 rounded-full" /> Effettivo
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-3 h-1 bg-emerald-400 rounded-full" /> Forecast AI
                </div>
              </div>
            </div>
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
                  <Tooltip 
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area type="monotone" dataKey="costi" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCosti)" />
                  <Line type="monotone" dataKey="prev" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-8">Pattern di Morosità</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '15px', border: 'none'}}
                  />
                  <Bar dataKey="morosita" fill="#f59e0b" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-xs text-slate-500 italic">L'AI evidenzia un picco critico nel mese di Marzo dovuto a conguagli riscaldamento.</p>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-24 h-24 text-emerald-400" />
          </div>
          
          <div className="relative z-10 flex-1">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-emerald-400" /> Analisi Preventiva
            </h3>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin" />
                <p className="text-sm font-medium">L'AI sta analizzando i big data...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-sm leading-relaxed text-slate-300 italic whitespace-pre-wrap">
                  {insight}
                </div>
                
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Azioni Consigliate</h4>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Target className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium">Ottimizza sensori garage</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium">Rateizza morosi Marzo</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
             <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all">
                GENERA REPORT PREVENTIVO
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
