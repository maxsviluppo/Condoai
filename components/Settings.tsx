import React, { useState } from 'react';
import {
    User,
    Tag,
    Shield,
    Bell,
    Save,
    Plus,
    Trash2,
    Building,
    Mail,
    Phone,
    FileText
} from 'lucide-react';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('admin');

    // Mock Admin Profile State
    const [adminProfile, setAdminProfile] = useState({
        studioName: 'Studio Rossi',
        adminName: 'Mario Rossi',
        address: 'Via Garibaldi 10',
        city: 'Milano',
        cap: '20121',
        vatNumber: 'IT12345678901',
        fiscalCode: 'RSSMRA80A01F205Z',
        email: 'info@studiorossi.it',
        pec: 'studiorossi@pec.it',
        phone: '02 12345678',
        iban: 'IT60X0542811101000000123456'
    });

    // Mock Categories State
    const [incomeCategories, setIncomeCategories] = useState([
        'Quote Ordinarie', 'Quote Straordinarie', 'Rimborsi', 'Affitti', 'Fondo Riserva', 'Interessi Attivi'
    ]);

    const [expenseCategories, setExpenseCategories] = useState([
        'Manutenzione Ordinaria', 'Manutenzione Straordinaria', 'Pulizia', 'Energia Elettrica',
        'Riscaldamento', 'Acqua', 'Amministrazione', 'Assicurazioni', 'Ascensore',
        'Spese Postali', 'Spese Bancarie', 'Giardinaggio'
    ]);

    const [newCategory, setNewCategory] = useState('');

    const handleSaveAdmin = () => {
        alert('Dati anagrafica salvati con successo!');
    };

    const addCategory = (type: 'income' | 'expense') => {
        if (!newCategory.trim()) return;
        if (type === 'income') {
            setIncomeCategories([...incomeCategories, newCategory]);
        } else {
            setExpenseCategories([...expenseCategories, newCategory]);
        }
        setNewCategory('');
    };

    const removeCategory = (type: 'income' | 'expense', cat: string) => {
        if (type === 'income') {
            setIncomeCategories(incomeCategories.filter(c => c !== cat));
        } else {
            setExpenseCategories(expenseCategories.filter(c => c !== cat));
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Impostazioni</h2>
                <p className="text-slate-500 font-medium mt-2">Gestisci il profilo amministratore e le configurazioni globali</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2">
                        <button
                            onClick={() => setActiveTab('admin')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-left ${activeTab === 'admin'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                        >
                            <User className="w-5 h-5" /> Anagrafica Amm.
                        </button>
                        <button
                            onClick={() => setActiveTab('categories')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-left ${activeTab === 'categories'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                        >
                            <Tag className="w-5 h-5" /> Categorie
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-left ${activeTab === 'security'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                        >
                            <Shield className="w-5 h-5" /> Sicurezza
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-left ${activeTab === 'notifications'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                        >
                            <Bell className="w-5 h-5" /> Notifiche
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {activeTab === 'admin' && (
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-slate-800">Dati Studio Amministrazione</h3>
                                <button
                                    onClick={handleSaveAdmin}
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-emerald-200"
                                >
                                    <Save className="w-4 h-4" /> Salva Modifiche
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Nome Studio / Ragione Sociale</label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={adminProfile.studioName}
                                            onChange={(e) => setAdminProfile({ ...adminProfile, studioName: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Nome Amministratore</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={adminProfile.adminName}
                                            onChange={(e) => setAdminProfile({ ...adminProfile, adminName: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Indirizzo</label>
                                    <input
                                        type="text"
                                        value={adminProfile.address}
                                        onChange={(e) => setAdminProfile({ ...adminProfile, address: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Città</label>
                                        <input
                                            type="text"
                                            value={adminProfile.city}
                                            onChange={(e) => setAdminProfile({ ...adminProfile, city: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">CAP</label>
                                        <input
                                            type="text"
                                            value={adminProfile.cap}
                                            onChange={(e) => setAdminProfile({ ...adminProfile, cap: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            value={adminProfile.email}
                                            onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Telefono</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={adminProfile.phone}
                                            onChange={(e) => setAdminProfile({ ...adminProfile, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Partita IVA</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={adminProfile.vatNumber}
                                            onChange={(e) => setAdminProfile({ ...adminProfile, vatNumber: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Codice Fiscale</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={adminProfile.fiscalCode}
                                            onChange={(e) => setAdminProfile({ ...adminProfile, fiscalCode: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'categories' && (
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-slate-800">Gestione Categorie</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Nuova categoria..."
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                    <button
                                        onClick={() => addCategory('expense')}
                                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-sm"
                                    >
                                        <Plus className="w-4 h-4" /> Agg. Spesa
                                    </button>
                                    <button
                                        onClick={() => addCategory('income')}
                                        className="flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-xl font-bold transition-all shadow-sm"
                                    >
                                        <Plus className="w-4 h-4" /> Agg. Incasso
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Income Categories */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-600 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        Categorie Entrate (Incassi)
                                    </h4>
                                    <div className="bg-slate-50 rounded-2xl p-2 border border-slate-100 space-y-1">
                                        {incomeCategories.map((cat, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                                <span className="font-medium text-slate-700">{cat}</span>
                                                <button
                                                    onClick={() => removeCategory('income', cat)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Expense Categories */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-600 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                        Categorie Uscite (Spese)
                                    </h4>
                                    <div className="bg-slate-50 rounded-2xl p-2 border border-slate-100 space-y-1">
                                        {expenseCategories.map((cat, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                                <span className="font-medium text-slate-700">{cat}</span>
                                                <button
                                                    onClick={() => removeCategory('expense', cat)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center text-slate-400">
                            Sezione Sicurezza (in sviluppo)
                        </div>
                    )}
                    {activeTab === 'notifications' && (
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center text-slate-400">
                            Sezione Notifiche (in sviluppo)
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
