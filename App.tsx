
import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Accounting from './components/Accounting';
import Assemblies from './components/Assemblies';
import Maintenance from './components/Maintenance';
import Documents from './components/Documents';
import EmergencyHub from './components/EmergencyHub';
import Communication from './components/Communication';
import LegalFiscal from './components/LegalFiscal';
import Analytics from './components/Analytics';
import CondominiumRegistry from './components/CondominiumRegistry';
import VoiceAssistant from './components/VoiceAssistant';
import { AppSection, MaintenanceRequest, AIAction, Condominium } from './types';
import { Bell, Search, Settings, Building2, ChevronDown } from 'lucide-react';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<AppSection>(AppSection.DASHBOARD);
  const [selectedCondoId, setSelectedCondoId] = useState<string>('all');
  
  // Real state for condominiums
  const [condos, setCondos] = useState<Condominium[]>([
    { id: '1', name: 'Villa dei Fiori', address: 'Via Roma 12', city: 'Milano', fiscalCode: '90012345678', totalUnits: 24 },
    { id: '2', name: 'Residenza Parco', address: 'Viale Monza 45', city: 'Milano', fiscalCode: '91122334455', totalUnits: 12 },
  ]);

  const addCondo = (newCondo: Condominium) => {
    setCondos(prev => [...prev, newCondo]);
    setSelectedCondoId(newCondo.id);
  };

  const updateCondo = (updatedCondo: Condominium) => {
    setCondos(prev => prev.map(c => c.id === updatedCondo.id ? updatedCondo : c));
  };

  const deleteCondo = (id: string) => {
    if (confirm("Sei sicuro di voler eliminare definitivamente questo condominio e tutti i suoi dati?")) {
      setCondos(prev => prev.filter(c => c.id !== id));
      if (selectedCondoId === id) setSelectedCondoId('all');
    }
  };

  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([
    { id: '1', subject: 'Perdita acqua garage', location: 'Piano -1', urgency: 'Alta', status: 'In Lavorazione', date: '2023-10-08', description: 'Acqua che fuoriesce dal giunto.' },
    { id: '2', subject: 'Lampadina fulminata', location: 'Ingresso B', urgency: 'Bassa', status: 'Aperta', date: '2023-10-09', description: 'Sostituzione plafoniera.' }
  ]);

  const selectedCondoName = useMemo(() => {
    if (selectedCondoId === 'all') return 'Tutti i Condomini';
    return condos.find(c => c.id === selectedCondoId)?.name || 'Seleziona...';
  }, [selectedCondoId, condos]);

  const handleAIAction = (action: AIAction) => {
    switch (action.actionType) {
      case 'CREATE_MAINTENANCE':
        if (action.params) {
          const newReq: MaintenanceRequest = {
            id: Date.now().toString(),
            subject: action.params.subject || 'Segnalazione Generica',
            location: action.params.location || 'Condominio',
            urgency: action.params.urgency || 'Media',
            status: 'Aperta',
            date: new Date().toISOString().split('T')[0],
            description: action.params.description || ''
          };
          setMaintenanceRequests(prev => [newReq, ...prev]);
          setCurrentSection(AppSection.MAINTENANCE);
        }
        break;
      case 'CHECK_PAGAMENTI':
        setCurrentSection(AppSection.ACCOUNTING);
        break;
      case 'GENERATE_MINUTES':
        setCurrentSection(AppSection.ASSEMBLIES);
        break;
      default:
        break;
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case AppSection.DASHBOARD: return <Dashboard selectedCondoId={selectedCondoId} />;
      case AppSection.ACCOUNTING: return <Accounting />;
      case AppSection.ASSEMBLIES: return <Assemblies />;
      case AppSection.MAINTENANCE: return <Maintenance requests={maintenanceRequests} />;
      case AppSection.DOCUMENTS: return <Documents />;
      case AppSection.EMERGENCY: return <EmergencyHub />;
      case AppSection.RESIDENTS: return <Communication />;
      case AppSection.LEGAL: return <LegalFiscal />;
      case AppSection.ANALYTICS: return <Analytics />;
      case AppSection.CONDOMINIUMS: 
        return <CondominiumRegistry 
          initialCondoId={selectedCondoId} 
          condos={condos} 
          onAddCondo={addCondo} 
          onUpdateCondo={updateCondo}
          onDeleteCondo={deleteCondo}
        />;
      case AppSection.SUPPLIERS: return <div className="p-12 text-center text-slate-400">Modulo Fornitori & Preventivi AI in arrivo...</div>;
      default: return <Dashboard selectedCondoId={selectedCondoId} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar 
        currentSection={currentSection} 
        onNavigate={setCurrentSection} 
        selectedCondoId={selectedCondoId}
        setSelectedCondoId={setSelectedCondoId}
        condos={condos}
      />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-10 bg-white/50 backdrop-blur-md sticky top-0 z-20 -mx-8 px-8 py-4 border-b border-slate-200/50">
          <div className="flex items-center gap-6">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cerca documenti, fatture..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
              />
            </div>

            <div className="relative group">
              <button className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm hover:border-emerald-300 transition-all min-w-[200px]">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-full">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Visualizzazione</p>
                  <p className="text-xs font-bold text-slate-700 truncate">{selectedCondoName}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </button>

              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
                <button 
                  onClick={() => setSelectedCondoId('all')}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 flex items-center gap-3 ${selectedCondoId === 'all' ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-600'}`}
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> Tutti i Condomini
                </button>
                <div className="h-px bg-slate-50 my-1 mx-4" />
                {condos.map(condo => (
                  <button 
                    key={condo.id}
                    onClick={() => setSelectedCondoId(condo.id)}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 flex items-center gap-3 ${selectedCondoId === condo.id ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-600'}`}
                  >
                    <div className="w-2 h-2 rounded-full bg-slate-300" /> {condo.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-500 hover:text-emerald-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-slate-500 hover:text-emerald-600 transition-colors"><Settings className="w-5 h-5" /></button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-full pl-1 pr-4 py-1 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">JD</div>
              <span className="text-sm font-semibold text-slate-700">Studio Rossi</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pb-24">
          {renderSection()}
        </div>
      </main>

      <VoiceAssistant 
        onActionExecute={handleAIAction}
        context={{
          current_section: currentSection,
          maintenance_count: maintenanceRequests.length,
          selected_condo_id: selectedCondoId
        }}
      />
    </div>
  );
};

export default App;
