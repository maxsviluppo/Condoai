
import React from 'react';
import { TrendingDown, Receipt, Calendar, Tag } from 'lucide-react';

const Expenses: React.FC = () => {
    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Uscite</h2>
                <p className="text-slate-500 font-medium mt-2">Gestione spese e pagamenti del condominio</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-50 rounded-2xl">
                            <TrendingDown className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Totale Mese</p>
                            <p className="text-2xl font-black text-slate-800">€ 12.450</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-50 rounded-2xl">
                            <Receipt className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Fatture</p>
                            <p className="text-2xl font-black text-slate-800">24</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-50 rounded-2xl">
                            <Calendar className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">In Scadenza</p>
                            <p className="text-2xl font-black text-slate-800">3</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-slate-800 mb-6">Ultime Uscite</h3>
                <div className="text-center py-12 text-slate-400">
                    <Tag className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="font-bold">Sezione in sviluppo</p>
                    <p className="text-sm mt-2">La gestione delle uscite sarà disponibile a breve</p>
                </div>
            </div>
        </div>
    );
};

export default Expenses;
