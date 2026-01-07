
import React from 'react';
import { Home, Users, MapPin, Tag } from 'lucide-react';

const Units: React.FC = () => {
    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Unità Immobiliari</h2>
                <p className="text-slate-500 font-medium mt-2">Gestione unità, proprietari e inquilini</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-50 rounded-2xl">
                            <Home className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Totale Unità</p>
                            <p className="text-2xl font-black text-slate-800">36</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 rounded-2xl">
                            <Users className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Proprietari</p>
                            <p className="text-2xl font-black text-slate-800">42</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-50 rounded-2xl">
                            <Users className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Inquilini</p>
                            <p className="text-2xl font-black text-slate-800">18</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-50 rounded-2xl">
                            <MapPin className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Occupate</p>
                            <p className="text-2xl font-black text-slate-800">34</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-slate-800 mb-6">Elenco Unità</h3>
                <div className="text-center py-12 text-slate-400">
                    <Tag className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="font-bold">Sezione in sviluppo</p>
                    <p className="text-sm mt-2">La gestione delle unità sarà disponibile a breve</p>
                </div>
            </div>
        </div>
    );
};

export default Units;
