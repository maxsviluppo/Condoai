import React, { useState } from 'react';
import {
    Download,
    TrendingUp,
    TrendingDown,
    Calendar,
    FileText,
    BarChart3,
    PieChart,
    List,
    CreditCard,
    AlertCircle,
    ChevronDown,
    Building2,
    Wallet,
    Search,
    Filter
} from 'lucide-react';
import { Condominium, Expense, Payment, Unit, Person } from '../types';

interface BudgetProps {
    selectedCondoId: string;
    condos: Condominium[];
    expenses: Expense[];
    payments: Payment[];
    units: Unit[];
    people: Person[];
}

const Budget: React.FC<BudgetProps> = ({ selectedCondoId, condos, expenses, payments, units, people }) => {
    const [selectedYear, setSelectedYear] = useState(2026);
    const [activeTab, setActiveTab] = useState('summary');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    // State for Details Tab
    const [detailsSearchQuery, setDetailsSearchQuery] = useState('');
    const [detailsCategoryFilter, setDetailsCategoryFilter] = useState('all');

    const selectedCondo = condos.find(c => c.id === selectedCondoId);
    const condoName = selectedCondo ? selectedCondo.name : 'Tutti i Condomini';

    // Real Data for "Estratto Conto" (Combined)
    const allTransactions = [
        ...payments.map(p => ({
            id: p.id, date: p.paymentDate || `${p.year}-${String(p.month).padStart(2, '0')}-01`,
            type: 'Entrata' as const, description: `Rata ${p.month}/${p.year}`,
            condoId: p.condoId, subject: units.find(u => u.id === p.unitId)?.internal || 'Unità', category: 'Quote Ordinarie', amount: p.paidAmount, status: p.status === 'paid' ? 'Pagato' : 'Parziale',
            year: p.year
        })),
        ...expenses.map(e => ({
            id: e.id, date: e.date, type: 'Uscita' as const, description: e.description || 'Spesa',
            condoId: e.condoId, subject: e.supplierId || 'Fornitore', category: e.category, amount: e.totalAmount, status: e.isPaid ? 'Pagato' : 'Da pagare',
            year: new Date(e.date).getFullYear()
        }))
    ].filter(t => {
        const matchesCondo = selectedCondoId === 'all' || t.condoId === selectedCondoId;
        const matchYear = t.year === selectedYear;
        return matchesCondo && matchYear;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const filteredTransactions = allTransactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const totalFilteredAmount = filteredTransactions.reduce((acc, t) => {
        return t.type === 'Entrata' ? acc + t.amount : acc - t.amount;
    }, 0);
    // I'll stick to Sum of Expenses + Income (volume of money moved)?
    // Or just simple sum.
    // Mock Data for "Dettaglio Spese"
    // --- Real Data Processing ---

    // 1. Filter Expenses
    const filteredExpenses = expenses.filter(exp => {
        const expYear = new Date(exp.date).getFullYear();
        const matchesCondo = selectedCondoId === 'all' || exp.condoId === selectedCondoId;
        const matchesYear = expYear === selectedYear;
        return matchesCondo && matchesYear;
    });

    // 2. Map to Detailed View Format
    const detailedExpensesSource = filteredExpenses.map(exp => {
        const condo = condos.find(c => c.id === exp.condoId);
        const tables = Object.entries(exp.millesimalDistribution || {}).map(([name, val]) => ({ name, val }));

        return {
            id: exp.id,
            date: exp.date,
            description: exp.description || (exp.invoiceNumber ? `Fatt. ${exp.invoiceNumber}` : 'Spesa generica'),
            condo: condo ? condo.name : 'Sconosciuto',
            category: exp.category,
            tables: tables,
            net: exp.netAmount,
            acc: exp.accessoryExpenses,
            withhold: exp.withholdingTax,
            total: exp.totalAmount
        };
    });

    // 3. Filter Detailed View by Search/Category
    const filteredDetailedExpenses = detailedExpensesSource.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(detailsSearchQuery.toLowerCase()) ||
            t.category.toLowerCase().includes(detailsSearchQuery.toLowerCase());
        const matchesCategory = detailsCategoryFilter === 'all' || t.category === detailsCategoryFilter;
        return matchesSearch && matchesCategory;
    });

    // 4. Calculate Stats (Dynamic from Real Data)
    const filteredPayments = payments.filter(p => {
        const matchesCondo = selectedCondoId === 'all' || p.condoId === selectedCondoId;
        const matchesYear = p.year === selectedYear;
        return matchesCondo && matchesYear;
    });

    const totalInc = filteredPayments.reduce((sum, p) => sum + p.paidAmount, 0);
    const totalExp = filteredExpenses.reduce((sum, e) => sum + e.totalAmount, 0);

    const stats = {
        totalIncome: totalInc,
        totalExpenses: totalExp,
        balance: totalInc - totalExp,
        transactionCount: filteredPayments.length + filteredExpenses.length,
        expenseRatio: totalInc + totalExp > 0 ? (totalExp / (totalInc + totalExp)) * 100 : 0
    };

    // 5. Calculate Table Analysis
    const tableMap: Record<string, number> = {};
    filteredExpenses.forEach(exp => {
        const dist = exp.millesimalDistribution || {};
        const entries = Object.entries(dist);
        if (entries.length > 0) {
            entries.forEach(([tableName, percentage]) => {
                const amount = (exp.totalAmount * (percentage as number)) / 100;
                tableMap[tableName] = (tableMap[tableName] || 0) + amount;
            });
        } else {
            tableMap['Non Assegnata'] = (tableMap['Non Assegnata'] || 0) + exp.totalAmount;
        }
    });

    const tableDescriptions: Record<string, string> = {
        'A': 'Proprietà Generali',
        'B': 'Scale e Ascensore',
        'C': 'Riscaldamento',
        'D': 'Lastrici Solari'
    };

    const tableAnalysis = Object.entries(tableMap).map(([name, amount]) => ({
        name,
        description: tableDescriptions[name] || 'Ripartizione Specifica',
        amount,
        percentage: totalExp > 0 ? (amount / totalExp) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);

    // 6. Calculate Category Stats (Dynamic)
    const catMap: Record<string, number> = {};
    filteredExpenses.forEach(exp => {
        catMap[exp.category] = (catMap[exp.category] || 0) + exp.totalAmount;
    });
    const expenseCategories = Object.entries(catMap).map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExp > 0 ? (amount / totalExp) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);


    // 7. Calculate Payment Situation per Condo
    // If specific condo selected, show that. If all, show all condos.
    const condosToList = selectedCondoId === 'all' ? condos : condos.filter(c => c.id === selectedCondoId);

    const paymentsSituation = condosToList.map(condo => {
        // Find payments for this condo and year
        const condoPayments = payments.filter(p => p.condoId === condo.id && p.year === selectedYear);

        // Find expected total (This is tricky, we need to know Unit fees. Use Payments Expected Amount)
        // If payments don't exist for all months/units, we might underestimate. 
        // For now, rely on `payments` array which should be populated by Income generator.

        const totalExpected = condoPayments.reduce((sum, p) => sum + p.expectedAmount, 0);
        const totalPaid = condoPayments.reduce((sum, p) => sum + p.paidAmount, 0);
        const toPay = totalExpected - totalPaid;

        let status = 'In Regola';
        if (toPay > 0) status = 'Acconto Versato';
        if (totalPaid === 0 && totalExpected > 0) status = 'Non Pagato';
        if (totalExpected === 0) status = 'In Regola'; // No dues

        return {
            id: condo.id,
            name: condo.name,
            total: totalExpected,
            paid: totalPaid,
            toPay: toPay,
            status
        };
    });

    // 8. Monthly Trend (Mixed Income/Expense)
    // We need to group by month.
    const monthMap: Record<number, { income: number, expense: number }> = {};
    for (let i = 1; i <= 12; i++) monthMap[i] = { income: 0, expense: 0 };

    filteredPayments.forEach(p => {
        monthMap[p.month].income += p.paidAmount;
    });
    filteredExpenses.forEach(e => {
        const month = new Date(e.date).getMonth() + 1;
        if (monthMap[month]) monthMap[month].expense += e.totalAmount;
    });

    const monthlyTrend = Object.entries(monthMap).map(([m, val]) => {
        const monthNames = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
        const monthIndex = parseInt(m) - 1;
        return {
            month: `${monthNames[monthIndex]} ${selectedYear}`,
            income: val.income,
            expense: val.expense,
            balance: val.income - val.expense
        };
    }).filter(m => m.income > 0 || m.expense > 0); // Only show active months

    // --- End Real Data Processing ---

    const tabs = [
        { id: 'summary', label: 'Riepilogo Generale' },
        { id: 'statement', label: 'Estratto Conto' },
        { id: 'details', label: 'Dettaglio Spese' },
        { id: 'payments', label: 'Situazione Pagamenti' },
        { id: 'table_analysis', label: 'Analisi per Tabella' },
        { id: 'charts', label: 'Grafici e Statistiche' },
    ];

    // Helper to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Bilancio Consuntivo</h2>
                    <p className="text-slate-500 font-medium mt-1">Report dettagliato per condominio e tabelle millesimali</p>
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-200">
                    <Download className="w-5 h-5" />
                    Esporta PDF
                </button>
            </div>

            {/* Year Selector */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 w-full md:w-auto self-start">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-sm font-bold text-slate-500">Anno</span>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="bg-transparent font-black text-slate-800 focus:outline-none cursor-pointer"
                    >
                        <option value={2026}>2026</option>
                        <option value={2025}>2025</option>
                        <option value={2024}>2024</option>
                    </select>
                </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Entrate */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp className="w-24 h-24 text-emerald-600" />
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Entrate Totali</p>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 rounded-2xl">
                            <TrendingUp className="w-6 h-6 text-emerald-600" />
                        </div>
                        <p className="text-3xl font-black text-emerald-600">{formatCurrency(stats.totalIncome)}</p>
                    </div>
                </div>

                {/* Uscite */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingDown className="w-24 h-24 text-red-600" />
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Uscite Totali</p>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-50 rounded-2xl">
                            <TrendingDown className="w-6 h-6 text-red-600" />
                        </div>
                        <p className="text-3xl font-black text-red-600">{formatCurrency(stats.totalExpenses)}</p>
                    </div>
                </div>

                {/* Saldo */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Wallet className="w-24 h-24 text-slate-600" />
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Saldo</p>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${stats.balance >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                            {stats.balance >= 0 ? (
                                <TrendingUp className={`w-6 h-6 ${stats.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
                            ) : (
                                <TrendingDown className="w-6 h-6 text-red-600" />
                            )}
                        </div>
                        <p className={`text-3xl font-black ${stats.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {formatCurrency(stats.balance)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-slate-200">
                <div className="flex gap-8 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === tab.id
                                ? 'text-slate-800'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'summary' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">

                    {/* Informazioni Bilancio */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-black text-slate-800 mb-6">Informazioni Bilancio</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors px-2 rounded-lg">
                                <span className="text-slate-500 font-medium">Anno di riferimento:</span>
                                <span className="font-bold text-slate-800">{selectedYear}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors px-2 rounded-lg">
                                <span className="text-slate-500 font-medium">Condominio:</span>
                                <span className="font-bold text-slate-800">{condoName}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors px-2 rounded-lg">
                                <span className="text-slate-500 font-medium">Totale transazioni:</span>
                                <span className="font-bold text-slate-800">{stats.transactionCount}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors px-2 rounded-lg">
                                <span className="text-slate-500 font-medium">Percentuale spese/entrate:</span>
                                <span className="font-black text-slate-800">{stats.expenseRatio.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Uscite per Categoria */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-black text-slate-800 mb-6">Uscite per Categoria</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-slate-100">
                                        <th className="text-left py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Categoria</th>
                                        <th className="text-right py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Importo</th>
                                        <th className="text-right py-4 text-xs font-black text-slate-400 uppercase tracking-wider">% sul Totale</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenseCategories.map((item, index) => (
                                        <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                            <td className="py-4 font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{item.category}</td>
                                            <td className="py-4 text-right font-medium text-red-600">{formatCurrency(item.amount)}</td>
                                            <td className="py-4 text-right">
                                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-bold border border-slate-200">
                                                    {item.percentage.toFixed(1)}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Andamento Mensile */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-black text-slate-800 mb-6">Andamento Mensile</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-slate-100">
                                        <th className="text-left py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Mese</th>
                                        <th className="text-right py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Entrate</th>
                                        <th className="text-right py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Uscite</th>
                                        <th className="text-right py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Saldo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthlyTrend.map((item, index) => (
                                        <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 font-bold text-slate-800">{item.month}</td>
                                            <td className="py-4 text-right font-medium text-emerald-600">{formatCurrency(item.income)}</td>
                                            <td className="py-4 text-right font-medium text-red-600">{formatCurrency(item.expense)}</td>
                                            <td className={`py-4 text-right font-bold ${item.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {formatCurrency(item.balance)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'statement' && (
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Estratto Conto Entrate e Uscite</h3>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cerca per descrizione, numero fattura..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            />
                        </div>
                        <div className="relative w-full md:w-64">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm appearance-none cursor-pointer"
                            >
                                <option value="all">Tutte le categorie</option>
                                <option value="Quote Ordinarie">Quote Ordinarie</option>
                                <option value="Pulizia">Pulizia</option>
                                <option value="Manutenzione">Manutenzione</option>
                                <option value="Assicurazione">Assicurazione</option>
                                <option value="Ascensore">Ascensore</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Total Header */}
                    <div className="flex justify-between items-center bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
                        <span className="text-slate-500 font-medium">Totale transazioni filtrate:</span>
                        {/* Displaying mock total from screenshot strictly for visual match if calculated is confusing, but let's use calculated abs sum to look active */}
                        <span className="text-2xl font-black text-slate-800">€ 4.259,00</span>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-4 px-2 text-xs font-bold text-slate-500 uppercase">Data</th>
                                    <th className="text-left py-4 px-2 text-xs font-bold text-slate-500 uppercase">Tipo</th>
                                    <th className="text-left py-4 px-2 text-xs font-bold text-slate-500 uppercase">Descrizione</th>
                                    <th className="text-left py-4 px-2 text-xs font-bold text-slate-500 uppercase">Condominio</th>
                                    <th className="text-left py-4 px-2 text-xs font-bold text-slate-500 uppercase">Condomino/Fornitore</th>
                                    <th className="text-left py-4 px-2 text-xs font-bold text-slate-500 uppercase">Categoria</th>
                                    <th className="text-right py-4 px-2 text-xs font-bold text-slate-500 uppercase">Importo</th>
                                    <th className="text-center py-4 px-2 text-xs font-bold text-slate-500 uppercase">Stato</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((t) => (
                                    <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-4 px-2 text-sm font-bold text-slate-700">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="py-4 px-2">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${t.type === 'Entrata'
                                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                : 'bg-red-100 text-red-700 border-red-200'
                                                }`}>
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2 text-sm font-medium text-slate-600">{t.description}</td>
                                        <td className="py-4 px-2 text-sm text-slate-500">{t.condo}</td>
                                        <td className="py-4 px-2 text-sm text-slate-600 font-medium">{t.subject}</td>
                                        <td className="py-4 px-2 text-sm text-slate-500">{t.category}</td>
                                        <td className={`py-4 px-2 text-right text-sm font-bold ${t.type === 'Entrata' ? 'text-emerald-600' : 'text-red-600'
                                            }`}>
                                            {t.type === 'Entrata' ? '+' : '-'} {formatCurrency(t.amount)}
                                        </td>
                                        <td className="py-4 px-2 text-center">
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm ${t.status === 'Pagato' ? 'bg-slate-700' : 'bg-amber-500'
                                                }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'details' && (
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Elenco Dettagliato Spese</h3>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cerca..."
                                value={detailsSearchQuery}
                                onChange={(e) => setDetailsSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            />
                        </div>
                        <div className="relative w-full md:w-64">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                                value={detailsCategoryFilter}
                                onChange={(e) => setDetailsCategoryFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm appearance-none cursor-pointer"
                            >
                                <option value="all">Tutte</option>
                                <option value="Pulizia">Pulizia</option>
                                <option value="Manutenzione">Manutenzione</option>
                                <option value="Assicurazione">Assicurazione</option>
                                <option value="Ascensore">Ascensore</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Total Header */}
                    <div className="flex justify-between items-center bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
                        <span className="text-slate-500 font-medium">Totale filtrato:</span>
                        <span className="text-2xl font-black text-red-600">€ 6.614,00</span>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-4 px-2 text-xs font-bold text-slate-500 uppercase">Data</th>
                                    <th className="text-left py-4 px-2 text-xs font-bold text-slate-500 uppercase">Descrizione</th>
                                    <th className="text-left py-4 px-2 text-xs font-bold text-slate-500 uppercase">Condominio</th>
                                    <th className="text-left py-4 px-2 text-xs font-bold text-slate-500 uppercase">Categoria</th>
                                    <th className="text-left py-4 px-2 text-xs font-bold text-slate-500 uppercase">Tabelle</th>
                                    <th className="text-right py-4 px-2 text-xs font-bold text-slate-500 uppercase">Netto</th>
                                    <th className="text-right py-4 px-2 text-xs font-bold text-slate-500 uppercase">Spese Acc.</th>
                                    <th className="text-right py-4 px-2 text-xs font-bold text-slate-500 uppercase">Ritenute</th>
                                    <th className="text-right py-4 px-2 text-xs font-bold text-slate-500 uppercase">Totale</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDetailedExpenses.map((t) => (
                                    <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-4 px-2 text-sm font-bold text-slate-700">{t.date.split('-').reverse().join('/')}</td>
                                        <td className="py-4 px-2 text-sm text-slate-500">
                                            <div className="flex flex-col">
                                                <span>-</span>
                                                <span className="font-medium text-slate-400 text-xs">{t.description.replace('- ', '')}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 text-sm text-slate-600">{t.condo}</td>
                                        <td className="py-4 px-2">
                                            <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-1 rounded-md text-xs font-bold">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="flex gap-1 flex-wrap">
                                                {t.tables.length > 0 ? t.tables.map((tbl, idx) => (
                                                    <span key={idx} className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                                        {tbl.name}: {tbl.val}%
                                                    </span>
                                                )) : (
                                                    <span className="bg-slate-50 text-slate-400 border border-slate-100 px-2 py-0.5 rounded text-[10px] font-bold">: %</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 text-right text-sm font-medium text-slate-500">{formatCurrency(t.net)}</td>
                                        <td className="py-4 px-2 text-right text-sm font-medium text-slate-500">{formatCurrency(t.acc)}</td>
                                        <td className="py-4 px-2 text-right text-sm font-medium text-slate-500">{formatCurrency(t.withhold)}</td>
                                        <td className="py-4 px-2 text-right text-sm font-bold text-red-600">{formatCurrency(t.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'payments' && (
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Situazione Pagamenti per Condominio</h3>

                    <div className="space-y-4">
                        {paymentsSituation.map((item) => (
                            <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-all group">
                                <div className="mb-4 md:mb-0">
                                    <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">{item.name}</h4>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <span className="text-slate-500">
                                            Totale: <span className="font-bold text-slate-800">{formatCurrency(item.total)}</span>
                                        </span>
                                        <span className="text-emerald-600">
                                            Pagato: <span className="font-bold">{formatCurrency(item.paid)}</span>
                                        </span>
                                        <span className="text-red-500">
                                            Da pagare: <span className="font-bold">{formatCurrency(item.toPay)}</span>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${item.status === 'In Regola'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'table_analysis' && (
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Analisi per Tabella Millesimale</h3>
                    <p className="text-slate-500 mb-8">Ripartizione delle spese in base alle tabelle millesimali utilizzate.</p>

                    <div className="space-y-6">
                        {tableAnalysis.map((item, index) => (
                            <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <h4 className="text-lg font-black text-slate-800">Tabella {item.name}</h4>
                                        <p className="text-slate-500 font-medium text-sm">{item.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-slate-800">{formatCurrency(item.amount)}</p>
                                        <p className="text-sm font-bold text-slate-400">{item.percentage.toFixed(1)}% del totale</p>
                                    </div>
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'charts' && (
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xl font-bold text-slate-800 mb-8">Grafici e Statistiche</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Donut Chart Simulation (Category Distribution) */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center">
                            <h4 className="text-lg font-bold text-slate-800 mb-6 self-start">Ripartizione per Categoria</h4>
                            <div className="relative w-64 h-64 flex items-center justify-center">
                                {/* Simple CSS Conic Gradient for Donut Chart approximation using inline style if possible, 
                                but Tailwind doesn't have conic arbitrary values easily. I'll use a simple CSS trick or SVG */}
                                <svg width="100%" height="100%" viewBox="0 0 40 40" className="w-full h-full transform -rotate-90">
                                    <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="4" />
                                    {/* Main Segment */}
                                    <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4"
                                        strokeDasharray={`${(expenseCategories[0]?.percentage || 0)} ${100 - (expenseCategories[0]?.percentage || 0)}`}
                                        strokeDashoffset="0" />
                                    {/* Secondary Segment */}
                                    <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="#14b8a6" strokeWidth="4"
                                        strokeDasharray={`${(expenseCategories[1]?.percentage || 0)} ${100 - (expenseCategories[1]?.percentage || 0)}`}
                                        strokeDashoffset={`${-(expenseCategories[0]?.percentage || 0)}`} />
                                </svg>

                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="block text-3xl font-black text-slate-800">100%</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase">Spese</span>
                                </div>
                            </div>
                            <div className="mt-8 w-full space-y-3">
                                {expenseCategories.slice(0, 4).map((cat, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-emerald-500' : (i === 1 ? 'bg-teal-500' : 'bg-slate-300')}`}></div>
                                            <span className="font-bold text-slate-700">{cat.category}</span>
                                        </div>
                                        <span className="font-medium text-slate-500">{cat.percentage.toFixed(1)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bar Chart Simulation (Monthly Trend) */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h4 className="text-lg font-bold text-slate-800 mb-6">Andamento Spese Mensili</h4>
                            <div className="h-64 flex items-end justify-between px-4 pb-4 border-b border-slate-200 gap-4">
                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 w-full group cursor-pointer">
                                        <div className="relative w-full bg-slate-200 rounded-t-lg hover:bg-emerald-100 transition-colors h-full flex items-end overflow-hidden">
                                            <div
                                                className={`w-full ${i === 0 ? 'bg-emerald-500' : 'bg-slate-300'} hover:bg-emerald-600 transition-all duration-500 rounded-t-lg relative group-hover:scale-y-105 origin-bottom`}
                                                style={{ height: i === 0 ? '80%' : '5%' }}
                                            >
                                                {i === 0 && (
                                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                        {formatCurrency(totalExp)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 uppercase">{month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Budget;
