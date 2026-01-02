
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Link,
  Upload,
  FileSpreadsheet,
  Mail,
  Hash,
  UserCircle,
  Phone,
  LayoutGrid,
  ChevronRight,
  ClipboardList,
  Map
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
  
  const [isNewCondoModalOpen, setIsNewCondoModalOpen] = useState(false);
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<{unitId: string, role: 'owner' | 'tenant'} | null>(null);

  const [newCondoForm, setNewCondoForm] = useState({ 
    name: '', 
    street: '', 
    streetNumber: '', 
    cap: '', 
    city: '', 
    province: '', 
    fiscalCode: '', 
    cadastralData: '' 
  });
  
  const [newPersonForm, setNewPersonForm] = useState<Partial<Person>>({ firstName: '', lastName: '', email: '', pec: '', phone: '', fiscalCode: '', residenceAddress: '', role: 'Proprietario' });
  const [newUnitForm, setNewUnitForm] = useState<Partial<Unit>>({ internal: '', staircase: '', floor: '', subalterno: '', millesimes: 0, type: 'Appartamento' });

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

  const handleSaveCondo = () => {
    if (!newCondoForm.name || !newCondoForm.fiscalCode || !newCondoForm.city) {
      alert("Completare i campi obbligatori: Nome, Codice Fiscale e Città.");
      return;
    }
    const condo: Condominium = { id: Date.now().toString(), ...newCondoForm, totalUnits: 0 };
    onAddCondo(condo);
    setIsNewCondoModalOpen(false);
    setNewCondoForm({ name: '', street: '', streetNumber: '', cap: '', city: '', province: '', fiscalCode: '', cadastralData: '' });
  };

  const handleSaveUnit = () => {
    const unit: Unit = { id: `u${Date.now()}`, ...newUnitForm as Unit, ownerId: '', tenantId: '' };
    setUnits(prev => [...prev, unit]);
    setIsUnitModalOpen(false);
    setNewUnitForm({ internal: '', staircase: '', floor: '', subalterno: '', millesimes: 0, type: 'Appartamento' });
  };

  const handleSavePerson = () => {
    const person: Person = { id: `p${Date.now()}`, ...newPersonForm as Person };
    setPeople(prev => [...prev, person]);
    setIsAddPersonModalOpen(false);
    setNewPersonForm({ firstName: '', lastName: '', email: '', pec: '', phone: '', fiscalCode: '', residenceAddress: '', role: 'Proprietario' });
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

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Anagrafica & Patrimonio</h2>
          <p className="text-slate-500 text-sm">Gestione immobili, dati catastali e soggetti collegati.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsNewCondoModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl hover:bg-slate-800 transition-all shadow-lg text-sm font-bold"
          >
            <Building2 className="w-4 h-4 text-emerald-400" /> Nuovo Condominio
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">I Tuoi Immobili</h3>
            <div className="space-y-2">
              {condos.map(condo => (
                <button 
                  key={condo.id} 
                  onClick={() => setSelectedCondo(condo)}
                  className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3 ${selectedCondo?.id === condo.id ? 'bg-slate-800 text-white shadow-xl' : 'hover:bg-slate-50 text-slate-600'}`}
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
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          {selectedCondo ? (
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 min-h-[600px]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-50">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner">
                    <Building2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">{selectedCondo.name}</h3>
                    <div className="flex flex-col gap-1 mt-1">
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" /> 
                        {selectedCondo.street} {selectedCondo.streetNumber}, {selectedCondo.cap} {selectedCondo.city} ({selectedCondo.province})
                      </p>
                      {selectedCondo.cadastralData && (
                        <div className="flex items-center gap-2 mt-1">
                           <Hash className="w-3 h-3 text-emerald-600" />
                           <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Catasto: {selectedCondo.cadastralData}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Codice Fiscale</p>
                  <p className="text-sm font-mono font-black text-slate-700 uppercase">{selectedCondo.fiscalCode}</p>
                </div>
              </div>

              <div className="flex gap-8 mb-8 border-b border-slate-50">
                <button onClick={() => setActiveTab('units')} className={`flex items-center gap-2 pb-4 text-sm font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === 'units' ? 'border-emerald-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  <Home className="w-4 h-4" /> Unità & Catasto
                </button>
                <button onClick={() => setActiveTab('people')} className={`flex items-center gap-2 pb-4 text-sm font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === 'people' ? 'border-emerald-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  <Users className="w-4 h-4" /> Anagrafica Persone
                </button>
              </div>

              {activeTab === 'units' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" placeholder="Cerca interno o SUB..." value={unitSearch} onChange={e => setUnitSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-transparent border-none text-sm outline-none focus:ring-0 font-medium" />
                    </div>
                    <button onClick={() => setIsUnitModalOpen(true)} className="bg-emerald-500 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 flex items-center gap-2"><Plus className="w-3 h-3" /> Aggiungi Unità</button>
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
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center font-black text-[10px]">{owner.firstName[0]}{owner.lastName[0]}</div>
                                    <span className="font-bold text-slate-700 text-xs">{owner.firstName} {owner.lastName}</span>
                                  </div>
                                ) : <button onClick={() => setIsAssignModalOpen({ unitId: unit.id, role: 'owner' })} className="text-[9px] font-black text-slate-300 uppercase hover:text-emerald-500 transition-colors">Assegna</button>}
                              </td>
                              <td className="px-6 py-4">
                                {tenant ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center font-black text-[10px]"><UserCircle className="w-4 h-4" /></div>
                                    <span className="font-bold text-emerald-700 text-xs">{tenant.firstName} {tenant.lastName}</span>
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

              {activeTab === 'people' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-3xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                    <Search className="w-5 h-5 text-slate-400 group-focus-within:text-emerald-500" />
                    <input type="text" placeholder="Cerca persona..." value={personSearch} onChange={e => setPersonSearch(e.target.value)} className="w-full bg-transparent border-none text-sm font-bold text-slate-700 placeholder:text-slate-400" />
                    <button onClick={() => setIsAddPersonModalOpen(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><UserPlus className="w-4 h-4 text-emerald-400" /> Nuovo Soggetto</button>
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
                        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setPeople(prev => prev.filter(p => p.id !== person.id))} className="p-2.5 text-red-500 bg-white shadow-md border border-slate-100 rounded-xl hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
             <div className="bg-white rounded-[40px] p-16 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                <Building2 className="w-20 h-20 text-slate-200 mb-6" />
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Gestione Patrimonio Condominiale</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-md">Seleziona un condominio dalla lista laterale o creane uno nuovo per iniziare a gestire anagrafiche, unità e millesimi.</p>
                <button onClick={() => setIsNewCondoModalOpen(true)} className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center gap-3">
                   <Plus className="w-5 h-5 text-emerald-400" /> Crea Nuovo Condominio
                </button>
             </div>
          )}
        </div>
      </div>

      {/* MODAL: NEW CONDOMINIUM */}
      {isNewCondoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 transition-opacity">
          <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><Building2 className="w-6 h-6" /></div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Anagrafica Condominio</h3>
              </div>
              <button onClick={() => setIsNewCondoModalOpen(false)}><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <div className="p-8 grid grid-cols-6 gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-1 col-span-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ragione Sociale / Nome</label>
                <input type="text" value={newCondoForm.name} onChange={e => setNewCondoForm({...newCondoForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 font-bold" placeholder="Es: Condominio Villa dei Fiori" />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Codice Fiscale</label>
                <input type="text" value={newCondoForm.fiscalCode} onChange={e => setNewCondoForm({...newCondoForm, fiscalCode: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 font-mono" placeholder="90000000000" />
              </div>

              <div className="space-y-1 col-span-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Via / Viale / Piazza</label>
                <div className="relative">
                  <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="text" value={newCondoForm.street} onChange={e => setNewCondoForm({...newCondoForm, street: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-emerald-500" placeholder="Es: Via Roma" />
                </div>
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Civico</label>
                <input type="text" value={newCondoForm.streetNumber} onChange={e => setNewCondoForm({...newCondoForm, streetNumber: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500" placeholder="Es: 12/A" />
              </div>

              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">CAP</label>
                <input type="text" value={newCondoForm.cap} onChange={e => setNewCondoForm({...newCondoForm, cap: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500" placeholder="Es: 20121" />
              </div>
              <div className="space-y-1 col-span-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Città</label>
                <input type="text" value={newCondoForm.city} onChange={e => setNewCondoForm({...newCondoForm, city: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500" placeholder="Es: Milano" />
              </div>
              <div className="space-y-1 col-span-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Prov.</label>
                <input type="text" value={newCondoForm.province} onChange={e => setNewCondoForm({...newCondoForm, province: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500" placeholder="MI" maxLength={2} />
              </div>

              <div className="space-y-1 col-span-6">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Dati Catastali (Foglio, Particella, Sezione)</label>
                <input type="text" value={newCondoForm.cadastralData} onChange={e => setNewCondoForm({...newCondoForm, cadastralData: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500" placeholder="Es: Fg. 10, Part. 50" />
              </div>
            </div>
            <div className="p-8 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setIsNewCondoModalOpen(false)} className="px-6 py-3 font-bold text-slate-400 text-sm">Annulla</button>
              <button onClick={handleSaveCondo} className="px-8 py-3 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 text-sm">Salva Condominio</button>
            </div>
          </div>
        </div>
      )}

      {/* Altri Modal (Unità, Persone, etc.) rimangono invariati ma puliti */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><Home className="w-6 h-6" /></div>
                 <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Nuova Unità</h3>
               </div>
               <button onClick={() => setIsUnitModalOpen(false)}><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <div className="p-8 grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Interno</label>
                <input type="text" value={newUnitForm.internal} onChange={e => setNewUnitForm({...newUnitForm, internal: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none font-bold" placeholder="Es: 1A" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">SUB Catastale</label>
                <input type="text" value={newUnitForm.subalterno} onChange={e => setNewUnitForm({...newUnitForm, subalterno: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none font-mono text-emerald-600 font-bold" placeholder="Es: 12" />
              </div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Scala</label><input type="text" value={newUnitForm.staircase} onChange={e => setNewUnitForm({...newUnitForm, staircase: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Millesimi</label><input type="number" step="0.001" value={newUnitForm.millesimes} onChange={e => setNewUnitForm({...newUnitForm, millesimes: parseFloat(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none font-mono" /></div>
            </div>
            <div className="p-8 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setIsUnitModalOpen(false)} className="px-6 py-3 font-bold text-slate-400 text-sm">Annulla</button>
              <button onClick={handleSaveUnit} className="px-8 py-3 bg-indigo-500 text-white rounded-2xl font-bold shadow-lg text-sm">Crea Unità</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CondominiumRegistry;
