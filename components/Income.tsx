
import React from 'react';
import { TrendingUp, DollarSign, Calendar, Tag } from 'lucide-react';

const Income: React.FC = () => {
    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Entrate</h2>
                <p className="text-slate-500 font-medium mt-2">Gestione incassi e pagamenti ricevuti</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-50 rounded-2xl">
                            <TrendingUp className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Totale Mese</p>
                            <p className="text-2xl font-black text-slate-800">€ 18.750</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 rounded-2xl">
                            <DollarSign className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Pagamenti</p>
                            <p className="text-2xl font-black text-slate-800">42</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-yellow-50 rounded-2xl">
                            <Calendar className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">In Attesa</p>
                            <p className="text-2xl font-black text-slate-800">7</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-slate-800 mb-6">Ultime Entrate</h3>
                <div className="text-center py-12 text-slate-400">
                    <Tag className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="font-bold">Sezione in sviluppo</p>
                    <p className="text-sm mt-2">La gestione delle entrate sarà disponibile a breve</p>
                </div>
            </div>
        </div>
    );
};

export default Income;
