
import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  Users,
  Home,
  Plus,
  Search,
  MapPin,
  UserPlus,
  X,
  Check,
  Fingerprint,
  Edit2,
  Trash2,
  Mail,
  Smartphone,
  ShieldCheck,
  PlusCircle,
  Database,
  UserRoundPlus,
  ClipboardList,
  Hash,
  UserMinus,
  Copy,
  Info,
  ChevronRight,
  Archive,
  Table,
  Layers,
  Trash
} from 'lucide-react';
import { Condominium, Unit, Person } from '../types';

interface CondominiumRegistryProps {
  initialCondoId?: string;
  condos: Condominium[];
  people: Person[];
  units: Unit[];
  onAddCondo: (condo: Condominium) => void;
  onUpdateCondo: (condo: Condominium) => void;
  onDeleteCondo: (id: string) => void;
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
  setUnits: React.Dispatch<React.SetStateAction<Unit[]>>;
}

const CondominiumRegistry: React.FC<CondominiumRegistryProps> = ({
  initialCondoId = 'all',
  condos,
  people,
  units,
  onAddCondo,
  onUpdateCondo,
  onDeleteCondo,
  setPeople,
  setUnits
}) => {
  const [selectedCondo, setSelectedCondo] = useState<Condominium | null>(
    initialCondoId === 'all' ? (condos.length > 0 ? condos[0] : null) : condos.find(c => c.id === initialCondoId) || condos[0]
  );

  const [activeTab, setActiveTab] = useState<'units' | 'people'>('units');

  // Modals Visibility
  const [isCondoModalOpen, setIsCondoModalOpen] = useState(false);
  const [isEditingCondo, setIsEditingCondo] = useState(false);

  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [isEditingPerson, setIsEditingPerson] = useState(false);
  const [currentPersonId, setCurrentPersonId] = useState<string | null>(null);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);

  // Advanced Flow States
  const [isTenantActive, setIsTenantActive] = useState(false);
  const [unitStrategy, setUnitStrategy] = useState<'archive' | 'new' | 'none'>('new');

  // Form State for Millesimals (Local Helper)
  const [millesimalEntries, setMillesimalEntries] = useState<{ label: string, value: number }[]>([{ label: 'A', value: 0 }]);

  // State for Condominium Millesimal Tables
  const [condoMillesimalTables, setCondoMillesimalTables] = useState<{ code: string, label: string, description: string }[]>([]);

  // Forms State
  const [condoForm, setCondoForm] = useState({
    name: '',
    street: '',
    streetNumber: '',
    cap: '',
    city: '',
    province: '',
    fiscalCode: '',
    cadastralData: '',
    constructionYear: undefined as number | undefined,
    numberOfFloors: undefined as number | undefined,
    numberOfStaircases: undefined as number | undefined,
    numberOfUnits: 0,
    monthlyFee: undefined as number | undefined,
    imageUrl: '',
    hasElevator: false,
    hasCentralHeating: false,
    hasGarden: false,
    hasParking: false,
    notes: ''
  });

  const [ownerForm, setOwnerForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', fiscalCode: '',
    street: '', civico: '', cap: '', city: '', prov: '', role: 'Proprietario' as const
  });

  const [tenantForm, setTenantForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', fiscalCode: '',
    street: '', civico: '', cap: '', city: '', prov: '', role: 'Inquilino' as const
  });

  const [unitForm, setUnitForm] = useState<Partial<Unit>>({
    internal: '', staircase: '', floor: '', subalterno: '', millesimals: {}, type: 'Appartamento'
  });

  const [tempUnitId, setTempUnitId] = useState<string>('');
  const [unitSearch, setUnitSearch] = useState('');
  const [personSearch, setPersonSearch] = useState('');

  // FILTRAGGIO CRUCIALE: Mostra solo le unità appartenenti al condominio selezionato
  const filteredUnits = useMemo(() => {
    const q = unitSearch.toLowerCase();
    if (!selectedCondo) return [];
    return units.filter(u =>
      u.condoId === selectedCondo.id &&
      (u.internal.toLowerCase().includes(q) || (u.subalterno?.toLowerCase() || '').includes(q))
    );
  }, [units, unitSearch, selectedCondo]);

  const filteredPeople = useMemo(() => {
    const q = personSearch.toLowerCase();
    return people.filter(p => `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) || p.fiscalCode.toLowerCase().includes(q));
  }, [people, personSearch]);

  // Handlers for dynamic millesimals
  const addMillesimalRow = () => {
    const nextLabel = String.fromCharCode(65 + millesimalEntries.length); // A, B, C...
    setMillesimalEntries([...millesimalEntries, { label: nextLabel, value: 0 }]);
  };

  const removeMillesimalRow = (index: number) => {
    setMillesimalEntries(millesimalEntries.filter((_, i) => i !== index));
  };

  const updateMillesimalRow = (index: number, field: 'label' | 'value', val: any) => {
    const newEntries = [...millesimalEntries];
    newEntries[index] = { ...newEntries[index], [field]: val };
    setMillesimalEntries(newEntries);
  };

  // Handlers for Condominium Millesimal Tables
  const addCondoMillesimalTable = () => {
    const nextCode = String.fromCharCode(65 + condoMillesimalTables.length); // A, B, C...
    setCondoMillesimalTables([...condoMillesimalTables, { code: nextCode, label: '', description: '' }]);
  };

  const removeCondoMillesimalTable = (index: number) => {
    setCondoMillesimalTables(condoMillesimalTables.filter((_, i) => i !== index));
  };

  const updateCondoMillesimalTable = (index: number, field: 'code' | 'label' | 'description', value: string) => {
    const newTables = [...condoMillesimalTables];
    newTables[index] = { ...newTables[index], [field]: value };
    setCondoMillesimalTables(newTables);
  };

  const handleCopyCondoCadastral = () => {
    if (selectedCondo?.cadastralData) {
      setUnitForm(prev => ({ ...prev, subalterno: selectedCondo.cadastralData }));
    }
  };

  const openNewCondoModal = () => {
    setIsEditingCondo(false);
    setCondoForm({
      name: '',
      street: '',
      streetNumber: '',
      cap: '',
      city: '',
      province: '',
      fiscalCode: '',
      cadastralData: '',
      constructionYear: undefined,
      numberOfFloors: undefined,
      numberOfStaircases: undefined,
      numberOfUnits: 0,
      monthlyFee: undefined,
      imageUrl: '',
      hasElevator: false,
      hasCentralHeating: false,
      hasGarden: false,
      hasParking: false,
      notes: ''
    });
    setCondoMillesimalTables([]); // Reset millesimal tables
    setIsCondoModalOpen(true);
  };

  const openEditCondoModal = (condoToEdit?: Condominium) => {
    const target = condoToEdit || selectedCondo;
    if (!target) return;
    setIsEditingCondo(true);
    setCondoForm({ ...target, cadastralData: target.cadastralData || '' });
    setIsCondoModalOpen(true);
  };

  const handleSaveCondo = () => {
    if (!condoForm.name || !condoForm.fiscalCode || !condoForm.city) {
      alert("Completare i campi obbligatori del condominio.");
      return;
    }
    if (isEditingCondo && selectedCondo) {
      const updated: Condominium = {
        ...selectedCondo,
        ...condoForm,
        totalUnits: condoForm.numberOfUnits || selectedCondo.totalUnits // Sync totalUnits with numberOfUnits
      };
      onUpdateCondo(updated);
      setSelectedCondo(updated);
    } else {
      const condo: Condominium = {
        id: Date.now().toString(),
        ...condoForm,
        totalUnits: condoForm.numberOfUnits || 0
      };
      onAddCondo(condo);
      setSelectedCondo(condo);
    }
    setIsCondoModalOpen(false);
  };

  const openNewPersonModal = () => {
    if (!selectedCondo) {
      alert("Seleziona prima un condominio.");
      return;
    }
    setIsEditingPerson(false);
    setCurrentPersonId(null);
    setIsTenantActive(false);
    setUnitStrategy('new');
    setMillesimalEntries([{ label: 'A', value: 0 }]);
    setOwnerForm({ firstName: '', lastName: '', email: '', phone: '', fiscalCode: '', street: '', civico: '', cap: '', city: '', prov: '', role: 'Proprietario' });
    setTenantForm({ firstName: '', lastName: '', email: '', phone: '', fiscalCode: '', street: '', civico: '', cap: '', city: '', prov: '', role: 'Inquilino' });
    setUnitForm({ internal: '', staircase: '', floor: '', subalterno: '', millesimals: {}, type: 'Appartamento' });
    setTempUnitId('');
    setIsPersonModalOpen(true);
  };

  const handleSavePerson = () => {
    if (!selectedCondo) return;
    if (!ownerForm.firstName || !ownerForm.lastName || !ownerForm.fiscalCode) {
      alert("ERRORE: I dati del Proprietario sono obbligatori.");
      return;
    }

    const ownerId = isEditingPerson && currentPersonId ? currentPersonId : `p_own_${Date.now()}`;
    const newOwner: Person = {
      id: ownerId,
      firstName: ownerForm.firstName,
      lastName: ownerForm.lastName,
      email: ownerForm.email,
      phone: ownerForm.phone,
      fiscalCode: ownerForm.fiscalCode,
      residenceAddress: `${ownerForm.street} ${ownerForm.civico}, ${ownerForm.cap} ${ownerForm.city} (${ownerForm.prov})`,
      role: 'Proprietario'
    };

    let tenantId = undefined;
    if (isTenantActive && tenantForm.lastName && tenantForm.firstName) {
      tenantId = `p_ten_${Date.now()}`;
      const newTenant: Person = {
        id: tenantId,
        firstName: tenantForm.firstName,
        lastName: tenantForm.lastName,
        email: tenantForm.email,
        phone: tenantForm.phone,
        fiscalCode: tenantForm.fiscalCode,
        residenceAddress: `${tenantForm.street} ${tenantForm.civico}, ${tenantForm.cap} ${tenantForm.city} (${tenantForm.prov})`,
        role: 'Inquilino'
      };
      setPeople(prev => [...prev, newTenant]);
    }

    if (isEditingPerson) {
      setPeople(prev => prev.map(p => p.id === ownerId ? newOwner : p));
    } else {
      setPeople(prev => [...prev, newOwner]);
    }

    // Process Millesimals
    const processedMillesimals: Record<string, number> = {};
    millesimalEntries.forEach(entry => {
      if (entry.label) processedMillesimals[entry.label] = entry.value;
    });

    if (unitStrategy === 'archive' && tempUnitId) {
      setUnits(prev => prev.map(u => u.id === tempUnitId ? { ...u, ownerId: ownerId, tenantId: tenantId || u.tenantId } : u));
    } else if (unitStrategy === 'new' && unitForm.internal) {
      const newUnit: Unit = {
        id: `u_new_${Date.now()}`,
        condoId: selectedCondo.id, // INIEZIONE AUTOMATICA CONDOID
        ...unitForm as Unit,
        millesimals: processedMillesimals,
        ownerId: ownerId,
        tenantId: tenantId
      };
      setUnits(prev => [...prev, newUnit]);
    }

    setIsPersonModalOpen(false);
  };

  const deletePerson = (id: string) => {
    if (confirm("Eliminare definitivamente questo soggetto?")) {
      setPeople(prev => prev.filter(p => p.id !== id));
      setUnits(prev => prev.map(u => ({
        ...u,
        ownerId: u.ownerId === id ? '' : u.ownerId,
        tenantId: u.tenantId === id ? undefined : u.tenantId
      })));
    }
  };

  const unassignPerson = (unitId: string, role: 'owner' | 'tenant') => {
    setUnits(prev => prev.map(u => u.id === unitId ? (role === 'owner' ? { ...u, ownerId: '' } : { ...u, tenantId: undefined }) : u));
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Anagrafica Patrimonio</h2>
          <p className="text-slate-500 font-medium">Gestione unità e proprietari per il condominio {selectedCondo?.name || 'selezionato'}.</p>
        </div>
        <button onClick={openNewCondoModal} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-slate-800 transition-all shadow-xl text-sm font-black uppercase tracking-widest">
          <Building2 className="w-4 h-4 text-emerald-400" /> Nuovo Condominio
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 sticky top-24">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Archive className="w-3 h-3" /> Condomini Attivi
            </h3>
            <div className="space-y-2">
              {condos.map(condo => (
                <button key={condo.id} onClick={() => setSelectedCondo(condo)} className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3 group/item ${selectedCondo?.id === condo.id ? 'bg-slate-800 text-white shadow-xl translate-x-1' : 'hover:bg-slate-50 text-slate-600'}`}>
                  <Building2 className={`w-4 h-4 ${selectedCondo?.id === condo.id ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="font-bold text-sm truncate uppercase tracking-tight">{condo.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-8">
          {selectedCondo ? (
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 min-h-[500px]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-50">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner group-hover:scale-110 transition-transform"><Building2 className="w-10 h-10" /></div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">{selectedCondo.name}</h3>
                      <button onClick={() => openEditCondoModal()} className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-500 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button>
                    </div>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1 uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {selectedCondo.street} {selectedCondo.streetNumber}, {selectedCondo.cap} {selectedCondo.city}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-10 mb-8 border-b border-slate-50">
                <button onClick={() => setActiveTab('units')} className={`flex items-center gap-2 pb-4 text-[10px] font-black uppercase tracking-[0.2em] border-b-4 transition-all ${activeTab === 'units' ? 'border-emerald-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  <Home className="w-4 h-4" /> Unità {selectedCondo.name}
                </button>
                <button onClick={() => setActiveTab('people')} className={`flex items-center gap-2 pb-4 text-[10px] font-black uppercase tracking-[0.2em] border-b-4 transition-all ${activeTab === 'people' ? 'border-emerald-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  <Users className="w-4 h-4" /> Anagrafica Soggetti
                </button>
              </div>

              {activeTab === 'units' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <Search className="w-4 h-4 text-slate-300 ml-2" />
                    <input type="text" placeholder="Cerca interno o subalterno..." value={unitSearch} onChange={e => setUnitSearch(e.target.value)} className="flex-1 bg-transparent border-none text-sm font-bold text-slate-600 outline-none" />
                    <button onClick={() => { setMillesimalEntries([{ label: 'A', value: 0 }]); setIsUnitModalOpen(true); }} className="bg-emerald-500 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 hover:bg-emerald-600 transition-all"><Plus className="w-3 h-3" /> Crea Unità</button>
                  </div>
                  <div className="overflow-hidden border border-slate-100 rounded-[32px] shadow-sm bg-white">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500 font-black uppercase text-[10px] tracking-widest">
                        <tr><th className="px-8 py-5">Interno / Sub</th><th className="px-8 py-5">Soggetti</th><th className="px-8 py-5">Tabelle Millesimali</th><th className="px-8 py-5 text-right">Azioni</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredUnits.length > 0 ? filteredUnits.map(unit => {
                          const owner = people.find(p => p.id === unit.ownerId);
                          const tenant = people.find(p => p.id === unit.tenantId);
                          return (
                            <tr key={unit.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-8 py-6">
                                <div className="font-black text-slate-800 uppercase tracking-tight">Int. {unit.internal}</div>
                                <div className="text-[10px] text-slate-400 font-mono mt-1">RIF: {unit.subalterno || '-'}</div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="space-y-1.5">
                                  {owner && <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> {owner.lastName} {owner.firstName}</div>}
                                  {tenant && <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Inq: {tenant.lastName} {tenant.firstName}</div>}
                                  {!owner && !tenant && <span className="text-xs text-slate-300 italic">Senza assegnatario</span>}
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(unit.millesimals).map(([label, value]) => (
                                    <div key={label} className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 flex items-center gap-1.5">
                                      <span className="text-[9px] font-black text-slate-400 uppercase">Tab {label}:</span>
                                      <span className="text-[11px] font-mono font-bold text-slate-700">{(value as number).toFixed(3)}</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                  <button onClick={() => unassignPerson(unit.id, 'owner')} className="p-2 text-red-400 hover:bg-red-50 rounded-xl" title="Scollega Soggetti"><UserMinus className="w-4 h-4" /></button>
                                  <button className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl"><Edit2 className="w-4 h-4" /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        }) : (
                          <tr><td colSpan={4} className="p-16 text-center text-slate-300 font-bold uppercase tracking-widest italic">Nessuna unità censita per questo condominio</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'people' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-3xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                    <Search className="w-5 h-5 text-slate-300" />
                    <input type="text" placeholder="Cerca soggetto..." value={personSearch} onChange={e => setPersonSearch(e.target.value)} className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none" />
                    <button onClick={openNewPersonModal} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg"><UserPlus className="w-4 h-4 text-emerald-400" /> Nuovo Soggetto</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredPeople.map(person => (
                      <div key={person.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative group overflow-hidden">
                        <div className="flex items-center gap-6 mb-6">
                          <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-800 flex items-center justify-center font-black text-xl border border-slate-100 shadow-inner uppercase">{person.firstName?.[0] || '?'}{person.lastName?.[0] || '?'}</div>
                          <div className="min-w-0">
                            <p className="font-black text-xl text-slate-800 truncate leading-tight uppercase tracking-tight">{person.firstName} {person.lastName}</p>
                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded mt-1 inline-block ${person.role === 'Proprietario' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>{person.role}</span>
                          </div>
                        </div>
                        <div className="space-y-3 text-xs text-slate-500 font-medium bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                          <p className="flex items-center gap-2 font-mono text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100 pb-2 mb-2"><Fingerprint className="w-3.5 h-3.5 text-slate-300" /> {person.fiscalCode}</p>
                          <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-300" /> {person.email || 'N/A'}</p>
                          <p className="flex items-center gap-2"><Smartphone className="w-3.5 h-3.5 text-slate-300" /> {person.phone || 'N/A'}</p>
                          <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-300" /> {person.residenceAddress || 'N/A'}</p>
                        </div>
                        <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-all flex flex-col gap-2">
                          <button onClick={() => { setIsEditingPerson(true); setCurrentPersonId(person.id); setOwnerForm({ ...person, role: person.role as any } as any); setIsPersonModalOpen(true); }} className="p-3 text-slate-500 bg-white shadow-xl border border-slate-100 rounded-2xl hover:bg-slate-50 hover:text-emerald-500"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => deletePerson(person.id)} className="p-3 text-red-500 bg-white shadow-xl border border-slate-100 rounded-2xl hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : <div className="p-24 text-center text-slate-300 font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-[40px]">Seleziona un condominio per procedere.</div>}
        </div>
      </div>

      {/* REGISTRO GLOBALE IN BASSO */}
      <section className="mt-16 bg-white rounded-[48px] p-10 shadow-sm border border-slate-100 animate-in slide-in-from-bottom-6">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 text-emerald-400 rounded-2xl shadow-lg">
              <Table className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Registro Globale Amministrativo</h3>
              <p className="text-slate-400 text-sm font-medium">Anagrafica catastale e fiscale di tutti i condomini gestiti.</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden border border-slate-100 rounded-[40px] shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6">Condominio</th>
                <th className="px-8 py-6">Ubicazione</th>
                <th className="px-8 py-6">Codice Fiscale</th>
                <th className="px-8 py-6">Rif. Catastali (Fg/Part)</th>
                <th className="px-8 py-6 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {condos.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-800 uppercase tracking-tight text-base">{c.name}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-xs font-bold text-slate-600">{c.street} {c.streetNumber}</div>
                    <div className="text-[10px] text-slate-400 font-black uppercase">{c.cap} {c.city} ({c.province})</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-mono text-xs bg-slate-100 px-3 py-1 rounded-lg inline-block border border-slate-200">{c.fiscalCode}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-xs font-black text-indigo-600 uppercase tracking-wider">{c.cadastralData || 'Non inserito'}</div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditCondoModal(c)} className="p-3 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-all"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => setSelectedCondo(c)} className="p-3 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-2xl transition-all"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL SOGGETTO */}
      {isPersonModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md transition-all overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 my-10 border border-slate-100">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-emerald-400 shadow-2xl ring-4 ring-emerald-400/10">
                  <UserPlus className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Inserimento Anagrafica Patrimonio</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Condominio: {selectedCondo?.name}</p>
                </div>
              </div>
              <button onClick={() => setIsPersonModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-full transition-all"><X className="w-8 h-8 text-slate-300" /></button>
            </div>

            <div className="p-10 space-y-12 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-8">
                <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> 1. PROPRIETARIO (PRINCIPALE)
                </h4>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nome</label><input type="text" value={ownerForm.firstName} onChange={e => setOwnerForm({ ...ownerForm, firstName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase ml-1">Cognome</label><input type="text" value={ownerForm.lastName} onChange={e => setOwnerForm({ ...ownerForm, lastName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase ml-1">Codice Fiscale</label><input type="text" value={ownerForm.fiscalCode} onChange={e => setOwnerForm({ ...ownerForm, fiscalCode: e.target.value.toUpperCase() })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-mono font-black" /></div>
                </div>
              </div>

              <div className="pt-10 border-t border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em] flex items-center gap-2">
                    <UserRoundPlus className="w-5 h-5" /> 2. INQUILINO (OPZIONALE)
                  </h4>
                  <button onClick={() => setIsTenantActive(!isTenantActive)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isTenantActive ? 'bg-red-50 text-red-500 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                    {isTenantActive ? 'Rimuovi Inquilino' : 'Aggiungi Inquilino'}
                  </button>
                </div>
                {isTenantActive && (
                  <div className="space-y-8 animate-in slide-in-from-top-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nome</label><input type="text" value={tenantForm.firstName} onChange={e => setTenantForm({ ...tenantForm, firstName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase ml-1">Cognome</label><input type="text" value={tenantForm.lastName} onChange={e => setTenantForm({ ...tenantForm, lastName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase ml-1">Codice Fiscale</label><input type="text" value={tenantForm.fiscalCode} onChange={e => setTenantForm({ ...tenantForm, fiscalCode: e.target.value.toUpperCase() })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-mono font-black" /></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-10 border-t border-slate-100">
                <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                  <Home className="w-5 h-5" /> 3. ASSEGNAZIONE UNITÀ IMMOBILIARE
                </h4>
                <div className="flex gap-6 mb-8">
                  <button onClick={() => setUnitStrategy('new')} className={`flex-1 p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 ${unitStrategy === 'new' ? 'bg-slate-900 text-white border-slate-800 shadow-2xl' : 'bg-slate-50 text-slate-400 border-slate-100'}`}><PlusCircle className="w-8 h-8" /><span className="text-xs font-black uppercase tracking-widest">Crea Nuova Unità</span></button>
                  <button onClick={() => setUnitStrategy('archive')} className={`flex-1 p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 ${unitStrategy === 'archive' ? 'bg-slate-900 text-white border-slate-800 shadow-2xl' : 'bg-slate-50 text-slate-400 border-slate-100'}`}><Database className="w-8 h-8" /><span className="text-xs font-black uppercase tracking-widest">Usa Esistente</span></button>
                </div>

                {unitStrategy === 'new' && (
                  <div className="space-y-10 animate-in slide-in-from-right-6 duration-300">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase ml-1">Interno</label><input type="text" value={unitForm.internal} onChange={e => setUnitForm({ ...unitForm, internal: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-black" /></div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1 flex items-center justify-between">
                          Rif. Catastali <button onClick={handleCopyCondoCadastral} className="text-[9px] text-indigo-500 hover:text-indigo-700 font-black flex items-center gap-1 uppercase"><Copy className="w-3 h-3" /> Eredita</button>
                        </label>
                        <input type="text" value={unitForm.subalterno} onChange={e => setUnitForm({ ...unitForm, subalterno: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-mono font-bold" />
                      </div>
                    </div>
                    <div className="p-8 bg-indigo-50/30 rounded-[40px] border border-indigo-100 space-y-6">
                      <div className="flex items-center justify-between">
                        <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Tabelle Millesimali</h5>
                        <button onClick={addMillesimalRow} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[9px] font-black">Aggiungi Tabella</button>
                      </div>
                      {millesimalEntries.map((entry, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <input type="text" value={entry.label} onChange={(e) => updateMillesimalRow(idx, 'label', e.target.value.toUpperCase())} className="w-24 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black" />
                          <input type="number" step="0.001" value={entry.value} onChange={(e) => updateMillesimalRow(idx, 'value', parseFloat(e.target.value) || 0)} className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono font-bold" />
                          <button onClick={() => removeMillesimalRow(idx)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl"><Trash className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {unitStrategy === 'archive' && (
                  <select value={tempUnitId} onChange={e => setTempUnitId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black uppercase">
                    <option value="">-- Seleziona Unità Esistente di {selectedCondo.name} --</option>
                    {units.filter(u => u.condoId === selectedCondo.id).map(u => (
                      <option key={u.id} value={u.id}>INT. {u.internal} - {u.subalterno || 'N/D'}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="p-10 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/50">
              <button onClick={() => setIsPersonModalOpen(false)} className="px-8 py-4 font-black text-slate-400 text-xs uppercase tracking-widest">Annulla</button>
              <button onClick={handleSavePerson} className="px-14 py-5 bg-slate-900 text-white rounded-[24px] font-black shadow-2xl hover:bg-black transition-all flex items-center gap-3">
                <Check className="w-6 h-6 text-emerald-400" /> Salva Anagrafica Patrimonio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NUOVA UNITÀ RAPIDO */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 border border-slate-100">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Censimento Unità - {selectedCondo?.name}</h3>
              <button onClick={() => setIsUnitModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-8 h-8 text-slate-300" /></button>
            </div>
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase">Interno</label><input type="text" value={unitForm.internal} onChange={e => setUnitForm({ ...unitForm, internal: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase">Piano</label><input type="text" value={unitForm.floor} onChange={e => setUnitForm({ ...unitForm, floor: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold" /></div>
              </div>
              <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-6">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Millesimi</h5>
                {millesimalEntries.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input type="text" value={entry.label} onChange={(e) => updateMillesimalRow(idx, 'label', e.target.value.toUpperCase())} className="w-24 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black" />
                    <input type="number" step="0.001" value={entry.value} onChange={(e) => updateMillesimalRow(idx, 'value', parseFloat(e.target.value) || 0)} className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono font-bold" />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-10 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/50">
              <button onClick={() => setIsUnitModalOpen(false)} className="px-8 py-4 font-black text-slate-400 text-xs uppercase tracking-widest">Annulla</button>
              <button onClick={() => {
                if (!unitForm.internal || !selectedCondo) return;
                const mills: Record<string, number> = {};
                millesimalEntries.forEach(e => { if (e.label) mills[e.label] = e.value; });
                setUnits(prev => [...prev, {
                  id: `u_${Date.now()}`,
                  condoId: selectedCondo.id,
                  ...unitForm as Unit,
                  millesimals: mills,
                  ownerId: ''
                }]);
                setIsUnitModalOpen(false);
              }} className="px-12 py-5 bg-emerald-500 text-white rounded-[24px] font-black shadow-2xl hover:bg-emerald-600 transition-all">Salva Unità</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONDOMINIO */}
      {isCondoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white w-full max-w-3xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 border border-slate-100">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-emerald-400 shadow-2xl ring-4 ring-emerald-400/10">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{isEditingCondo ? 'Modifica Condominio' : 'Nuovo Condominio'}</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Dati Fiscale & Territoriali</p>
                </div>
              </div>
              <button onClick={() => setIsCondoModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-full"><X className="w-8 h-8 text-slate-300" /></button>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">{/* Ridotto da p-10 space-y-8 max-h-[75vh] */}
              {/* Nome Condominio */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nome Condominio *</label>
                <input
                  type="text"
                  placeholder="es. Condominio Via Roma 123"
                  value={condoForm.name}
                  onChange={e => setCondoForm({ ...condoForm, name: e.target.value })}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
              </div>

              {/* Indirizzo */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Indirizzo *</label>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Via, numero civico"
                    value={`${condoForm.street} ${condoForm.streetNumber}`.trim()}
                    onChange={e => {
                      const parts = e.target.value.split(' ');
                      const num = parts[parts.length - 1];
                      const street = parts.slice(0, -1).join(' ');
                      setCondoForm({ ...condoForm, street: street || e.target.value, streetNumber: num || '' });
                    }}
                    className="col-span-3 w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Città e CAP */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Città *</label>
                  <input
                    type="text"
                    placeholder="Milano"
                    value={condoForm.city}
                    onChange={e => setCondoForm({ ...condoForm, city: e.target.value })}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">CAP</label>
                  <input
                    type="text"
                    placeholder="20100"
                    value={condoForm.cap}
                    onChange={e => setCondoForm({ ...condoForm, cap: e.target.value })}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Codice Fiscale e Anno Costruzione */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Codice Fiscale</label>
                  <input
                    type="text"
                    value={condoForm.fiscalCode}
                    onChange={e => setCondoForm({ ...condoForm, fiscalCode: e.target.value.toUpperCase() })}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-mono font-bold uppercase focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Anno Costruzione</label>
                  <input
                    type="number"
                    value={condoForm.constructionYear || ''}
                    onChange={e => setCondoForm({ ...condoForm, constructionYear: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Numero Piani e Numero Scale */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Numero Piani</label>
                  <input
                    type="number"
                    value={condoForm.numberOfFloors || ''}
                    onChange={e => setCondoForm({ ...condoForm, numberOfFloors: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Numero Scale</label>
                  <input
                    type="number"
                    value={condoForm.numberOfStaircases || ''}
                    onChange={e => setCondoForm({ ...condoForm, numberOfStaircases: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Numero Interni e Quota Mensile */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Numero Interni</label>
                  <input
                    type="number"
                    value={condoForm.numberOfUnits || ''}
                    onChange={e => setCondoForm({ ...condoForm, numberOfUnits: e.target.value ? parseInt(e.target.value) : 0 })}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Quota Mensile Ordinaria (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="es. 100.00"
                    value={condoForm.monthlyFee || ''}
                    onChange={e => setCondoForm({ ...condoForm, monthlyFee: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>
              </div>

              {/* URL Immagine */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">URL Immagine</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={condoForm.imageUrl || ''}
                  onChange={e => setCondoForm({ ...condoForm, imageUrl: e.target.value })}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
              </div>

              {/* Servizi - Toggle Switches */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4">
                {/* Ascensore */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">Ascensore</label>
                  <button
                    type="button"
                    onClick={() => setCondoForm({ ...condoForm, hasElevator: !condoForm.hasElevator })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${condoForm.hasElevator ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${condoForm.hasElevator ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* Risc. Centrale */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">Risc. Centrale</label>
                  <button
                    type="button"
                    onClick={() => setCondoForm({ ...condoForm, hasCentralHeating: !condoForm.hasCentralHeating })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${condoForm.hasCentralHeating ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${condoForm.hasCentralHeating ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* Giardino */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">Giardino</label>
                  <button
                    type="button"
                    onClick={() => setCondoForm({ ...condoForm, hasGarden: !condoForm.hasGarden })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${condoForm.hasGarden ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${condoForm.hasGarden ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* Parcheggio */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">Parcheggio</label>
                  <button
                    type="button"
                    onClick={() => setCondoForm({ ...condoForm, hasParking: !condoForm.hasParking })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${condoForm.hasParking ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${condoForm.hasParking ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              {/* Tabelle Millesimali - Functional */}
              <div className="space-y-3">{/* Ridotto da space-y-4 */}
                <label className="text-sm font-bold text-slate-700">Tabelle Millesimali</label>

                {condoMillesimalTables.map((table, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center p-3 bg-slate-50 rounded-xl border border-slate-200">{/* Ridotto gap e padding */}
                    {/* Codice */}
                    <input
                      type="text"
                      placeholder="A"
                      value={table.code}
                      onChange={e => updateCondoMillesimalTable(index, 'code', e.target.value.toUpperCase())}
                      className="col-span-2 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold uppercase text-center focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none transition-all"
                    />

                    {/* Etichetta */}
                    <input
                      type="text"
                      placeholder="Generali, Riscaldamento..."
                      value={table.label}
                      onChange={e => updateCondoMillesimalTable(index, 'label', e.target.value)}
                      className="col-span-4 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none transition-all"
                    />

                    {/* Descrizione */}
                    <input
                      type="text"
                      placeholder="Descrizione"
                      value={table.description}
                      onChange={e => updateCondoMillesimalTable(index, 'description', e.target.value)}
                      className="col-span-5 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none transition-all"
                    />

                    {/* Pulsante Rimuovi */}
                    <button
                      type="button"
                      onClick={() => removeCondoMillesimalTable(index)}
                      className="col-span-1 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Rimuovi tabella"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                {/* Pulsante Aggiungi */}
                <button
                  type="button"
                  onClick={addCondoMillesimalTable}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border-2 border-dashed border-slate-300 hover:border-emerald-400 w-full justify-center"
                >
                  <Plus className="w-4 h-4" /> Aggiungi Tabella Millesimale
                </button>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Note</label>
                <textarea
                  rows={4}
                  value={condoForm.notes || ''}
                  onChange={e => setCondoForm({ ...condoForm, notes: e.target.value })}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/50">{/* Ridotto da p-10 */}
              <button onClick={() => setIsCondoModalOpen(false)} className="px-6 py-3 font-bold text-slate-400 text-xs uppercase tracking-widest hover:text-slate-600 transition-colors">Annulla</button>
              <button onClick={handleSaveCondo} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-xl flex items-center gap-2 hover:bg-slate-800 transition-all">
                <Check className="w-5 h-5 text-emerald-400" /> {isEditingCondo ? 'Aggiorna' : 'Salva'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CondominiumRegistry;
