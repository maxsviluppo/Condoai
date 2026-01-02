
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  AlertCircle, 
  TrendingUp, 
  Wallet, 
  Calendar,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface DashboardProps {
  selectedCondoId: string;
}

const mockData = [
  { name: 'Gen', spesa: 2400 },
  { name: 'Feb', spesa: 1398 },
  { name: 'Mar', spesa: 9800 },
  { name: 'Apr', spesa: 3908 },
  { name: 'Mag', spesa: 4800 },
  { name: 'Giu', spesa: 3800 },
];

const Dashboard: React.FC<DashboardProps> = ({ selectedCondoId }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const condoNames: Record<string, string> = {
    'all': 'Riepilogo Tutti i Condomini',
    '1': 'Villa dei Fiori',
    '2': 'Residenza Parco'
  };

  const handleManualAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const insight = await geminiService.analyzeFinancials({
        context: selectedCondoId === 'all' ? 'Portafoglio Globale' : condoNames[selectedCondoId],
        total_spend: selectedCondoId === 'all' ? 52400 : 26106,
        top_category: 'Manutenzione',
        status: 'Cassa in positivo',
        morosity_rate: selectedCondoId === 'all' ? '5.2%' : '4%'
      });
      setAiInsight(insight || 'Analisi completata.');
    } catch (e) {
      setAiInsight('Errore durante la generazione dell\'analisi AI.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            {condoNames[selectedCondoId]}
          </h2>
          <p className="text-slate-500">
            {selectedCondoId === 'all' 
              ? 'Dati aggregati di tutto il tuo portafoglio immobiliare.' 
              : `Dettagli e performance per ${condoNames[selectedCondoId]}.`}
          </p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Saldo Cassa', value: selectedCondoId === 'all' ? '€ 45.890' : '€ 12.450', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Spese Mese', value: selectedCondoId === 'all' ? '€ 8.120' : '€ 3.820', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Morosità', value: selectedCondoId === 'all' ? '5.2%' : '4.2%', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Prossima Ass.', value: '12 Ott', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-all hover:shadow-md">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Andamento Spese Annuali</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="spesa" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden group">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-emerald-400" /> 
            Analisi AI
          </h3>
          <div className="space-y-4 relative z-10">
            {aiInsight ? (
              <p className="text-slate-300 text-sm leading-relaxed italic">"{aiInsight}"</p>
            ) : (
              <p className="text-slate-400 text-sm italic">Fai clic su 'Analizza' per generare approfondimenti finanziari con l'AI.</p>
            )}
            <div className="pt-4 border-t border-slate-700">
              <button 
                onClick={handleManualAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" /> Elaborazione...
                  </>
                ) : (
                  <>Analizza Dati Finanziari →</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
