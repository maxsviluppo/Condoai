
import React from 'react';
import { Wrench, AlertCircle, Clock, CheckCircle2, Plus } from 'lucide-react';
import { MaintenanceRequest } from '../types';

interface MaintenanceProps {
  requests: MaintenanceRequest[];
}

const Maintenance: React.FC<MaintenanceProps> = ({ requests }) => {
  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case 'Alta': return 'bg-red-100 text-red-700 border-red-200';
      case 'Media': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manutenzioni & Guasti</h2>
          <p className="text-slate-500">Monitora gli interventi e le segnalazioni dei condòmini.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 font-medium">
          <Plus className="w-4 h-4" /> Nuova Segnalazione
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {requests.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
            <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Nessuna richiesta di manutenzione attiva.</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${req.status === 'Chiusa' ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{req.subject}</h4>
                  <div className="flex flex-wrap gap-3 mt-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {req.date}</span>
                    <span className="flex items-center gap-1">📍 {req.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getUrgencyStyles(req.urgency)}`}>
                  Urgenza {req.urgency}
                </span>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-200">
                  {req.status === 'Aperta' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                  {req.status === 'In Lavorazione' && <Clock className="w-4 h-4 text-blue-500" />}
                  {req.status === 'Chiusa' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  <span className="text-xs font-bold text-slate-600">{req.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Maintenance;
