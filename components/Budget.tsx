
import React from 'react';
import { BarChart3, FileText, Calendar, TrendingUp } from 'lucide-react';

const Budget: React.FC = () => {
    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Bilancio Consuntivo</h2>
                <p className="text-slate-500 font-medium mt-2">Rendiconto annuale e situazione patrimoniale</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-50 rounded-2xl">
                            <TrendingUp className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Entrate Anno</p>
                            <p className="text-2xl font-black text-slate-800">€ 225K</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-50 rounded-2xl">
                            <TrendingUp className="w-6 h-6 text-red-500 rotate-180" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Uscite Anno</p>
                            <p className="text-2xl font-black text-slate-800">€ 198K</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 rounded-2xl">
                            <BarChart3 className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Saldo</p>
                            <p className="text-2xl font-black text-emerald-600">€ 27K</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-50 rounded-2xl">
                            <Calendar className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Anno</p>
                            <p className="text-2xl font-black text-slate-800">2025</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-slate-800 mb-6">Bilancio Annuale</h3>
                <div className="text-center py-12 text-slate-400">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="font-bold">Sezione in sviluppo</p>
                    <p className="text-sm mt-2">Il bilancio consuntivo sarà disponibile a breve</p>
                </div>
            </div>
        </div>
    );
};

export default Budget;
