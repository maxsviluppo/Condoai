
export enum AppSection {
  DASHBOARD = 'DASHBOARD',
  ACCOUNTING = 'ACCOUNTING',
  ASSEMBLIES = 'ASSEMBLIES',
  RESIDENTS = 'RESIDENTS',
  SUPPLIERS = 'SUPPLIERS',
  DOCUMENTS = 'DOCUMENTS',
  MAINTENANCE = 'MAINTENANCE',
  EMERGENCY = 'EMERGENCY',
  ANALYTICS = 'ANALYTICS',
  LEGAL = 'LEGAL',
  CONDOMINIUMS = 'CONDOMINIUMS'
}

export interface Document {
  id: string;
  name: string;
  category: 'Regolamento' | 'Contratto' | 'Certificazione' | 'Fattura';
  uploadDate: string;
  expiryDate?: string;
  aiSummary?: string;
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  location: string;
  urgency: 'Bassa' | 'Media' | 'Alta';
  status: 'Aperta' | 'In Lavorazione' | 'Chiusa';
  date: string;
  description: string;
}

export interface AIAction {
  intent: 'COMMAND' | 'QUERY' | 'DICTATION' | 'UNKNOWN';
  actionType?: 'CREATE_MAINTENANCE' | 'CHECK_PAGAMENTI' | 'SEND_MESSAGE' | 'GENERATE_MINUTES' | 'INFO_REQUEST';
  params?: any;
  speechResponse: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: 'Spese Generali' | 'Acqua' | 'Riscaldamento' | 'Manutenzione' | 'Amministrazione';
  status: 'Pagato' | 'In sospeso' | 'Scaduto';
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  category: 'Urgente' | 'Informativo' | 'Social' | 'Inutile';
  summary?: string;
}

export interface Assembly {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'Pianificata' | 'Conclusa';
  agenda: string[];
}

// Updated interface for Registry/Anagrafica
export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  fiscalCode: string; // New field added
  role: 'Proprietario' | 'Inquilino' | 'Comproprietario';
}

export interface Unit {
  id: string;
  internal: string;
  floor: string;
  millesimes: number;
  ownerId: string;
  tenantId?: string;
  type: 'Appartamento' | 'Box' | 'Cantina' | 'Negozio';
}

export interface Condominium {
  id: string;
  name: string;
  address: string;
  city: string;
  fiscalCode: string;
  totalUnits: number;
}
