
import React, { useState, useMemo } from 'react';
import {
    Home,
    Plus,
    Search,
    X,
    Edit2,
    Trash2,
    Building2,
    Users,
    MapPin,
    ChevronDown,
    User,
    UserCheck,
    Calculator,
    Layers,
    Check
} from 'lucide-react';
import { Unit, Condominium, Person } from '../types';

interface UnitsProps {
    units: Unit[];
    condos: Condominium[];
    people: Person[];
    selectedCondoId: string; // Filtro globale dall'App
    onAddUnit: (unit: Unit) => void;
    onUpdateUnit: (unit: Unit) => void;
    onDeleteUnit: (id: string) => void;
}

const Units: React.FC<UnitsProps> = ({
    units,
    condos,
    people,
    selectedCondoId, // Riceve il filtro globale
    onAddUnit,
    onUpdateUnit,
    onDeleteUnit
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

    // Form state
    const [unitForm, setUnitForm] = useState<Partial<Unit>>({
        condoId: '',
        internal: '',
        staircase: '',
        floor: '',
        type: 'Appartamento',
        surface: undefined,
        monthlyFee: undefined,
        subalterno: '',
        millesimals: {},
        ownerId: '',
        tenantId: undefined,
        isRented: false
    });

    // Millesimals form state (dynamic based on selected condo)
    const [millesimalValues, setMillesimalValues] = useState<Record<string, number>>({});

    // Tenant info state (per inserimento diretto)
    const [tenantInfo, setTenantInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    // Get selected condominium for the form
    const selectedCondoForForm = condos.find(c => c.id === unitForm.condoId);

    // Filter units
    const filteredUnits = useMemo(() => {
        let result = units;

        // Filter by condominium (usa il filtro globale)
        if (selectedCondoId !== 'all') {
            result = result.filter(u => u.condoId === selectedCondoId);
        }

        // Filter by search query
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(u =>
                u.internal.toLowerCase().includes(q) ||
                (u.staircase?.toLowerCase() || '').includes(q) ||
                (u.subalterno?.toLowerCase() || '').includes(q) ||
                people.find(p => p.id === u.ownerId)?.lastName.toLowerCase().includes(q) ||
                people.find(p => p.id === u.ownerId)?.firstName.toLowerCase().includes(q)
            );
        }

        return result;
    }, [units, selectedCondoId, searchQuery, people]);

    // Statistics
    const stats = useMemo(() => {
        const filtered = selectedCondoId === 'all' ? units : units.filter(u => u.condoId === selectedCondoId);
        return {
            total: filtered.length,
            rented: filtered.filter(u => u.isRented || u.tenantId).length,
            owned: filtered.filter(u => !u.isRented && !u.tenantId).length,
            apartments: filtered.filter(u => u.type === 'Appartamento').length
        };
    }, [units, selectedCondoId]);

    const openNewUnitModal = () => {
        setEditingUnit(null);
        setUnitForm({
            condoId: selectedCondoId !== 'all' ? selectedCondoId : (condos[0]?.id || ''),
            internal: '',
            staircase: '',
            floor: '',
            type: 'Appartamento',
            surface: undefined,
            monthlyFee: undefined,
            subalterno: '',
            millesimals: {},
            ownerId: '',
            tenantId: undefined,
            isRented: false
        });
        setMillesimalValues({});
        setIsModalOpen(true);
    };

    const openEditUnitModal = (unit: Unit) => {
        setEditingUnit(unit);
        setUnitForm(unit);
        setMillesimalValues(unit.millesimals || {});
        setIsModalOpen(true);
    };

    const handleSaveUnit = () => {
        if (!unitForm.condoId || !unitForm.internal || !unitForm.floor || !unitForm.ownerId) {
            alert('Compila i campi obbligatori: Condominio, Numero Interno, Piano e Proprietario');
            return;
        }

        // Se l'inquilino è "new", salva i dati inseriti
        let finalTenantId = unitForm.tenantId;
        let finalTenantInfo = undefined;

        if (unitForm.tenantId === 'new') {
            if (!tenantInfo.firstName || !tenantInfo.lastName) {
                alert('Inserisci almeno nome e cognome dell\'inquilino');
                return;
            }
            finalTenantId = undefined; // Non c'è un ID perché non è in anagrafica
            finalTenantInfo = {
                firstName: tenantInfo.firstName,
                lastName: tenantInfo.lastName,
                email: tenantInfo.email || undefined,
                phone: tenantInfo.phone || undefined
            };
        }

        const unitToSave: Unit = {
            id: editingUnit?.id || `unit_${Date.now()}`,
            condoId: unitForm.condoId,
            internal: unitForm.internal,
            staircase: unitForm.staircase,
            floor: unitForm.floor,
            type: unitForm.type || 'Appartamento',
            surface: unitForm.surface,
            monthlyFee: unitForm.monthlyFee,
            subalterno: unitForm.subalterno,
            millesimals: millesimalValues,
            ownerId: unitForm.ownerId || '',
            tenantId: finalTenantId,
            tenantInfo: finalTenantInfo,
            isRented: !!finalTenantId || !!finalTenantInfo
        };

        if (editingUnit) {
            onUpdateUnit(unitToSave);
        } else {
            onAddUnit(unitToSave);
        }

        // Reset form
        setTenantInfo({ firstName: '', lastName: '', email: '', phone: '' });
        setIsModalOpen(false);
    };

    const handleDeleteUnit = (id: string) => {
        if (confirm('Sei sicuro di voler eliminare questa unità immobiliare?')) {
            onDeleteUnit(id);
        }
    };

    // When condominium changes in form, initialize millesimals
    const handleCondoChange = (condoId: string) => {
        setUnitForm({ ...unitForm, condoId });
        const condo = condos.find(c => c.id === condoId);
        if (condo?.millesimalTables) {
            const initialMillesimals: Record<string, number> = {};
            condo.millesimalTables.forEach(table => {
                const tableCode = table.name.split(' ')[1] || table.name; // Extract "A" from "Tabella A"
                initialMillesimals[tableCode] = 0;
            });
            setMillesimalValues(initialMillesimals);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Unità Immobiliari</h2>
                <p className="text-slate-500 font-medium mt-2">Gestisci appartamenti, negozi e altre unità</p>
            </header>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-50 rounded-2xl">
                            <Home className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Totale Unità</p>
                            <p className="text-2xl font-black text-slate-800">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 rounded-2xl">
                            <Building2 className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Appartamenti</p>
                            <p className="text-2xl font-black text-slate-800">{stats.apartments}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-50 rounded-2xl">
                            <UserCheck className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Affittate</p>
                            <p className="text-2xl font-black text-slate-800">{stats.rented}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-50 rounded-2xl">
                            <User className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Proprietà</p>
                            <p className="text-2xl font-black text-slate-800">{stats.owned}</p>
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
                            placeholder="Cerca per numero, proprietario, inquilino..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-none text-sm font-medium text-slate-700 outline-none"
                        />
                    </div>

                    {/* Indicatore Filtro Globale */}
                    {selectedCondoId !== 'all' && (
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
                            <Building2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-bold text-emerald-700">
                                {condos.find(c => c.id === selectedCondoId)?.name}
                            </span>
                        </div>
                    )}

                    {/* New Unit Button */}
                    <button
                        onClick={openNewUnitModal}
                        className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-2xl hover:bg-emerald-600 transition-all shadow-lg text-sm font-black uppercase tracking-widest"
                    >
                        <Plus className="w-5 h-5" />
                        Nuova Unità
                    </button>
                </div>
            </div>

            {/* Units Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-black uppercase text-[10px] tracking-widest border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Condominio</th>
                                <th className="px-6 py-4">Unità</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4">Proprietario</th>
                                <th className="px-6 py-4">Inquilino</th>
                                <th className="px-6 py-4">Millesimi</th>
                                <th className="px-6 py-4 text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUnits.length > 0 ? (
                                filteredUnits.map(unit => {
                                    const condo = condos.find(c => c.id === unit.condoId);
                                    const owner = people.find(p => p.id === unit.ownerId);
                                    const tenant = people.find(p => p.id === unit.tenantId);

                                    return (
                                        <tr key={unit.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-slate-400" />
                                                    <span className="font-bold text-slate-700 text-xs">{condo?.name || 'N/D'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-black text-slate-800 uppercase tracking-tight">
                                                    {unit.staircase ? `Scala ${unit.staircase} - ` : ''}Int. {unit.internal}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-medium mt-1">
                                                    Piano: {unit.floor} {unit.subalterno ? `• Sub: ${unit.subalterno}` : ''}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                                                    {unit.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {owner ? (
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-indigo-500" />
                                                        <span className="text-xs font-bold text-slate-700">
                                                            {owner.firstName} {owner.lastName}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-300 italic">Non assegnato</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {tenant ? (
                                                    <div className="flex items-center gap-2">
                                                        <UserCheck className="w-4 h-4 text-emerald-500" />
                                                        <span className="text-xs font-bold text-emerald-600">
                                                            {tenant.firstName} {tenant.lastName}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-300 italic">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {Object.entries(unit.millesimals || {}).map(([table, value]) => (
                                                        <div key={table} className="bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5 flex items-center gap-1">
                                                            <span className="text-[9px] font-black text-indigo-400 uppercase">{table}:</span>
                                                            <span className="text-[10px] font-mono font-bold text-indigo-700">{(value as number).toFixed(3)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button
                                                        onClick={() => openEditUnitModal(unit)}
                                                        className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                                                        title="Modifica"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUnit(unit.id)}
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
                                    <td colSpan={7} className="p-16 text-center text-slate-300 font-bold uppercase tracking-widest italic">
                                        Nessuna unità immobiliare trovata
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for New/Edit Unit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md transition-all overflow-y-auto">
                    <div className="bg-white w-full max-w-4xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 my-10 border border-slate-100">
                        {/* Header */}
                        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center text-white shadow-2xl ring-4 ring-emerald-400/10">
                                    <Home className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                                        {editingUnit ? 'Modifica Unità' : 'Nuova Unità'}
                                    </h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                                        Inserisci i dati dell'unità immobiliare
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-3 hover:bg-slate-100 rounded-full transition-all"
                            >
                                <X className="w-8 h-8 text-slate-300" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {/* Condominio Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-emerald-500" />
                                    Condominio *
                                </label>
                                <select
                                    value={unitForm.condoId}
                                    onChange={(e) => handleCondoChange(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    required
                                >
                                    <option value="">-- Seleziona Condominio --</option>
                                    {condos.map(condo => (
                                        <option key={condo.id} value={condo.id}>{condo.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Scala</label>
                                    <input
                                        type="text"
                                        placeholder="es. A, B, 1"
                                        value={unitForm.staircase || ''}
                                        onChange={(e) => setUnitForm({ ...unitForm, staircase: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Numero Interno *</label>
                                    <input
                                        type="text"
                                        placeholder="es. 1, A1, Int.5"
                                        value={unitForm.internal}
                                        onChange={(e) => setUnitForm({ ...unitForm, internal: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Tipo *</label>
                                    <select
                                        value={unitForm.type}
                                        onChange={(e) => setUnitForm({ ...unitForm, type: e.target.value as any })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    >
                                        <option value="Appartamento">Appartamento</option>
                                        <option value="Negozio">Negozio</option>
                                        <option value="Box">Box</option>
                                        <option value="Cantina">Cantina</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Piano *</label>
                                    <input
                                        type="text"
                                        placeholder="es. 1, T, S1"
                                        value={unitForm.floor}
                                        onChange={(e) => setUnitForm({ ...unitForm, floor: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Superficie (mq)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="es. 85.50"
                                        value={unitForm.surface || ''}
                                        onChange={(e) => setUnitForm({ ...unitForm, surface: e.target.value ? parseFloat(e.target.value) : undefined })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Quota Mensile Ordinaria (€)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Lascia vuoto per usare quota condominio"
                                        value={unitForm.monthlyFee || ''}
                                        onChange={(e) => setUnitForm({ ...unitForm, monthlyFee: e.target.value ? parseFloat(e.target.value) : undefined })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Catastale */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Riferimento Catastale (Subalterno)</label>
                                <input
                                    type="text"
                                    placeholder="es. Fg 123 Part 456 Sub 7"
                                    value={unitForm.subalterno || ''}
                                    onChange={(e) => setUnitForm({ ...unitForm, subalterno: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-mono font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                />
                            </div>

                            {/* Millesimals Section */}
                            {selectedCondoForForm?.millesimalTables && selectedCondoForForm.millesimalTables.length > 0 && (
                                <div className="p-8 bg-indigo-50/30 rounded-[32px] border border-indigo-100 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Layers className="w-6 h-6 text-indigo-600" />
                                        <h4 className="text-sm font-black text-indigo-600 uppercase tracking-widest">
                                            Millesimi per Tabella
                                        </h4>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">
                                        Inserisci i millesimi secondo le tabelle configurate per questo condominio
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedCondoForForm.millesimalTables.map((table) => {
                                            const tableCode = table.name.split(' ')[1]?.replace('-', '') || table.id;
                                            return (
                                                <div key={table.id} className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                                        <Calculator className="w-3 h-3 text-indigo-500" />
                                                        {table.name}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.001"
                                                        placeholder="0.000"
                                                        value={millesimalValues[tableCode] || ''}
                                                        onChange={(e) => setMillesimalValues({
                                                            ...millesimalValues,
                                                            [tableCode]: e.target.value ? parseFloat(e.target.value) : 0
                                                        })}
                                                        className="w-full bg-white border-2 border-indigo-200 rounded-xl px-4 py-3 text-sm font-mono font-bold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Owner and Tenant */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <User className="w-4 h-4 text-indigo-500" />
                                        Proprietario *
                                    </label>
                                    <select
                                        value={unitForm.ownerId}
                                        onChange={(e) => setUnitForm({ ...unitForm, ownerId: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                        required
                                    >
                                        <option value="">-- Seleziona Proprietario --</option>
                                        {people.filter(p => p.role === 'Proprietario').map(person => (
                                            <option key={person.id} value={person.id}>
                                                {person.firstName} {person.lastName} - {person.fiscalCode}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <UserCheck className="w-4 h-4 text-emerald-500" />
                                        Inquilino (opzionale)
                                    </label>

                                    {/* Opzione: Seleziona esistente o inserisci nuovo */}
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setUnitForm({ ...unitForm, tenantId: undefined })}
                                            className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${!unitForm.tenantId
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            Nessun Inquilino
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!unitForm.tenantId) {
                                                    setUnitForm({ ...unitForm, tenantId: 'new' });
                                                }
                                            }}
                                            className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${unitForm.tenantId === 'new'
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            Inserisci Nuovo
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (people.filter(p => p.role === 'Inquilino').length > 0) {
                                                    setUnitForm({ ...unitForm, tenantId: people.filter(p => p.role === 'Inquilino')[0]?.id });
                                                }
                                            }}
                                            className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${unitForm.tenantId && unitForm.tenantId !== 'new'
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            Seleziona Esistente
                                        </button>
                                    </div>

                                    {/* Se seleziona esistente */}
                                    {unitForm.tenantId && unitForm.tenantId !== 'new' && (
                                        <select
                                            value={unitForm.tenantId || ''}
                                            onChange={(e) => setUnitForm({
                                                ...unitForm,
                                                tenantId: e.target.value || undefined,
                                                isRented: !!e.target.value
                                            })}
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                        >
                                            <option value="">-- Seleziona Inquilino --</option>
                                            {people.filter(p => p.role === 'Inquilino').map(person => (
                                                <option key={person.id} value={person.id}>
                                                    {person.firstName} {person.lastName} - {person.fiscalCode}
                                                </option>
                                            ))}
                                        </select>
                                    )}

                                    {/* Se inserisce nuovo inquilino */}
                                    {unitForm.tenantId === 'new' && (
                                        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-3">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dati Inquilino</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Nome *"
                                                    value={tenantInfo.firstName}
                                                    onChange={(e) => setTenantInfo({ ...tenantInfo, firstName: e.target.value })}
                                                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Cognome *"
                                                    value={tenantInfo.lastName}
                                                    onChange={(e) => setTenantInfo({ ...tenantInfo, lastName: e.target.value })}
                                                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                                />
                                            </div>
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={tenantInfo.email}
                                                onChange={(e) => setTenantInfo({ ...tenantInfo, email: e.target.value })}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Telefono"
                                                value={tenantInfo.phone}
                                                onChange={(e) => setTenantInfo({ ...tenantInfo, phone: e.target.value })}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                            />
                                            <p className="text-xs text-slate-500 italic">ℹ️ Informazioni per uso interno dell'amministratore</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/50">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-8 py-4 font-black text-slate-400 text-xs uppercase tracking-widest hover:text-slate-600 transition-all"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleSaveUnit}
                                className="px-14 py-5 bg-emerald-500 text-white rounded-[24px] font-black shadow-2xl hover:bg-emerald-600 transition-all flex items-center gap-3"
                            >
                                <Check className="w-6 h-6" />
                                {editingUnit ? 'Aggiorna Unità' : 'Crea Unità'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Units;
