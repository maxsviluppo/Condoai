
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
  UserCheck,
  Mail,
  Hash,
  UserCircle,
  Phone,
  Map,
  UserMinus
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
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<{unitId: string, role: 'owner' | 'tenant'} | null>(null);

  // Forms State
  const [condoForm, setCondoForm] = useState({ 
    name: '', street: '', streetNumber: '', cap: '', city: '', province: '', fiscalCode: '', cadastralData: '' 
  });
  
  const [personForm, setPersonForm] = useState<Partial<Person>>({ 
    firstName: '', lastName: '', email: '', pec: '', phone: '', fiscalCode: '', residenceAddress: '', role: 'Proprietario' 
  });

  const [newUnitForm, setNewUnitForm] = useState<Partial<Unit>>({ 
    internal: '', staircase: '', floor: '', subalterno: '', millesimes: 0, type: 'Appartamento' 
  });

  // Data State (Mock)
  const [units, setUnits] = useState<Unit[]>([
    { id: 'u1', internal: '1A', staircase: 'A', floor: '1', subalterno: '12', millesimes: 45.5, ownerId: 'p1', tenantId: 'p2', type: 'Appartamento' },
    { id: 'u2', internal: '1B', staircase: 'A', floor: '1', subalterno: '13', millesimes: 38.2, ownerId: 'p2', type: 'Appartamento' },
  ]);

  const [people, setPeople] = useState<Person[]>([
    { id: 'p1', firstName: 'Mario', lastName: 'Rossi', email: 'mario.rossi@email.com', phone: '333 1234567', fiscalCode: 'RSSMRA80A01F205Z', role: 'Proprietario' },
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

  // Condo Handlers
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
      alert("Completare i campi obbligatori: Nome, Codice Fiscale e Città.");
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

  // Person Handlers
  const openNewPersonModal = () => {
    setIsEditingPerson(false);
    setCurrentPersonId(null);
    setPersonForm({ firstName: '', lastName: '', email: '', pec: '', phone: '', fiscalCode: '', residenceAddress: '', role: 'Proprietario' });
    setIsPersonModalOpen(true);
  };

  const openEditPersonModal = (person: Person) => {
    setIsEditingPerson(true);
    setCurrentPersonId(person.id);
    setPersonForm({ ...person });
    setIsPersonModalOpen(true);
  };

  const handleSavePerson = () => {
    if (!personForm.firstName || !personForm.lastName || !personForm.fiscalCode) {
      alert("Completare Nome, Cognome e Codice Fiscale.");
      return;
    }

    if (isEditingPerson && currentPersonId) {
      setPeople(prev => prev.map(p => p.id === currentPersonId ? { ...p, ...personForm } as Person : p));
    } else {
      const person: Person = { id: `p${Date.now()}`, ...personForm as Person };
      setPeople(prev => [...prev, person]);
    }
    setIsPersonModalOpen(false);
  };

  const deletePerson = (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questo soggetto? Verrà rimosso anche dalle unità associate.")) {
      setPeople(prev => prev.filter(p => p.id !== id));
      setUnits(prev => prev.map(u => ({
        ...u,
        ownerId: u.ownerId === id ? '' : u.ownerId,
        tenantId: u.tenantId === id ? undefined : u.tenantId
      })));
    }
  };

  // Unit Handlers
  const handleSaveUnit = () => {
    const unit: Unit = { id: `u${Date.now()}`, ...newUnitForm as Unit, ownerId: '', tenantId: undefined };
    setUnits(prev => [...prev, unit]);
    setIsUnitModalOpen(false);
    setNewUnitForm({ internal: '', staircase: '', floor: '', subalterno: '', millesimes: 0, type: 'Appartamento' });
  };

  const assignPerson = (personId: string) => {
    if (isAssignModalOpen) {
      const { unitId, role } = isAssignModalOpen;
      setUnits(prev => prev.map(u => 
        u.id === unitId 
          ? (role === 'owner' ? { ...u, ownerId: personId } : { ...u, tenantId: personId }) 
          : u
      ));
      setIsAssignModalOpen(null);
    }
  };

  const unassignPerson = (unitId: string, role: 'owner' | 'tenant') => {
    setUnits(prev => prev.map(u => 
      u.id === unitId 
        ? (role === 'owner' ? { ...u, ownerId: '' } : { ...u, tenantId: undefined }) 
        : u
    ));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Anagrafica & Patrimonio</h2>
          <p className="text-slate-500 text-sm">Gestione immobili, dati catastali e soggetti collegati.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={openNewCondoModal}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl hover:bg-slate-800 transition-all shadow-lg text-sm font-bold"
          >
            <Building2 className="w-4 h-4 text-emerald-400" /> Nuovo Condominio
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SIDEBAR: ELENCO CONDOMINI */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 h-full">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">I Tuoi Immobili</h3>
            <div className="space-y-2">
              {condos.map(condo => (
                <button 
                  key={condo.id} 
                  onClick={() => setSelectedCondo(condo)}
                  className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3 group/item ${selectedCondo?.id === condo.id ? 'bg-slate-800 text-white shadow-xl' : 'hover:bg-slate-50 text-slate-600'}`}
                >
                  <div className={`p-2 rounded-xl ${selectedCondo?.id === condo.id ? 'bg-white/10 text-emerald-400' : 'bg-slate-100 text-slate-400'}`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm truncate">{condo.name}</p>
                    <p className="text-[10px] opacity-70 truncate uppercase">{condo.city}</p>
                  </div>
                </button>
              ))}
              {condos.length === 0 && (
                <div className="text-center py-8 text-slate-300 italic text-sm">Nessun condominio registrato.</div>
              )}
            </div>
          </div>
        </aside>

        {/* AREA PRINCIPALE */}
        <div className="lg:col-span-3 space-y-6">
          {selectedCondo ? (
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 min-h-[600px]">
              {/* HEADER DETTAGLIO */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-50">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner">
                    <Building2 className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">{selectedCondo.name}</h3>
                      <button 
                        onClick={openEditCondoModal}
                        className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all shadow-sm"
                        title="Modifica Condominio"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" /> 
                      {selectedCondo.street} {selectedCondo.streetNumber}, {selectedCondo.cap} {selectedCondo.city} ({selectedCondo.province})
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Codice Fiscale</p>
                  <p className="text-sm font-mono font-black text-slate-700 uppercase">{selectedCondo.fiscalCode}</p>
                </div>
              </div>

              {/* TABS */}
              <div className="flex gap-8 mb-8 border-b border-slate-50">
                <button onClick={() => setActiveTab('units')} className={`flex items-center gap-2 pb-4 text-sm font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === 'units' ? 'border-emerald-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  <Home className="w-4 h-4" /> Unità & Catasto
                </button>
                <button onClick={() => setActiveTab('people')} className={`flex items-center gap-2 pb-4 text-sm font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === 'people' ? 'border-emerald-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  <Users className="w-4 h-4" /> Anagrafica Persone
                </button>
              </div>

              {/* TAB UNITA' */}
              {activeTab === 'units' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" placeholder="Cerca interno o SUB..." value={unitSearch} onChange={e => setUnitSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-transparent border-none text-sm outline-none focus:ring-0 font-medium" />
                    </div>
                    <button onClick={() => setIsUnitModalOpen(true)} className="bg-emerald-500 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"><Plus className="w-3 h-3" /> Aggiungi Unità</button>
                  </div>

                  <div className="overflow-hidden border border-slate-100 rounded-[32px] shadow-sm bg-white">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500 font-black uppercase text-[10px] tracking-widest">
                        <tr>
                          <th className="px-6 py-5">Interno / SUB</th>
                          <th className="px-6 py-5">Proprietario</th>
                          <th className="px-6 py-5">Inquilino</th>
                          <th className="px-6 py-5">Millesimi</th>
                          <th className="px-6 py-5 text-right">Azioni</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredUnits.map(unit => {
                          const owner = people.find(p => p.id === unit.ownerId);
                          const tenant = people.find(p => p.id === unit.tenantId);
                          return (
                            <tr key={unit.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="font-black text-slate-800 uppercase tracking-tight">Int. {unit.internal}</span>
                                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">SUB {unit.subalterno}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {owner ? (
                                  <div className="flex items-center gap-2 group/owner">
                                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center font-black text-[10px]">{owner.firstName[0]}{owner.lastName[0]}</div>
                                    <span className="font-bold text-slate-700 text-xs">{owner.firstName} {owner.lastName}</span>
                                    <button onClick={() => unassignPerson(unit.id, 'owner')} className="opacity-0 group-hover/owner:opacity-100 text-red-400 hover:text-red-600 ml-1 transition-all"><X className="w-3 h-3" /></button>
                                  </div>
                                ) : <button onClick={() => setIsAssignModalOpen({ unitId: unit.id, role: 'owner' })} className="text-[9px] font-black text-slate-300 uppercase hover:text-emerald-500 transition-colors">Assegna</button>}
                              </td>
                              <td className="px-6 py-4">
                                {tenant ? (
                                  <div className="flex items-center gap-2 group/tenant">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center font-black text-[10px]"><UserCircle className="w-4 h-4" /></div>
                                    <span className="font-bold text-emerald-700 text-xs">{tenant.firstName} {tenant.lastName}</span>
                                    <button onClick={() => unassignPerson(unit.id, 'tenant')} className="opacity-0 group-hover/tenant:opacity-100 text-red-400 hover:text-red-600 ml-1 transition-all"><X className="w-3 h-3" /></button>
                                  </div>
                                ) : <button onClick={() => setIsAssignModalOpen({ unitId: unit.id, role: 'tenant' })} className="text-[9px] font-black text-slate-300 uppercase hover:text-emerald-500 transition-colors">+ Inquilino</button>}
                              </td>
                              <td className="px-6 py-4 font-mono font-black text-slate-600 text-sm">{unit.millesimes.toFixed(3)}</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                  <button className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl"><Edit2 className="w-4 h-4" /></button>
                                  <button onClick={() => setUnits(prev => prev.filter(u => u.id !== unit.id))} className="p-2 text-red-400 hover:bg-red-50 rounded-xl"><Trash2 className="w-4 h-4" /></button>
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

              {/* TAB PERSONE */}
              {activeTab === 'people' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-3xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                    <Search className="w-5 h-5 text-slate-400 group-focus-within:text-emerald-500" />
                    <input type="text" placeholder="Cerca persona per nome o CF..." value={personSearch} onChange={e => setPersonSearch(e.target.value)} className="w-full bg-transparent border-none text-sm font-bold text-slate-700 placeholder:text-slate-400 outline-none" />
                    <button onClick={openNewPersonModal} className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><UserPlus className="w-4 h-4 text-emerald-400" /> Nuovo Soggetto</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPeople.map(person => (
                      <div key={person.id} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative group overflow-hidden">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-800 flex items-center justify-center font-black text-lg border border-slate-100 shadow-inner">{person.firstName[0]}{person.lastName[0]}</div>
                          <div className="min-w-0">
                            <p className="font-black text-slate-800 leading-tight truncate">{person.firstName} {person.lastName}</p>
                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${person.role === 'Proprietario' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>{person.role}</span>
                          </div>
                        </div>
                        <div className="space-y-2 text-xs text-slate-500 font-medium bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                          <p className="truncate flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-300" /> {person.email}</p>
                          <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-300" /> {person.phone}</p>
                          <p className="flex items-center gap-2 font-mono text-[10px] text-slate-400 font-bold uppercase mt-2 pt-2 border-t border-slate-100"><Fingerprint className="w-3.5 h-3.5" /> {person.fiscalCode}</p>
                        </div>
                        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                          <button onClick={() => openEditPersonModal(person)} className="p-2.5 text-slate-500 bg-white shadow-md border border-slate-100 rounded-xl hover:bg-slate-50 hover:text-emerald-500"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => deletePerson(person.id)} className="p-2.5 text-red-500 bg-white shadow-md border border-slate-100 rounded-xl hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
             <div className="bg-white rounded-[40px] p-16 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mb-8 border border-slate-100 shadow-inner"><Building2 className="w-12 h-12 text-slate-300" /></div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Seleziona un Condominio</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-md">Scegli un condominio dalla lista per gestire l'anagrafica, oppure creane uno nuovo.</p>
                <button onClick={openNewCondoModal} className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center gap-3">
                   <Plus className="w-5 h-5 text-emerald-400" /> Aggiungi Condominio
                </button>
             </div>
          )}
        </div>
      </div>

      {/* MODAL: CONDOMINIO (CREATE/EDIT) */}
      {isCondoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><Building2 className="w-6 h-6" /></div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{isEditingCondo ? 'Modifica Condominio' : 'Nuovo Condominio'}</h3>
              </div>
              <button onClick={() => setIsCondoModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            
            <div className="p-8 grid grid-cols-6 gap-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1 col-span-4"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome</label><input type="text" value={condoForm.name} onChange={e => setCondoForm({...condoForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-emerald-500" /></div>
              <div className="space-y-1 col-span-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Codice Fiscale</label><input type="text" value={condoForm.fiscalCode} onChange={e => setCondoForm({...condoForm, fiscalCode: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-emerald-500" /></div>
              <div className="space-y-1 col-span-4"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Via</label><input type="text" value={condoForm.street} onChange={e => setCondoForm({...condoForm, street: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
              <div className="space-y-1 col-span-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Civico</label><input type="text" value={condoForm.streetNumber} onChange={e => setCondoForm({...condoForm, streetNumber: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
              <div className="space-y-1 col-span-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">CAP</label><input type="text" value={condoForm.cap} onChange={e => setCondoForm({...condoForm, cap: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
              <div className="space-y-1 col-span-3"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Città</label><input type="text" value={condoForm.city} onChange={e => setCondoForm({...condoForm, city: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
              <div className="space-y-1 col-span-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Prov.</label><input type="text" value={condoForm.province} onChange={e => setCondoForm({...condoForm, province: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-center outline-none" maxLength={2} /></div>
              <div className="space-y-1 col-span-6"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Dati Catastali</label><input type="text" value={condoForm.cadastralData} onChange={e => setCondoForm({...condoForm, cadastralData: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" placeholder="Es: Fg. 10, Part. 50" /></div>
            </div>

            <div className="p-8 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setIsCondoModalOpen(false)} className="px-6 py-3 font-bold text-slate-400 text-sm hover:text-slate-600 transition-colors">Annulla</button>
              <button onClick={handleSaveCondo} className="px-8 py-3 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg text-sm hover:bg-emerald-600 transition-all flex items-center gap-2"><Check className="w-4 h-4" /> Salva</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PERSON (CREATE/EDIT) */}
      {isPersonModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg">{isEditingPerson ? <Edit2 className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}</div>
                 <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{isEditingPerson ? 'Modifica Anagrafica' : 'Nuovo Soggetto'}</h3>
               </div>
               <button onClick={() => setIsPersonModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <div className="p-8 grid grid-cols-2 gap-6">
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome</label><input type="text" value={personForm.firstName} onChange={e => setPersonForm({...personForm, firstName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none font-bold focus:border-blue-500" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cognome</label><input type="text" value={personForm.lastName} onChange={e => setPersonForm({...personForm, lastName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none font-bold focus:border-blue-500" /></div>
              <div className="space-y-1 col-span-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Codice Fiscale</label><input type="text" value={personForm.fiscalCode} onChange={e => setPersonForm({...personForm, fiscalCode: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none font-mono text-slate-600 uppercase focus:border-blue-500" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label><input type="email" value={personForm.email} onChange={e => setPersonForm({...personForm, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Telefono</label><input type="text" value={personForm.phone} onChange={e => setPersonForm({...personForm, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500" /></div>
              <div className="space-y-1 col-span-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ruolo</label>
                <select value={personForm.role} onChange={e => setPersonForm({...personForm, role: e.target.value as any})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none">
                  <option>Proprietario</option>
                  <option>Inquilino</option>
                  <option>Comproprietario</option>
                </select>
              </div>
            </div>
            <div className="p-8 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setIsPersonModalOpen(false)} className="px-6 py-3 font-bold text-slate-400 text-sm hover:text-slate-600 transition-colors">Annulla</button>
              <button onClick={handleSavePerson} className="px-8 py-3 bg-blue-500 text-white rounded-2xl font-bold shadow-lg text-sm hover:bg-blue-600 transition-all flex items-center gap-2"><Check className="w-4 h-4" /> {isEditingPerson ? 'Aggiorna' : 'Salva'}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN OWNER/TENANT */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Assegna {isAssignModalOpen.role === 'owner' ? 'Proprietario' : 'Inquilino'}</h3>
              <button onClick={() => setIsAssignModalOpen(null)} className="p-1 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-2">
              {people.map(p => (
                <button 
                  key={p.id}
                  onClick={() => assignPerson(p.id)}
                  className="w-full text-left p-4 rounded-2xl hover:bg-emerald-50 border border-slate-100 transition-all flex items-center justify-between group"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 truncate">{p.firstName} {p.lastName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{p.fiscalCode}</p>
                  </div>
                  <UserCheck className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
              <button onClick={() => { setIsAssignModalOpen(null); openNewPersonModal(); }} className="w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-bold flex items-center justify-center gap-2 hover:border-blue-400 hover:text-blue-500 transition-all">
                <Plus className="w-4 h-4" /> Crea nuovo soggetto e assegna
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW UNIT */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><Home className="w-6 h-6" /></div>
                 <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Inserimento Unità</h3>
               </div>
               <button onClick={() => setIsUnitModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <div className="p-8 grid grid-cols-2 gap-6">
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Interno</label><input type="text" value={newUnitForm.internal} onChange={e => setNewUnitForm({...newUnitForm, internal: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">SUB Catastale</label><input type="text" value={newUnitForm.subalterno} onChange={e => setNewUnitForm({...newUnitForm, subalterno: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-emerald-600 font-bold outline-none" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Scala</label><input type="text" value={newUnitForm.staircase} onChange={e => setNewUnitForm({...newUnitForm, staircase: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Millesimi</label><input type="number" step="0.001" value={newUnitForm.millesimes} onChange={e => setNewUnitForm({...newUnitForm, millesimes: parseFloat(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono outline-none" /></div>
            </div>
            <div className="p-8 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setIsUnitModalOpen(false)} className="px-6 py-3 font-bold text-slate-400 text-sm hover:text-slate-600 transition-colors">Annulla</button>
              <button onClick={handleSaveUnit} className="px-8 py-3 bg-indigo-500 text-white rounded-2xl font-bold shadow-lg text-sm hover:bg-indigo-600 transition-all">Crea Unità</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CondominiumRegistry;
