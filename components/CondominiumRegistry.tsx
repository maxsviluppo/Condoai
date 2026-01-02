
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Users, 
  Home, 
  Plus, 
  Search, 
  ChevronRight, 
  Sparkles, 
  MapPin, 
  FileText, 
  UserPlus,
  ArrowUpDown,
  Filter,
  MoreHorizontal,
  X,
  Check,
  Mic,
  Fingerprint,
  Edit2,
  Trash2,
  UserCheck,
  Link,
  SearchCode
} from 'lucide-react';
import { Condominium, Unit, Person } from '../types';
import VoiceCommand from './VoiceCommand';

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
    initialCondoId === 'all' ? null : condos.find(c => c.id === initialCondoId) || condos[0]
  );
  
  const [activeTab, setActiveTab] = useState<'units' | 'people'>('units');
  const [isNewCondoModalOpen, setIsNewCondoModalOpen] = useState(false);
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<{unitId: string} | null>(null);
  const [editingCondo, setEditingCondo] = useState<Condominium | null>(null);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  // Search Queries
  const [unitSearchQuery, setUnitSearchQuery] = useState('');
  const [personSearchQuery, setPersonSearchQuery] = useState('');

  // Registry States
  const [units, setUnits] = useState<Unit[]>([
    { id: 'u1', internal: '1A', floor: '1', millesimes: 45.5, ownerId: 'p1', type: 'Appartamento' },
    { id: 'u2', internal: '1B', floor: '1', millesimes: 38.2, ownerId: 'p2', type: 'Appartamento' },
    { id: 'u3', internal: 'G1', floor: '-1', millesimes: 2.5, ownerId: 'p1', type: 'Box' },
  ]);

  const [people, setPeople] = useState<Person[]>([
    { id: 'p1', firstName: 'Mario', lastName: 'Rossi', email: 'mario.rossi@email.com', phone: '333 1234567', fiscalCode: 'RSSMRA80A01F205Z', role: 'Proprietario' },
    { id: 'p2', firstName: 'Laura', lastName: 'Bianchi', email: 'laura.b@email.com', phone: '333 7654321', fiscalCode: 'BNCHLRA85B41H501U', role: 'Inquilino' },
    { id: 'p3', firstName: 'Giuseppe', lastName: 'Verdi', email: 'g.verdi@email.it', phone: '328 1122334', fiscalCode: 'VRDGPP75L12L219X', role: 'Proprietario' },
  ]);

  // Filtered Lists
  const filteredPeople = useMemo(() => {
    const q = personSearchQuery.toLowerCase().trim();
    if (!q) return people;
    return people.filter(p => 
      p.firstName.toLowerCase().includes(q) || 
      p.lastName.toLowerCase().includes(q) || 
      p.fiscalCode.toLowerCase().includes(q) ||
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
    );
  }, [people, personSearchQuery]);

  const filteredUnits = useMemo(() => {
    const q = unitSearchQuery.toLowerCase().trim();
    if (!q) return units;
    return units.filter(u => {
      const owner = people.find(p => p.id === u.ownerId);
      return u.internal.toLowerCase().includes(q) || 
             owner?.lastName.toLowerCase().includes(q) ||
             owner?.firstName.toLowerCase().includes(q);
    });
  }, [units, unitSearchQuery, people]);

  // Modal Form States
  const [newCondoForm, setNewCondoForm] = useState({ name: '', address: '', city: '', fiscalCode: '' });
  const [newPersonForm, setNewPersonForm] = useState<Partial<Person>>({ firstName: '', lastName: '', email: '', phone: '', fiscalCode: '', role: 'Proprietario' });
  const [newUnits, setNewUnits] = useState<Partial<Unit>[]>([]);

  // Sync with global selection
  useEffect(() => {
    if (initialCondoId === 'all') {
      setSelectedCondo(null);
    } else {
      const found = condos.find(c => c.id === initialCondoId);
      if (found) setSelectedCondo(found);
    }
  }, [initialCondoId, condos]);

  const handleOpenEditCondo = (condo: Condominium, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCondo(condo);
    setNewCondoForm({
      name: condo.name,
      address: condo.address,
      city: condo.city,
      fiscalCode: condo.fiscalCode
    });
    setIsNewCondoModalOpen(true);
  };

  const handleOpenEditPerson = (person: Person) => {
    setEditingPerson(person);
    setNewPersonForm({
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email,
      phone: person.phone,
      fiscalCode: person.fiscalCode,
      role: person.role
    });
    setIsAddPersonModalOpen(true);
  };

  const handleSaveCondo = () => {
    if (editingCondo) {
      onUpdateCondo({
        ...editingCondo,
        ...newCondoForm
      });
    } else {
      const condo: Condominium = { id: Date.now().toString(), ...newCondoForm, totalUnits: newUnits.length || 0 };
      onAddCondo(condo);
    }
    setIsNewCondoModalOpen(false);
    setEditingCondo(null);
    setNewCondoForm({ name: '', address: '', city: '', fiscalCode: '' });
    setNewUnits([]);
  };

  const handleSavePerson = () => {
    if (editingPerson) {
      setPeople(prev => prev.map(p => p.id === editingPerson.id ? { ...editingPerson, ...newPersonForm as Person } : p));
    } else {
      const person: Person = { id: `p${Date.now()}`, ...newPersonForm as Person };
      setPeople(prev => [...prev, person]);
    }
    setIsAddPersonModalOpen(false);
    setEditingPerson(null);
    setNewPersonForm({ firstName: '', lastName: '', email: '', phone: '', fiscalCode: '', role: 'Proprietario' });
  };

  const handleDeletePerson = (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questo soggetto dall'anagrafica?")) {
      setPeople(prev => prev.filter(p => p.id !== id));
      // Reset owner assignment for units that had this person
      setUnits(prev => prev.map(u => u.ownerId === id ? { ...u, ownerId: '' } : u));
    }
  };

  const handleAssignOwner = (personId: string) => {
    if (isAssignModalOpen) {
      setUnits(prev => prev.map(u => u.id === isAssignModalOpen.unitId ? { ...u, ownerId: personId } : u));
      setIsAssignModalOpen(null);
    }
  };

  const handleDeleteUnit = (unitId: string) => {
    if (confirm("Sei sicuro di voler eliminare questa unità immobiliare?")) {
      setUnits(prev => prev.filter(u => u.id !== unitId));
    }
  };

  const addQuickUnit = () => {
    setNewUnits(prev => [...prev, { internal: '', floor: '', millesimes: 0, type: 'Appartamento' }]);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Anagrafica & Unità</h2>
          <p className="text-slate-500">Gestione strutturale del patrimonio immobiliare.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => { setEditingCondo(null); setNewCondoForm({name:'', address:'', city:'', fiscalCode:''}); setIsNewCondoModalOpen(true); }}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 text-sm font-bold"
          >
            <Building2 className="w-4 h-4 text-emerald-400" /> Nuovo Condominio
          </button>
        </div>
      </header>

      {/* MODAL: ASSIGN OWNER */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Assegna Proprietario</h3>
              <button onClick={() => setIsAssignModalOpen(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-2">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Cerca persona..." className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm outline-none border border-transparent focus:border-emerald-500 transition-all" />
              </div>
              {people.map(p => (
                <button 
                  key={p.id}
                  onClick={() => handleAssignOwner(p.id)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-emerald-50 border border-slate-100 transition-all group"
                >
                  <div className="text-left">
                    <p className="font-bold text-slate-800">{p.firstName} {p.lastName}</p>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">{p.fiscalCode}</p>
                  </div>
                  <UserCheck className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => { setIsAssignModalOpen(null); setEditingPerson(null); setIsAddPersonModalOpen(true); }}
                className="w-full py-3 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-sm font-bold text-slate-500 hover:border-emerald-500 hover:text-emerald-600 transition-all"
              >
                + Crea Nuovo Soggetto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD/EDIT PERSON */}
      {isAddPersonModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  {editingPerson ? <Edit2 className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                    {editingPerson ? 'Modifica Soggetto' : 'Nuovo Soggetto'}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase">
                    {editingPerson ? 'Aggiorna Anagrafica' : 'Inserimento Anagrafica Completa'}
                  </p>
                </div>
              </div>
              <button onClick={() => { setIsAddPersonModalOpen(false); setEditingPerson(null); }}><X className="w-6 h-6 text-slate-400 hover:bg-slate-100 rounded-full" /></button>
            </div>
            <div className="p-8 grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome</label>
                <input type="text" value={newPersonForm.firstName} onChange={e => setNewPersonForm({...newPersonForm, firstName: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cognome</label>
                <input type="text" value={newPersonForm.lastName} onChange={e => setNewPersonForm({...newPersonForm, lastName: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Codice Fiscale</label>
                <input type="text" value={newPersonForm.fiscalCode} onChange={e => setNewPersonForm({...newPersonForm, fiscalCode: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 font-mono uppercase" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ruolo</label>
                <select value={newPersonForm.role} onChange={e => setNewPersonForm({...newPersonForm, role: e.target.value as any})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500">
                  <option value="Proprietario">Proprietario</option>
                  <option value="Inquilino">Inquilino</option>
                  <option value="Comproprietario">Comproprietario</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input type="email" value={newPersonForm.email} onChange={e => setNewPersonForm({...newPersonForm, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Telefono</label>
                <input type="text" value={newPersonForm.phone} onChange={e => setNewPersonForm({...newPersonForm, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button onClick={() => { setIsAddPersonModalOpen(false); setEditingPerson(null); }} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-xl">Annulla</button>
              <button onClick={handleSavePerson} className="px-8 py-2.5 bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-600">
                {editingPerson ? 'Aggiorna Soggetto' : 'Salva Soggetto'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW/EDIT CONDO MODAL */}
      {isNewCondoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  {editingCondo ? <Edit2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                    {editingCondo ? `Modifica ${editingCondo.name}` : 'Configura Nuovo Condominio'}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    {editingCondo ? 'Aggiorna Anagrafica' : 'Setup Iniziale & Unità'}
                  </p>
                </div>
              </div>
              <button onClick={() => { setIsNewCondoModalOpen(false); setEditingCondo(null); }} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {!editingCondo && (
                <div className="bg-indigo-600 text-white p-6 rounded-3xl flex items-center justify-between group shadow-xl shadow-indigo-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Smart Voice Setup</p>
                      <p className="text-[10px] opacity-80 uppercase font-black tracking-widest">Dì: "Condominio Alpha, Via Roma 1, 12 unità"</p>
                    </div>
                  </div>
                  <button className="bg-white text-indigo-600 p-3 rounded-2xl hover:scale-105 transition-transform">
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Condominio</label>
                  <input 
                    type="text" 
                    placeholder="Es: Condominio Iris" 
                    value={newCondoForm.name}
                    onChange={(e) => setNewCondoForm({...newCondoForm, name: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 rounded-2xl px-4 py-3 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Codice Fiscale Condominio</label>
                  <input 
                    type="text" 
                    placeholder="900..." 
                    value={newCondoForm.fiscalCode}
                    onChange={(e) => setNewCondoForm({...newCondoForm, fiscalCode: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 rounded-2xl px-4 py-3 outline-none transition-all font-mono uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Indirizzo</label>
                  <input 
                    type="text" 
                    placeholder="Via, Piazza..." 
                    value={newCondoForm.address}
                    onChange={(e) => setNewCondoForm({...newCondoForm, address: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 rounded-2xl px-4 py-3 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Città</label>
                  <input 
                    type="text" 
                    placeholder="Milano..." 
                    value={newCondoForm.city}
                    onChange={(e) => setNewCondoForm({...newCondoForm, city: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 rounded-2xl px-4 py-3 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {!editingCondo && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800">Unità Immobiliari</h4>
                      <p className="text-xs text-slate-400">Inserimento rapido millesimi e interni.</p>
                    </div>
                    <button 
                      onClick={addQuickUnit}
                      className="flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Aggiungi Riga
                    </button>
                  </div>

                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                    {newUnits.length === 0 ? (
                      <div className="text-center py-8">
                        <Home className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                        <p className="text-xs text-slate-400 italic">Nessuna unità aggiunta. Puoi caricarle anche dopo via Excel.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {newUnits.map((u, i) => (
                          <div key={i} className="flex gap-4 items-center animate-in slide-in-from-left-2 duration-200">
                            <input type="text" placeholder="Int." className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center font-bold" />
                            <input type="text" placeholder="Piano" className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center" />
                            <select className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none">
                               <option>Appartamento</option>
                               <option>Box</option>
                               <option>Cantina</option>
                               <option>Negozio</option>
                            </select>
                            <input type="number" placeholder="Millesimi" className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-mono" />
                            <button onClick={() => setNewUnits(prev => prev.filter((_, idx) => idx !== i))} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4">
              <button 
                onClick={() => { setIsNewCondoModalOpen(false); setEditingCondo(null); }}
                className="px-6 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-200 transition-colors"
              >
                Annulla
              </button>
              <button 
                onClick={handleSaveCondo}
                className="px-8 py-3 bg-emerald-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> {editingCondo ? 'Aggiorna Condominio' : 'Salva Condominio'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Condos List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">I Tuoi Condomini</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCondo(null)}
                className={`w-full text-left p-4 rounded-2xl transition-all group ${
                  selectedCondo === null 
                  ? 'bg-emerald-500 text-white shadow-lg' 
                  : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <p className={`font-bold text-sm ${selectedCondo === null ? 'text-white' : 'text-slate-800'}`}>
                  Tutti i Condomini
                </p>
                <p className={`text-[10px] flex items-center gap-1 mt-1 ${selectedCondo === null ? 'text-emerald-100' : 'text-slate-500'}`}>
                  Vista Aggregata
                </p>
              </button>
              {condos.map(condo => (
                <div key={condo.id} className="relative group/item">
                  <button
                    onClick={() => setSelectedCondo(condo)}
                    className={`w-full text-left p-4 rounded-2xl transition-all ${
                      selectedCondo?.id === condo.id 
                      ? 'bg-slate-800 text-white shadow-lg shadow-slate-200' 
                      : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <p className={`font-bold text-sm ${selectedCondo?.id === condo.id ? 'text-emerald-400' : 'text-slate-800'}`}>
                      {condo.name}
                    </p>
                    <p className={`text-[10px] flex items-center gap-1 mt-1 ${selectedCondo?.id === condo.id ? 'text-slate-400' : 'text-slate-500'}`}>
                      <MapPin className="w-3 h-3" /> {condo.address}
                    </p>
                  </button>
                  
                  {/* Inline Management Buttons for Condo */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => handleOpenEditCondo(condo, e)}
                      className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white transition-colors"
                      title="Modifica Condominio"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteCondo(condo.id); }}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 backdrop-blur-md rounded-lg text-red-500 transition-colors"
                      title="Elimina Condominio"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-600 text-white p-6 rounded-[32px] shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
              <Sparkles className="w-24 h-24" />
            </div>
            <h4 className="text-sm font-bold flex items-center gap-2 mb-2 italic">
              <Sparkles className="w-4 h-4" /> AI Onboarding
            </h4>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Carica un file Excel o PDF del catasto. L'AI popolerà automaticamente unità e millesimi.
            </p>
            <button className="mt-4 w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest">
              Importa con AI
            </button>
          </div>
        </div>

        {/* Main Content: Condo Details and Tabs */}
        <div className="lg:col-span-3 space-y-6">
          {!selectedCondo ? (
            <div className="bg-white rounded-[40px] p-16 text-center shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-6">
              <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-200 border border-slate-100 shadow-inner">
                <Building2 className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Portafoglio Aggregato</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">Gestisci centralmente l'intero parco immobiliare o seleziona un condominio specifico per dettagli anagrafici.</p>
              </div>
              <div className="grid grid-cols-2 gap-6 w-full max-w-lg pt-4">
                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Totale Condomini</p>
                    <p className="text-3xl font-black text-slate-800">{condos.length}</p>
                 </div>
                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unità Gestite</p>
                    <p className="text-3xl font-black text-slate-800">
                       {condos.reduce((acc, curr) => acc + curr.totalUnits, 0)}
                    </p>
                 </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-50">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 shadow-inner border border-slate-200/50">
                    <Building2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">{selectedCondo.name}</h3>
                    <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-emerald-500" /> {selectedCondo.address}, {selectedCondo.city}
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Codice Fiscale</p>
                    <p className="text-sm font-mono font-black text-slate-700 uppercase">{selectedCondo.fiscalCode}</p>
                  </div>
                  <div className="w-px h-12 bg-slate-100" />
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Unità Totali</p>
                    <p className="text-sm font-black text-slate-700">{selectedCondo.totalUnits}</p>
                  </div>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex gap-8 mb-8 border-b border-slate-50">
                <button 
                  onClick={() => setActiveTab('units')}
                  className={`flex items-center gap-2 pb-4 text-sm font-black uppercase tracking-widest transition-all border-b-4 ${
                    activeTab === 'units' ? 'border-emerald-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Home className="w-4 h-4" /> Unità Immobiliari
                </button>
                <button 
                  onClick={() => setActiveTab('people')}
                  className={`flex items-center gap-2 pb-4 text-sm font-black uppercase tracking-widest transition-all border-b-4 ${
                    activeTab === 'people' ? 'border-emerald-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Users className="w-4 h-4" /> Anagrafica Persone
                </button>
              </div>

              {activeTab === 'units' ? (
                <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Cerca interno o proprietario..." 
                        value={unitSearchQuery}
                        onChange={(e) => setUnitSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none pl-10 text-sm focus:ring-0 font-medium" 
                      />
                    </div>
                    {unitSearchQuery && (
                      <button onClick={() => setUnitSearchQuery('')} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-2 text-slate-400 hover:text-slate-600"><Filter className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-slate-600"><ArrowUpDown className="w-4 h-4" /></button>
                  </div>

                  <div className="overflow-hidden border border-slate-100 rounded-3xl shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500 font-black uppercase text-[10px] tracking-widest">
                        <tr>
                          <th className="px-6 py-5">Interno</th>
                          <th className="px-6 py-5">Tipologia</th>
                          <th className="px-6 py-5">Proprietario</th>
                          <th className="px-6 py-5">Millesimi</th>
                          <th className="px-6 py-5 text-right">Azioni</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredUnits.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">Nessuna unità trovata.</td>
                          </tr>
                        ) : (
                          filteredUnits.map(unit => {
                            const owner = people.find(p => p.id === unit.ownerId);
                            return (
                              <tr key={unit.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="px-6 py-4 font-black text-slate-800">{unit.internal}</td>
                                <td className="px-6 py-4">
                                  <span className="bg-white border border-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight">
                                    {unit.type}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  {owner ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center text-[10px] font-bold">
                                        {owner.firstName[0]}{owner.lastName[0]}
                                      </div>
                                      <span className="font-medium text-slate-700">{owner.firstName} {owner.lastName}</span>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-slate-300 italic">Non assegnato</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 font-mono font-bold text-emerald-600">{unit.millesimes.toFixed(3)}</td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <button 
                                      onClick={() => setIsAssignModalOpen({ unitId: unit.id })}
                                      className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                                      title="Assegna Proprietario"
                                    >
                                      <Link className="w-4 h-4" />
                                    </button>
                                    <button 
                                      className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                                      title="Modifica"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteUnit(unit.id)}
                                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Elimina"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                  {/* NEW: Advanced Search Bar for People */}
                  <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-3xl border border-slate-100 mb-6 group transition-all hover:bg-white hover:shadow-md">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Cerca per nome, cognome o codice fiscale..." 
                        value={personSearchQuery}
                        onChange={(e) => setPersonSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none pl-12 pr-4 text-sm focus:ring-0 font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium" 
                      />
                    </div>
                    {personSearchQuery && (
                      <button 
                        onClick={() => setPersonSearchQuery('')} 
                        className="p-2 bg-slate-200/50 hover:bg-red-50 hover:text-red-500 text-slate-500 rounded-full transition-all"
                        title="Cancella ricerca"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <div className="h-6 w-px bg-slate-200 mx-1" />
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                       <SearchCode className="w-3 h-3" /> Ricerca AI attiva
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <button 
                      onClick={() => { setEditingPerson(null); setNewPersonForm({firstName:'', lastName:'', email:'', phone:'', fiscalCode:'', role:'Proprietario'}); setIsAddPersonModalOpen(true); }}
                      className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-[32px] hover:border-emerald-400 hover:bg-emerald-50 transition-all group shadow-sm hover:shadow-emerald-50"
                    >
                      <div className="w-14 h-14 bg-slate-50 group-hover:bg-emerald-100 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-emerald-500 mb-4 transition-all">
                        <UserPlus className="w-8 h-8" />
                      </div>
                      <span className="text-sm font-black text-slate-500 group-hover:text-emerald-600 uppercase tracking-widest">Nuovo Soggetto</span>
                    </button>

                    {filteredPeople.length === 0 ? (
                      <div className="lg:col-span-2 flex flex-col items-center justify-center p-12 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 text-slate-400">
                         <Search className="w-12 h-12 opacity-20 mb-4" />
                         <p className="text-sm italic">Nessuna corrispondenza per "{personSearchQuery}"</p>
                      </div>
                    ) : (
                      filteredPeople.map(person => (
                        <div key={person.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group hover:-translate-y-1 animate-in zoom-in-95 duration-200">
                          <div className="flex items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center font-black text-lg border border-indigo-100 shadow-sm">
                                {person.firstName[0]}{person.lastName[0]}
                              </div>
                              <div>
                                <p className="font-black text-slate-800 leading-tight">{person.firstName} {person.lastName}</p>
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1">{person.role}</p>
                              </div>
                            </div>
                            
                            {/* Person Action Buttons */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleOpenEditPerson(person)}
                                className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors"
                                title="Modifica Soggetto"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeletePerson(person.id)}
                                className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                                title="Elimina Soggetto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2 text-xs text-slate-500 font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                            <p className="flex items-center gap-2 truncate">📧 {person.email}</p>
                            <p className="flex items-center gap-2">📞 {person.phone}</p>
                            <p className="flex items-center gap-2 font-mono text-emerald-600 mt-1 uppercase text-[10px] font-black">
                              <Fingerprint className="w-3 h-3" /> {person.fiscalCode}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CondominiumRegistry;
