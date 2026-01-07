
import React, { useState, useMemo } from 'react';
import {
    TrendingDown,
    Plus,
    Search,
    X,
    Edit2,
    Trash2,
    Building2,
    Calendar,
    Receipt,
    CreditCard,
    User,
    Check,
    AlertCircle,
    Calculator
} from 'lucide-react';
import { Expense, Supplier, Condominium } from '../types';

interface ExpensesProps {
    selectedCondoId: string;
    condos: Condominium[];
}

const Expenses: React.FC<ExpensesProps> = ({ selectedCondoId, condos }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([
        { id: 's1', companyName: 'Elettricità Verdi SRL', category: 'Elettricista', phone: '02 1234567', email: 'info@elettricitaverdi.it', vatNumber: 'IT12345678901' }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [periodFilter, setPeriodFilter] = useState('month'); // 'month', '3months', 'year', 'all'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    // Form state
    const [expenseForm, setExpenseForm] = useState<Partial<Expense>>({
        condoId: '',
        type: 'Uscita',
        netAmount: 0,
        accessoryExpenses: 0,
        withholdingTax: 0,
        totalAmount: 0,
        date: new Date().toISOString().split('T')[0],
        category: 'Manutenzione Ordinaria',
        paymentMethod: 'Bonifico',
        supplierId: '',
        millesimalDistribution: {},
        isPaid: false,
        description: ''
    });

    // Supplier form state
    const [supplierForm, setSupplierForm] = useState({
        companyName: '',
        category: 'Altro' as Supplier['category'],
        contactPerson: '',
        phone: '',
        email: '',
        vatNumber: ''
    });

    // Calcola totale automaticamente
    const calculateTotal = () => {
        const total = (expenseForm.netAmount || 0) + (expenseForm.accessoryExpenses || 0) + (expenseForm.withholdingTax || 0);
        setExpenseForm({ ...expenseForm, totalAmount: total });
    };

    // Calcola percentuale totale ripartizione
    const totalDistribution = useMemo(() => {
        return Object.values(expenseForm.millesimalDistribution || {}).reduce((sum: number, val) => sum + (val as number), 0);
    }, [expenseForm.millesimalDistribution]);

    const isDistributionValid = totalDistribution === 100;

    // Get selected condominium for the form
    const selectedCondoForForm = condos.find(c => c.id === expenseForm.condoId);

    // Helper function to get date range based on period filter
    const getDateRange = () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOf3MonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        switch (periodFilter) {
            case 'month':
                return { start: startOfMonth, end: now };
            case '3months':
                return { start: startOf3MonthsAgo, end: now };
            case 'year':
                return { start: startOfYear, end: now };
            case 'all':
            default:
                return null;
        }
    };

    // Filter expenses
    const filteredExpenses = useMemo(() => {
        let result = expenses;

        // Filter by condominium (global filter)
        if (selectedCondoId !== 'all') {
            result = result.filter(e => e.condoId === selectedCondoId);
        }

        // Filter by period
        const dateRange = getDateRange();
        if (dateRange) {
            result = result.filter(e => {
                const expenseDate = new Date(e.date);
                return expenseDate >= dateRange.start && expenseDate <= dateRange.end;
            });
        }

        // Filter by search query
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(e =>
                e.description?.toLowerCase().includes(q) ||
                e.invoiceNumber?.toLowerCase().includes(q) ||
                suppliers.find(s => s.id === e.supplierId)?.companyName.toLowerCase().includes(q)
            );
        }

        return result;
    }, [expenses, selectedCondoId, periodFilter, searchQuery, suppliers]);

    // Statistics
    const stats = useMemo(() => {
        const filtered = selectedCondoId === 'all' ? expenses : expenses.filter(e => e.condoId === selectedCondoId);
        return {
            totalMonth: filtered.reduce((sum, e) => sum + (e.totalAmount as number), 0),
            invoiceCount: filtered.length,
            unpaid: filtered.filter(e => !e.isPaid).length
        };
    }, [expenses, selectedCondoId]);

    const openNewExpenseModal = () => {
        setEditingExpense(null);
        setExpenseForm({
            condoId: selectedCondoId !== 'all' ? selectedCondoId : (condos[0]?.id || ''),
            type: 'Uscita',
            netAmount: 0,
            accessoryExpenses: 0,
            withholdingTax: 0,
            totalAmount: 0,
            date: new Date().toISOString().split('T')[0],
            category: 'Manutenzione Ordinaria',
            paymentMethod: 'Bonifico',
            supplierId: '',
            millesimalDistribution: {},
            isPaid: false,
            description: ''
        });
        setIsModalOpen(true);
    };

    const handleSaveExpense = () => {
        if (!expenseForm.condoId || !expenseForm.supplierId) {
            alert('Compila i campi obbligatori: Condominio e Fornitore');
            return;
        }

        if (!isDistributionValid) {
            alert('La ripartizione millesimale deve sommare esattamente 100%');
            return;
        }

        const expenseToSave: Expense = {
            id: editingExpense?.id || `expense_${Date.now()}`,
            condoId: expenseForm.condoId!,
            type: 'Uscita',
            netAmount: expenseForm.netAmount || 0,
            accessoryExpenses: expenseForm.accessoryExpenses || 0,
            withholdingTax: expenseForm.withholdingTax || 0,
            totalAmount: expenseForm.totalAmount || 0,
            date: expenseForm.date || new Date().toISOString().split('T')[0],
            category: expenseForm.category || 'Altro',
            paymentMethod: expenseForm.paymentMethod || 'Bonifico',
            supplierId: expenseForm.supplierId!,
            millesimalDistribution: expenseForm.millesimalDistribution || {},
            invoiceNumber: expenseForm.invoiceNumber,
            isPaid: expenseForm.isPaid || false,
            description: expenseForm.description
        };

        if (editingExpense) {
            setExpenses(prev => prev.map(e => e.id === editingExpense.id ? expenseToSave : e));
        } else {
            setExpenses(prev => [...prev, expenseToSave]);
        }

        setIsModalOpen(false);
    };

    const handleSaveSupplier = () => {
        if (!supplierForm.companyName) {
            alert('Inserisci almeno la Ragione Sociale');
            return;
        }

        const newSupplier: Supplier = {
            id: `supplier_${Date.now()}`,
            companyName: supplierForm.companyName,
            category: supplierForm.category,
            contactPerson: supplierForm.contactPerson || undefined,
            phone: supplierForm.phone || undefined,
            email: supplierForm.email || undefined,
            vatNumber: supplierForm.vatNumber || undefined
        };

        setSuppliers(prev => [...prev, newSupplier]);
        setExpenseForm({ ...expenseForm, supplierId: newSupplier.id });

        // Reset supplier form
        setSupplierForm({
            companyName: '',
            category: 'Altro',
            contactPerson: '',
            phone: '',
            email: '',
            vatNumber: ''
        });

        setIsSupplierModalOpen(false);
    };

    const handleDeleteExpense = (id: string) => {
        if (confirm('Sei sicuro di voler eliminare questa spesa?')) {
            setExpenses(prev => prev.filter(e => e.id !== id));
        }
    };

    // When condominium changes in form, initialize millesimal distribution
    const handleCondoChange = (condoId: string) => {
        setExpenseForm({ ...expenseForm, condoId });
        const condo = condos.find(c => c.id === condoId);
        if (condo?.millesimalTables) {
            const initialDistribution: Record<string, number> = {};
            condo.millesimalTables.forEach(table => {
                const tableCode = table.name.split(' ')[1] || table.name;
                initialDistribution[tableCode] = 0;
            });
            setExpenseForm(prev => ({ ...prev, millesimalDistribution: initialDistribution }));
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Uscite</h2>
                <p className="text-slate-500 font-medium mt-2">Gestione spese e pagamenti del condominio</p>
            </header>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-50 rounded-2xl">
                            <TrendingDown className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Totale Mese</p>
                            <p className="text-2xl font-black text-slate-800">€ {stats.totalMonth.toFixed(2)}</p>
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
                            <p className="text-2xl font-black text-slate-800">{stats.invoiceCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-50 rounded-2xl">
                            <AlertCircle className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Da Pagare</p>
                            <p className="text-2xl font-black text-slate-800">{stats.unpaid}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                        <Search className="w-5 h-5 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Cerca per descrizione, fornitore, fattura..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-none text-sm font-medium text-slate-700 outline-none"
                        />
                    </div>

                    {/* Period Filter */}
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <select
                            value={periodFilter}
                            onChange={(e) => setPeriodFilter(e.target.value)}
                            className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all cursor-pointer"
                        >
                            <option value="month">Questo Mese</option>
                            <option value="3months">Ultimi 3 Mesi</option>
                            <option value="year">Anno Corrente</option>
                            <option value="all">Tutto</option>
                        </select>
                    </div>

                    {/* Global Filter Indicator */}
                    {selectedCondoId !== 'all' && (
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
                            <Building2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-bold text-emerald-700">
                                {condos.find(c => c.id === selectedCondoId)?.name}
                            </span>
                        </div>
                    )}

                    {/* New Expense Button */}
                    <button
                        onClick={openNewExpenseModal}
                        className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-2xl hover:bg-red-600 transition-all shadow-lg text-sm font-black uppercase tracking-widest"
                    >
                        <Plus className="w-5 h-5" />
                        Nuova Uscita
                    </button>
                </div>
            </div>

            {/* Expenses Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Condominio</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Categoria</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Fornitore</th>
                                <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Importo</th>
                                <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase tracking-wider">Stato</th>
                                <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredExpenses.length > 0 ? (
                                filteredExpenses.map(expense => {
                                    const condo = condos.find(c => c.id === expense.condoId);
                                    const supplier = suppliers.find(s => s.id === expense.supplierId);

                                    return (
                                        <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm font-bold text-slate-700">
                                                        {new Date(expense.date).toLocaleDateString('it-IT')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-slate-400" />
                                                    <span className="font-bold text-slate-700 text-xs">{condo?.name || 'N/D'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                                                    {expense.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-slate-400" />
                                                    <span className="text-xs font-bold text-slate-700">{supplier?.companyName || 'N/D'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-sm font-black text-red-600">€ {expense.totalAmount.toFixed(2)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {expense.isPaid ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                                                        <Check className="w-3 h-3" />
                                                        Pagato
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Da Pagare
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button
                                                        onClick={() => {
                                                            setEditingExpense(expense);
                                                            setExpenseForm(expense);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                                                        title="Modifica"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteExpense(expense.id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Elimina"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <Receipt className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                                        <p className="text-slate-400 font-bold">Nessuna spesa trovata</p>
                                        <p className="text-slate-300 text-sm mt-1">Aggiungi la prima uscita cliccando su "Nuova Uscita"</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Nuova Uscita */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-red-50 to-white">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-500 rounded-2xl">
                                    <TrendingDown className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800">
                                        {editingExpense ? 'Modifica Uscita' : 'Nuova Uscita'}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium">Registra una spesa del condominio</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {/* Tipo e Condominio */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Tipo *</label>
                                    <input
                                        type="text"
                                        value="Uscita"
                                        disabled
                                        className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Condominio *</label>
                                    <select
                                        value={expenseForm.condoId}
                                        onChange={(e) => handleCondoChange(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                                    >
                                        <option value="">-- Seleziona Condominio --</option>
                                        {condos.map(condo => (
                                            <option key={condo.id} value={condo.id}>{condo.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Importi */}
                            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 space-y-4">
                                <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">Importi</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Netto Pagato</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={expenseForm.netAmount || ''}
                                            onChange={(e) => {
                                                setExpenseForm({ ...expenseForm, netAmount: parseFloat(e.target.value) || 0 });
                                                setTimeout(calculateTotal, 0);
                                            }}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Spese Accessorie</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={expenseForm.accessoryExpenses || ''}
                                            onChange={(e) => {
                                                setExpenseForm({ ...expenseForm, accessoryExpenses: parseFloat(e.target.value) || 0 });
                                                setTimeout(calculateTotal, 0);
                                            }}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Ritenute d'Acconto</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={expenseForm.withholdingTax || ''}
                                            onChange={(e) => {
                                                setExpenseForm({ ...expenseForm, withholdingTax: parseFloat(e.target.value) || 0 });
                                                setTimeout(calculateTotal, 0);
                                            }}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-600">Totale Spesa *</span>
                                        <span className="text-2xl font-black text-red-600">€ {expenseForm.totalAmount?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Calcolato automaticamente: Netto + Spese Accessorie + Ritenute</p>
                                </div>
                            </div>

                            {/* Data e Categoria */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Data *</label>
                                    <input
                                        type="date"
                                        value={expenseForm.date}
                                        onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Categoria</label>
                                    <select
                                        value={expenseForm.category}
                                        onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as any })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                                    >
                                        <option value="Manutenzione Ordinaria">Manutenzione Ordinaria</option>
                                        <option value="Manutenzione Straordinaria">Manutenzione Straordinaria</option>
                                        <option value="Pulizia">Pulizia</option>
                                        <option value="Energia Elettrica">Energia Elettrica</option>
                                        <option value="Riscaldamento">Riscaldamento</option>
                                        <option value="Acqua">Acqua</option>
                                        <option value="Amministrazione">Amministrazione</option>
                                        <option value="Assicurazioni">Assicurazioni</option>
                                        <option value="Altro">Altro</option>
                                    </select>
                                </div>
                            </div>

                            {/* Metodo Pagamento e Fornitore */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Metodo Pagamento</label>
                                    <select
                                        value={expenseForm.paymentMethod}
                                        onChange={(e) => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value as any })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                                    >
                                        <option value="Bonifico">Bonifico</option>
                                        <option value="Assegno">Assegno</option>
                                        <option value="Contanti">Contanti</option>
                                        <option value="Carta">Carta</option>
                                        <option value="RID">RID</option>
                                        <option value="Altro">Altro</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Fornitore *</label>
                                    <div className="flex gap-2">
                                        <select
                                            value={expenseForm.supplierId}
                                            onChange={(e) => setExpenseForm({ ...expenseForm, supplierId: e.target.value })}
                                            className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                                        >
                                            <option value="">-- Seleziona Fornitore --</option>
                                            {suppliers.map(supplier => (
                                                <option key={supplier.id} value={supplier.id}>{supplier.companyName}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setIsSupplierModalOpen(true)}
                                            className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all"
                                            title="Nuovo Fornitore"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Ripartizione Millesimale */}
                            {selectedCondoForForm?.millesimalTables && selectedCondoForForm.millesimalTables.length > 0 ? (
                                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                            <Calculator className="w-4 h-4" />
                                            Ripartizione per Tabelle Millesimali
                                        </h4>
                                        <span className="text-xs text-slate-500">Inserisci la percentuale di imputazione per ogni tabella (totale deve essere 100%)</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        {selectedCondoForForm.millesimalTables.map(table => {
                                            const tableCode = table.name.split(' ')[1] || table.name;
                                            return (
                                                <div key={table.id} className="space-y-2">
                                                    <label className="text-sm font-bold text-slate-700">{table.name}</label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                            value={expenseForm.millesimalDistribution?.[tableCode] || ''}
                                                            onChange={(e) => {
                                                                const newDistribution = { ...expenseForm.millesimalDistribution };
                                                                newDistribution[tableCode] = parseFloat(e.target.value) || 0;
                                                                setExpenseForm({ ...expenseForm, millesimalDistribution: newDistribution });
                                                            }}
                                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-8 text-sm font-medium focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                                                        />
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">%</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className={`p-4 rounded-xl border-2 ${isDistributionValid ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-700">Totale:</span>
                                            <span className={`text-2xl font-black ${isDistributionValid ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {totalDistribution.toFixed(2)}%
                                            </span>
                                        </div>
                                        {!isDistributionValid && (
                                            <p className="text-xs text-red-600 mt-2 font-bold">⚠️ Il totale deve essere esattamente 100% per poter salvare</p>
                                        )}
                                    </div>
                                </div>
                            ) : expenseForm.condoId ? (
                                <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
                                    <p className="text-sm font-bold text-orange-700">⚠️ Nessuna tabella millesimale configurata per questo condominio</p>
                                    <p className="text-xs text-orange-600 mt-1">Configura le tabelle millesimali nella sezione Condomini</p>
                                </div>
                            ) : null}

                            {/* N. Fattura e Già Pagato */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">N. Fattura</label>
                                    <input
                                        type="text"
                                        value={expenseForm.invoiceNumber || ''}
                                        onChange={(e) => setExpenseForm({ ...expenseForm, invoiceNumber: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                                        placeholder="es. FT-2024-001"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Stato Pagamento</label>
                                    <label className="flex items-center gap-3 bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 cursor-pointer hover:bg-slate-100 transition-all">
                                        <input
                                            type="checkbox"
                                            checked={expenseForm.isPaid}
                                            onChange={(e) => setExpenseForm({ ...expenseForm, isPaid: e.target.checked })}
                                            className="w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                                        />
                                        <span className="text-sm font-bold text-slate-700">Già pagato</span>
                                    </label>
                                </div>
                            </div>

                            {/* Descrizione */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Descrizione</label>
                                <textarea
                                    value={expenseForm.description || ''}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                                    rows={3}
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all resize-none"
                                    placeholder="Note aggiuntive sulla spesa..."
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/50">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl hover:bg-slate-200 transition-all font-black uppercase tracking-widest text-sm"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleSaveExpense}
                                className="px-8 py-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all shadow-lg font-black uppercase tracking-widest text-sm flex items-center gap-2"
                            >
                                <Check className="w-5 h-5" />
                                {editingExpense ? 'Aggiorna Uscita' : 'Crea Uscita'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Nuovo Fornitore */}
            {isSupplierModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xl font-black text-slate-800">Nuovo Fornitore Veloce</h3>
                            <button
                                onClick={() => setIsSupplierModalOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Ragione Sociale *</label>
                                <input
                                    type="text"
                                    value={supplierForm.companyName}
                                    onChange={(e) => setSupplierForm({ ...supplierForm, companyName: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    placeholder="es. Idraulica Rossi S.r.l."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Categoria *</label>
                                <select
                                    value={supplierForm.category}
                                    onChange={(e) => setSupplierForm({ ...supplierForm, category: e.target.value as any })}
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                >
                                    <option value="Idraulico">Idraulico</option>
                                    <option value="Elettricista">Elettricista</option>
                                    <option value="Pulizie">Pulizie</option>
                                    <option value="Manutenzione">Manutenzione</option>
                                    <option value="Amministrazione">Amministrazione</option>
                                    <option value="Assicurazioni">Assicurazioni</option>
                                    <option value="Altro">Altro</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Referente</label>
                                <input
                                    type="text"
                                    value={supplierForm.contactPerson}
                                    onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    placeholder="Nome e cognome"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Telefono</label>
                                    <input
                                        type="tel"
                                        value={supplierForm.phone}
                                        onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                        placeholder="+39..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">P. IVA</label>
                                    <input
                                        type="text"
                                        value={supplierForm.vatNumber}
                                        onChange={(e) => setSupplierForm({ ...supplierForm, vatNumber: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                        placeholder="IT..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Email</label>
                                <input
                                    type="email"
                                    value={supplierForm.email}
                                    onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    placeholder="info@fornitore.it"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 flex justify-end gap-4">
                            <button
                                onClick={() => setIsSupplierModalOpen(false)}
                                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl hover:bg-slate-200 transition-all font-bold"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleSaveSupplier}
                                className="px-6 py-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-lg font-bold"
                            >
                                Crea
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
