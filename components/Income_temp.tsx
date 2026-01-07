import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, CheckCircle, AlertTriangle, XCircle, Euro } from 'lucide-react';
import { Unit, Condominium, Payment, Person } from '../types';

interface IncomeProps {
    selectedCondoId: string;
    condos: Condominium[];
    units: Unit[];
    people: Person[];
}

const Income: React.FC<IncomeProps> = ({ selectedCondoId, condos, units, people }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<{ unitId: string; month: number } | null>(null);
    const [paymentForm, setPaymentForm] = useState({
        amount: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bonifico' as Payment['paymentMethod'],
        notes: ''
    });

    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

    // Filter units by selected condominium
    const filteredUnits = useMemo(() => {
        if (selectedCondoId === 'all') return units;
        return units.filter(u => u.condoId === selectedCondoId);
    }, [units, selectedCondoId]);

    // Get payment status for a unit and month
    const getPaymentStatus = (unitId: string, month: number): Payment | null => {
        return payments.find(p => p.unitId === unitId && p.month === month && p.year === selectedYear) || null;
    };

    // Calculate statistics
    const stats = useMemo(() => {
        const filtered = selectedCondoId === 'all' ? units : units.filter(u => u.condoId === selectedCondoId);
        const totalExpected = filtered.reduce((sum, u) => sum + (u.monthlyFee || 0), 0) * 12;
        const totalPaid = payments
            .filter(p => p.year === selectedYear && (selectedCondoId === 'all' || filtered.find(u => u.id === p.unitId)))
            .reduce((sum, p) => sum + p.paidAmount, 0);
        const totalPending = totalExpected - totalPaid;

        return {
            totalExpected,
            totalPaid,
            totalPending,
            collectionRate: totalExpected > 0 ? (totalPaid / totalExpected) * 100 : 0
        };
    }, [payments, units, selectedCondoId, selectedYear]);

    // Open payment modal
    const openPaymentModal = (unitId: string, month: number) => {
        const unit = units.find(u => u.id === unitId);
        const existingPayment = getPaymentStatus(unitId, month);

        setSelectedPayment({ unitId, month });
        setPaymentForm({
            amount: existingPayment?.paidAmount || unit?.monthlyFee || 0,
            paymentDate: existingPayment?.paymentDate || new Date().toISOString().split('T')[0],
            paymentMethod: existingPayment?.paymentMethod || 'Bonifico',
            notes: existingPayment?.notes || ''
        });
        setIsPaymentModalOpen(true);
    };

    // Save payment
    const handleSavePayment = () => {
        if (!selectedPayment) return;

        const unit = units.find(u => u.id === selectedPayment.unitId);
        if (!unit) return;

        const expectedAmount = unit.monthlyFee || 0;
        const paidAmount = paymentForm.amount;
        let status: Payment['status'] = 'unpaid';

        if (paidAmount >= expectedAmount) {
            status = 'paid';
        } else if (paidAmount > 0) {
            status = 'partial';
        }

        const newPayment: Payment = {
            id: `payment-${selectedPayment.unitId}-${selectedYear}-${selectedPayment.month}`,
            unitId: selectedPayment.unitId,
            condoId: unit.condoId,
            year: selectedYear,
            month: selectedPayment.month,
            expectedAmount,
            paidAmount,
            status,
            paymentDate: paymentForm.paymentDate,
            paymentMethod: paymentForm.paymentMethod,
            notes: paymentForm.notes
        };

        setPayments(prev => {
            const filtered = prev.filter(p => !(p.unitId === selectedPayment.unitId && p.month === selectedPayment.month && p.year === selectedYear));
            return [...filtered, newPayment];
        });

        setIsPaymentModalOpen(false);
    };

    // Delete payment
    const handleDeletePayment = () => {
        if (!selectedPayment) return;
        setPayments(prev => prev.filter(p => !(p.unitId === selectedPayment.unitId && p.month === selectedPayment.month && p.year === selectedYear)));
        setIsPaymentModalOpen(false);
    };

    // Get owner/tenant name
    const getUnitLabel = (unit: Unit) => {
        const owner = people.find(p => p.id === unit.ownerId);
        const tenant = people.find(p => p.id === unit.tenantId);
        const condo = condos.find(c => c.id === unit.condoId);

        const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'N/D';
        const tenantName = tenant ? `${tenant.firstName} ${tenant.lastName}` : (unit.tenantInfo ? `${unit.tenantInfo.firstName} ${unit.tenantInfo.lastName}` : null);

        return {
            condoName: condo?.name || 'N/D',
            internal: unit.internal,
            ownerName,
            tenantName
        };
    };

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Entrate - Pagamenti Mensili</h2>
                <p className="text-slate-500 font-medium mt-2">Gestisci le quote condominiali per ogni mese</p>
            </header>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 rounded-2xl">
                            <Euro className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Previsto Anno</p>
                            <p className="text-2xl font-black text-slate-800">€ {stats.totalExpected.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-50 rounded-2xl">
                            <TrendingUp className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Incassato</p>
                            <p className="text-2xl font-black text-slate-800">€ {stats.totalPaid.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-50 rounded-2xl">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Da Incassare</p>
                            <p className="text-2xl font-black text-slate-800">€ {stats.totalPending.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-violet-50 rounded-2xl">
                            <CheckCircle className="w-6 h-6 text-violet-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">% Riscossione</p>
                            <p className="text-2xl font-black text-slate-800">{stats.collectionRate.toFixed(1)}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Year Selector */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Calendar className="w-6 h-6 text-slate-400" />
                        <h3 className="text-xl font-black text-slate-800">Anno {selectedYear}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSelectedYear(prev => prev - 1)}
                            className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            <ChevronLeft className="w-5 h-5 text-slate-600" />
                        </button>
                        <span className="px-4 py-2 bg-slate-100 rounded-xl text-sm font-bold text-slate-700">
                            {selectedYear}
                        </span>
                        <button
                            onClick={() => setSelectedYear(prev => prev + 1)}
                            className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            <ChevronRight className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Payment Calendar Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full border-collapse">
                        <thead className="bg-slate-50 border-b-2 border-slate-200">
                            <tr>
                                <th className="sticky left-0 bg-slate-50 z-10 px-6 py-4 text-left w-64 border-r-2 border-slate-200">
                                    <span className="text-xs font-black text-slate-600 uppercase tracking-wider">Condomino</span>
                                </th>
                                {months.map((month, index) => (
                                    <th key={index} className="px-2 py-4 text-center w-32">
                                        <span className="text-xs font-black text-slate-600 uppercase tracking-wider">{month}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUnits.length === 0 ? (
                                <tr>
                                    <td colSpan={13} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-slate-50 rounded-full">
                                                <Calendar className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-400 font-medium">Nessuna unità trovata</p>
                                            <p className="text-sm text-slate-300">Seleziona un condominio o aggiungi unità</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUnits.map(unit => {
                                    const label = getUnitLabel(unit);
                                    const displayName = label.tenantName || label.ownerName;

                                    return (
                                        <tr key={unit.id} className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors">
                                            <td className="sticky left-0 bg-white hover:bg-slate-50/30 z-10 px-6 py-6 border-r-2 border-slate-200">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-base font-black text-slate-800">{displayName}</p>
                                                    <p className="text-xs text-slate-400">Int. {label.internal}</p>
                                                    <p className="text-xs font-bold text-emerald-600 mt-1">€ {unit.monthlyFee?.toFixed(2) || '0.00'}/mese</p>
                                                </div>
                                            </td>
                                            {months.map((_, monthIndex) => {
                                                const payment = getPaymentStatus(unit.id, monthIndex + 1);
                                                const expectedAmount = unit.monthlyFee || 0;
                                                const paidAmount = payment?.paidAmount || 0;
                                                const remaining = expectedAmount - paidAmount;

