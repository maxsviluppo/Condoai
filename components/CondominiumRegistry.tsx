
import React, { useState, useMemo } from 'react';
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
  UserCircle,
  Phone,
  Smartphone,
  Link2,
  ExternalLink,
  Info,
  ShieldCheck,
  PlusCircle,
  Database,
  UserSearch,
  UserRoundPlus
} from 'lucide-react';
import { Condominium, Unit, Person } from '../types';

interface CondominiumRegistryProps {
  initialCondoId?: string;
  condos: Condominium[];
  onAddCondo: (condo: Condominium) => void;
  onUpdateCondo: (condo: Condominium) => void;
  onDeleteCondo: (id: string) => void;
}

const CondominiumRegistry: React.FC<CondominiumRegistryProps> = ({ 
  initialCondoId = 'all', 
  condos, 
  onAddCondo,
  onUpdateCondo,
  onDeleteCondo 
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

  // Unit assignment strategy
  const [unitStrategy, setUnitStrategy] = useState<'archive' | 'new' | 'none'>('none');
  const [ownerStrategy, setOwnerStrategy] = useState<'existing' | 'new' | 'none'>('none');

  // Forms State
  const [condoForm, setCondoForm] = useState({ 
    name: '', street: '', streetNumber: '', cap: '', city: '', province: '', fiscalCode: '', cadastralData: '' 
  });
  
  const [personForm, setPersonForm] = useState<Partial<Person>>({ 
    firstName: '', lastName: '', email: '', pec: '', phone: '', fiscalCode: '', residenceAddress: '', role: 'Proprietario' 
  });

  const [linkedOwnerForm, setLinkedOwnerForm] = useState<Partial<Person>>({
    firstName: '', lastName: '', email: '', phone: '', residenceAddress: '', role: 'Proprietario'
  });

  const [unitForm, setUnitForm] = useState<Partial<Unit>>({ 
    internal: '', staircase: '', floor: '', subalterno: '', millesimals: { 'A': 0 }, type: 'Appartamento' 
  });

  const [tempUnitId, setTempUnitId] = useState<string>('');
  const [tempOwnerId, setTempOwnerId] = useState<string>('');

  // Data State (Mock)
  const [units, setUnits] = useState<Unit[]>([
    { id: 'u1', internal: '1A', staircase: 'A', floor: '1', subalterno: '12', millesimals: { 'A': 45.500, 'B': 20.000 }, ownerId: 'p1', tenantId: 'p2', type: 'Appartamento' },
    { id: 'u2', internal: '1B', staircase: 'A', floor: '1', subalterno: '13', millesimals: { 'A': 38.200 }, ownerId: 'p2', type: 'Appartamento' },
  ]);

  const [people, setPeople] = useState<Person[]>([
    { id: 'p1', firstName: 'Mario', lastName: 'Rossi', email: 'mario.rossi@email.com', pec: 'mario.rossi@pec.it', phone: '333 1234567', fiscalCode: 'RSSMRA80A01F205Z', role: 'Proprietario' },
    { id: 'p2', firstName: 'Laura', lastName: 'Bianchi', email: 'laura.b@email.com', phone: '333 7654321', fiscalCode: 'BNCHLRA85B41H501U', role: 'Inquilino' },
  ]);

  const [unitSearch, setUnitSearch] = useState('');
  const [personSearch, setPersonSearch] = useState('');

  const filteredUnits = useMemo(() => {
    const q = unitSearch.toLowerCase();
    return units.filter(u => u.internal.toLowerCase().includes(q) || u.subalterno?.toLowerCase().includes(q));
  }, [units, unitSearch]);

  const filteredPeople = useMemo(() => {
    const q = personSearch.toLowerCase();
    return people.filter(p => `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) || p.fiscalCode.toLowerCase().includes(q));
  }, [people, personSearch]);

  const ownersList = useMemo(() => people.filter(p => p.role === 'Proprietario'), [people]);

  // Handlers
  const openNewCondoModal = () => {
    setIsEditingCondo(false);
    setCondoForm({ name: '', street: '', streetNumber: '', cap: '', city: '', province: '', fiscalCode: '', cadastralData: '' });
    setIsCondoModalOpen(true);
  };

  const openEditCondoModal = () => {
    if (!selectedCondo) return;
    setIsEditingCondo(true);
    setCondoForm({ ...selectedCondo, cadastralData: selectedCondo.cadastralData || '' });
    setIsCondoModalOpen(true);
  };

  const handleSaveCondo = () => {
    if (!condoForm.name || !condoForm.fiscalCode || !condoForm.city) {
      alert("Completare i campi obbligatori.");
      return;
    }
    if (isEditingCondo && selectedCondo) {
      const updated: Condominium = { ...selectedCondo, ...condoForm };
      onUpdateCondo(updated);
      setSelectedCondo(updated);
    } else {
      const condo: Condominium = { id: Date.now().toString(), ...condoForm, totalUnits: 0 };
      onAddCondo(condo);
      setSelectedCondo(condo);
    }
    setIsCondoModalOpen(false);
  };

  const openNewPersonModal = (role: 'Proprietario' | 'Inquilino' = 'Proprietario') => {
    setIsEditingPerson(false);
    setCurrentPersonId(null);
    setPersonForm({ firstName: '', lastName: '', email: '', pec: '', phone: '', fiscalCode: '', residenceAddress: '', role });
    setUnitStrategy('none');
    setOwnerStrategy('none');
    setTempUnitId('');
    setTempOwnerId('');
    setLinkedOwnerForm({ firstName: '', lastName: '', email: '', phone: '', residenceAddress: '', role: 'Proprietario' });
    setUnitForm({ internal: '', staircase: '', floor: '', subalterno: '', millesimals: { 'A': 0 }, type: 'Appartamento' });
    setIsPersonModalOpen(true);
  };

  const openEditPersonModal = (person: Person) => {
    setIsEditingPerson(true);
    setCurrentPersonId(person.id);
    setPersonForm({ ...person });
    setUnitStrategy('none');
    setOwnerStrategy('none');
    setIsPersonModalOpen(true);
  };

  const handleSavePerson = () => {
    if (!personForm.firstName || !personForm.lastName || !personForm.fiscalCode) {
      alert("Completare Nome, Cognome e Codice Fiscale.");
      return;
    }

    const personId = isEditingPerson && currentPersonId ? currentPersonId : `p${Date.now()}`;
    const newPerson: Person = { ...personForm, id: personId } as Person;

    // 1. Save or Update Main Person
    if (isEditingPerson) {
      setPeople(prev => prev.map(p => p.id === personId ? newPerson : p));
    } else {
      setPeople(prev => [...prev, newPerson]);
    }

    // 2. Handle Linked Owner if Main is Tenant
    let finalOwnerId = '';
    if (newPerson.role === 'Inquilino' && !isEditingPerson) {
        if (ownerStrategy === 'existing' && tempOwnerId) {
            finalOwnerId = tempOwnerId;
        } else if (ownerStrategy === 'new' && linkedOwnerForm.lastName) {
            finalOwnerId = `p_owner_${Date.now()}`;
            const newOwner: Person = { ...linkedOwnerForm, id: finalOwnerId, role: 'Proprietario' } as Person;
            setPeople(prev => [...prev, newOwner]);
        }
    }

    // 3. Handle Unit Association
    const targetOwnerId = newPerson.role === 'Proprietario' ? personId : finalOwnerId;
    const targetTenantId = newPerson.role === 'Inquilino' ? personId : undefined;

    if (unitStrategy === 'archive' && tempUnitId) {
      setUnits(prev => prev.map(u => 
        u.id === tempUnitId 
          ? { ...u, ownerId: targetOwnerId || u.ownerId, tenantId: targetTenantId || u.tenantId } 
          : u
      ));
    } else if (unitStrategy === 'new' && unitForm.internal) {
      const newUnit: Unit = { 
        id: `u${Date.now()}`, 
        ...unitForm as Unit, 
        ownerId: targetOwnerId,
        tenantId: targetTenantId
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

  const handleSaveUnit = () => {
    if (!unitForm.internal) return;
    const unit: Unit = { id: `u${Date.now()}`, ...unitForm as Unit, ownerId: '', tenantId: undefined };
    setUnits(prev => [...prev, unit]);
    setIsUnitModalOpen(false);
    setUnitForm({ internal: '', staircase: '', floor: '', subalterno: '', millesimals: { 'A': 0 }, type: 'Appartamento' });
  };

  const unassignPerson = (unitId: string, role: 'owner' | 'tenant') => {
    setUnits(prev => prev.map(u => u.id === unitId ? (role === 'owner' ? { ...u, ownerId: '' } : { ...u, tenantId: undefined }) : u));
  };

  const goToPersonAndFilter = (name: string) => {
    setPersonSearch(name);
    setActiveTab('people');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Anagrafica & Patrimonio</h2>
          <p className="text-slate-500 text-sm">Gestione immobili, soggetti e millesimi.</p>
        </div>
        <button onClick={openNewCondoModal} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl hover:bg-slate-800 transition-all shadow-lg text-sm font-bold">
          <Building2 className="w-4 h-4 text-emerald-400" /> Nuovo Condominio
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 min-h-full">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Condomini</h3>
            <div className="space-y-2">
              {condos.map(condo => (
                <button key={condo.id} onClick={() => setSelectedCondo(condo)} className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3 group/item ${selectedCondo?.id === condo.id ? 'bg-slate-800 text-white shadow-xl' : 'hover:bg-slate-50 text-slate-600'}`}>
                  <Building2 className={`w-4 h-4 ${selectedCondo?.id === condo.id ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="font-bold text-sm truncate">{condo.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          {selectedCondo ? (
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 min-h-[600px]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-50">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner"><Building2 className="w-10 h-10" /></div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">{selectedCondo.name}</h3>
                      <button onClick={openEditCondoModal} className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-500 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button>
                    </div>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {selectedCondo.city} - {selectedCondo.street}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-8 mb-8 border-b border-slate-50">
                <button onClick={() => setActiveTab('units')} className={`flex items-center gap-2 pb-4 text-sm font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === 'units' ? 'border-emerald-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  <Home className="w-4 h-4" /> Unità & Millesimi
                </button>
                <button onClick={() => setActiveTab('people')} className={`flex items-center gap-2 pb-4 text-sm font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === 'people' ? 'border-emerald-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  <Users className="w-4 h-4" /> Anagrafica Persone
                </button>
              </div>

              {activeTab === 'units' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <input type="text" placeholder="Cerca interno..." value={unitSearch} onChange={e => setUnitSearch(e.target.value)} className="flex-1 bg-transparent border-none text-sm font-medium outline-none" />
                    <button onClick={() => setIsUnitModalOpen(true)} className="bg-emerald-500 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"><Plus className="w-3 h-3" /> Aggiungi Unità</button>
                  </div>
                  <div className="overflow-hidden border border-slate-100 rounded-[32px] shadow-sm bg-white">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500 font-black uppercase text-[10px] tracking-widest">
                        <tr><th className="px-6 py-5">Interno</th><th className="px-6 py-5">Soggetti</th><th className="px-6 py-5">Millesimi A</th><th className="px-6 py-5 text-right">Azioni</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredUnits.map(unit => {
                          const owner = people.find(p => p.id === unit.ownerId);
                          const tenant = people.find(p => p.id === unit.tenantId);
                          return (
                            <tr key={unit.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-4 font-black text-slate-800 uppercase tracking-tight">Int. {unit.internal}</td>
                              <td className="px-6 py-4">
                                <div className="space-y-1">
                                  {owner && <div className="text-xs font-bold text-slate-700">Prop: {owner.lastName}</div>}
                                  {tenant && <div className="text-xs font-bold text-emerald-600">Inq: {tenant.lastName}</div>}
                                </div>
                              </td>
                              <td className="px-6 py-4 font-mono font-black text-slate-600">{(unit.millesimals['A'] || 0).toFixed(3)}</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                  <button onClick={() => unassignPerson(unit.id, 'owner')} className="p-2 text-red-400 hover:bg-red-50 rounded-xl" title="Scollega Soggetti"><UserMinus className="w-4 h-4" /></button>
                                  <button className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl"><Edit2 className="w-4 h-4" /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'people' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-3xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input type="text" placeholder="Cerca persona..." value={personSearch} onChange={e => setPersonSearch(e.target.value)} className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none" />
                    <button onClick={() => openNewPersonModal()} className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><UserPlus className="w-4 h-4 text-emerald-400" /> Nuovo Soggetto</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredPeople.map(person => (
                      <div key={person.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative group overflow-hidden">
                        <div className="flex items-center gap-6 mb-6">
                          <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-800 flex items-center justify-center font-black text-xl border border-slate-100 shadow-inner">{person.firstName[0]}{person.lastName[0]}</div>
                          <div className="min-w-0">
                            <p className="font-black text-xl text-slate-800 truncate leading-tight">{person.firstName} {person.lastName}</p>
                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${person.role === 'Proprietario' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>{person.role}</span>
                          </div>
                        </div>
                        <div className="space-y-2 text-xs text-slate-500 font-medium bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                           <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-300" /> {person.email}</p>
                           {person.phone && <p className="flex items-center gap-2"><Smartphone className="w-3.5 h-3.5 text-slate-300" /> {person.phone}</p>}
                           {person.pec && <p className="flex items-center gap-2 text-indigo-400"><ShieldCheck className="w-3.5 h-3.5" /> {person.pec}</p>}
                           <p className="flex items-center gap-2 font-mono text-[10px] text-slate-400 font-bold uppercase border-t border-slate-100 pt-2 mt-2"><Fingerprint className="w-3.5 h-3.5" /> {person.fiscalCode}</p>
                        </div>
                        <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-all flex flex-col gap-2">
                          <button onClick={() => openEditPersonModal(person)} className="p-3 text-slate-500 bg-white shadow-xl border border-slate-100 rounded-2xl hover:bg-slate-50 hover:text-emerald-500"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => deletePerson(person.id)} className="p-3 text-red-500 bg-white shadow-xl border border-slate-100 rounded-2xl hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : <div className="p-16 text-center text-slate-300 font-bold uppercase tracking-widest">Seleziona un condominio dalla sidebar per procedere.</div>}
        </div>
      </div>

      {/* MODAL: CONDOMINIO */}
      {isCondoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{isEditingCondo ? 'Modifica' : 'Nuovo'} Condominio</h3>
              <button onClick={() => setIsCondoModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <div className="p-8 grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Nome</label><input type="text" value={condoForm.name} onChange={e => setCondoForm({...condoForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Città</label><input type="text" value={condoForm.city} onChange={e => setCondoForm({...condoForm, city: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Cod. Fiscale</label><input type="text" value={condoForm.fiscalCode} onChange={e => setCondoForm({...condoForm, fiscalCode: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono" /></div>
            </div>
            <div className="p-8 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setIsCondoModalOpen(false)} className="px-6 py-3 font-bold text-slate-400 text-sm">Annulla</button>
              <button onClick={handleSaveCondo} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-lg">Salva</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PERSON (CREA/MODIFICA) POTENZIATO */}
      {isPersonModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-400 shadow-lg">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{isEditingPerson ? 'Dettaglio Soggetto' : 'Nuova Anagrafica'}</h3>
              </div>
              <button onClick={() => setIsPersonModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            
            <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {/* Sezione Anagrafica Soggetto Principale */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" /> {personForm.role === 'Inquilino' ? 'Dati Inquilino' : 'Informazioni Soggetto'}
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nome</label><input type="text" value={personForm.firstName} onChange={e => setPersonForm({...personForm, firstName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-emerald-500 outline-none" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Cognome</label><input type="text" value={personForm.lastName} onChange={e => setPersonForm({...personForm, lastName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-emerald-500 outline-none" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Ruolo</label>
                    <select value={personForm.role} onChange={e => setPersonForm({...personForm, role: e.target.value as any})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                      <option value="Proprietario">Proprietario</option>
                      <option value="Inquilino">Inquilino</option>
                    </select>
                  </div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Cod. Fiscale</label><input type="text" value={personForm.fiscalCode} onChange={e => setPersonForm({...personForm, fiscalCode: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono uppercase focus:border-emerald-500 outline-none" /></div>
                </div>
              </div>

              {/* Sezione Contatti & Recapiti Soggetto Principale */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Contatti & Recapiti
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</label>
                    <input type="email" value={personForm.email} onChange={e => setPersonForm({...personForm, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none" placeholder="esempio@mail.it" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1"><Smartphone className="w-3 h-3 text-emerald-500" /> Cellulare / Tel.</label>
                    <input type="text" value={personForm.phone} onChange={e => setPersonForm({...personForm, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none font-bold" placeholder="+39 3..." />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-indigo-500" /> PEC (Posta Certificata)</label>
                    <input type="email" value={personForm.pec} onChange={e => setPersonForm({...personForm, pec: e.target.value})} className="w-full bg-slate-50 border border-indigo-100 rounded-xl px-4 py-3 text-sm" placeholder="esempio@legalmail.it" />
                  </div>
                </div>
              </div>

              {/* Sezione Proprietario Collegato (Solo se il principale è Inquilino e siamo in creazione) */}
              {personForm.role === 'Inquilino' && !isEditingPerson && (
                <div className="space-y-4 pt-6 border-t border-slate-100 bg-emerald-50/30 -mx-8 px-8 py-6">
                  <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> Dati Proprietario (Locatore)
                  </h4>
                  
                  <div className="flex gap-4 mb-6">
                    <button 
                      onClick={() => setOwnerStrategy('existing')}
                      className={`flex-1 p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${ownerStrategy === 'existing' ? 'bg-emerald-600 text-white border-emerald-700 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300'}`}
                    >
                      <UserSearch className="w-6 h-6" />
                      <span className="text-xs font-bold uppercase">Usa Esistente</span>
                    </button>
                    <button 
                      onClick={() => setOwnerStrategy('new')}
                      className={`flex-1 p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${ownerStrategy === 'new' ? 'bg-emerald-600 text-white border-emerald-700 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300'}`}
                    >
                      <UserRoundPlus className="w-6 h-6" />
                      <span className="text-xs font-bold uppercase">Nuovo Proprietario</span>
                    </button>
                  </div>

                  {ownerStrategy === 'existing' && (
                    <div className="space-y-2 animate-in slide-in-from-top-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Seleziona Proprietario in Archivio</label>
                      <select 
                        value={tempOwnerId} 
                        onChange={e => setTempOwnerId(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                      >
                        <option value="">-- Scegli proprietario --</option>
                        {ownersList.map(o => (
                          <option key={o.id} value={o.id}>{o.lastName} {o.firstName} ({o.fiscalCode})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {ownerStrategy === 'new' && (
                    <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Nome</label><input type="text" value={linkedOwnerForm.firstName} onChange={e => setLinkedOwnerForm({...linkedOwnerForm, firstName: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold" /></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Cognome</label><input type="text" value={linkedOwnerForm.lastName} onChange={e => setLinkedOwnerForm({...linkedOwnerForm, lastName: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold" /></div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Mail className="w-3 h-3" /> Email</label>
                        <input type="email" value={linkedOwnerForm.email} onChange={e => setLinkedOwnerForm({...linkedOwnerForm, email: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm" placeholder="esempio@mail.it" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Smartphone className="w-3 h-3 text-emerald-500" /> Cellulare / Tel.</label>
                        <input type="text" value={linkedOwnerForm.phone} onChange={e => setLinkedOwnerForm({...linkedOwnerForm, phone: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold" placeholder="+39 3..." />
                      </div>

                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">Indirizzo di Residenza Completo <MapPin className="w-3 h-3 text-red-400" /></label>
                        <input type="text" value={linkedOwnerForm.residenceAddress} onChange={e => setLinkedOwnerForm({...linkedOwnerForm, residenceAddress: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm" placeholder="Via, Civico, CAP, Città (Prov)" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sezione Patrimonio */}
              {!isEditingPerson && (
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Link2 className="w-3.5 h-3.5" /> Assegnazione Unità
                  </h4>
                  <div className="flex gap-4 mb-6">
                    <button onClick={() => setUnitStrategy('archive')} className={`flex-1 p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${unitStrategy === 'archive' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:border-slate-300'}`}><Database className="w-6 h-6" /><span className="text-xs font-bold uppercase">Archivio</span></button>
                    <button onClick={() => setUnitStrategy('new')} className={`flex-1 p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${unitStrategy === 'new' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:border-slate-300'}`}><PlusCircle className="w-6 h-6" /><span className="text-xs font-bold uppercase">Nuova</span></button>
                    <button onClick={() => setUnitStrategy('none')} className={`flex-1 p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${unitStrategy === 'none' ? 'bg-slate-400 text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}><X className="w-6 h-6" /><span className="text-xs font-bold uppercase">Nessuna</span></button>
                  </div>

                  {unitStrategy === 'archive' && (
                    <div className="space-y-2 animate-in slide-in-from-top-2">
                      <select value={tempUnitId} onChange={e => setTempUnitId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold shadow-sm"><option value="">-- Scegli unità --</option>{units.map(u => (<option key={u.id} value={u.id}>Int. {u.internal} - Piano {u.floor}</option>))}</select>
                    </div>
                  )}

                  {unitStrategy === 'new' && (
                    <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Interno</label><input type="text" value={unitForm.internal} onChange={e => setUnitForm({...unitForm, internal: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold" /></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Piano</label><input type="text" value={unitForm.floor} onChange={e => setUnitForm({...unitForm, floor: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm" /></div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setIsPersonModalOpen(false)} className="px-6 py-3 font-bold text-slate-400 text-sm hover:text-slate-600 transition-colors">Annulla</button>
              <button onClick={handleSavePerson} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 flex items-center gap-2 transition-all">
                <Check className="w-4 h-4 text-emerald-400" /> Salva Anagrafica
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NUOVA UNITÀ */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Inserimento Unità</h3>
              <button onClick={() => setIsUnitModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <div className="p-8 grid grid-cols-2 gap-6">
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Interno</label><input type="text" value={unitForm.internal} onChange={e => setUnitForm({...unitForm, internal: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Piano</label><input type="text" value={unitForm.floor} onChange={e => setUnitForm({...unitForm, floor: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" /></div>
            </div>
            <div className="p-8 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setIsUnitModalOpen(false)} className="px-6 py-3 font-bold text-slate-400 text-sm">Annulla</button>
              <button onClick={handleSaveUnit} className="px-8 py-3 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg">Aggiungi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const UserMinus = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
);

export default CondominiumRegistry;
