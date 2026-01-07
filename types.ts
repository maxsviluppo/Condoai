

export enum AppSection {
  DASHBOARD = 'DASHBOARD',
  CONDOMINIUMS = 'CONDOMINIUMS', // Condomini (configurazioni)
  UNITS = 'UNITS', // Unità (separate)
  EXPENSES = 'EXPENSES', // Uscite
  INCOME = 'INCOME', // Entrate
  BUDGET = 'BUDGET', // Bilancio Consuntivo
  ASSEMBLIES = 'ASSEMBLIES', // Assemblee
  COMMUNICATIONS = 'COMMUNICATIONS', // Comunicazioni
  REPORTS = 'REPORTS', // Segnalazioni
  SUPPLIERS = 'SUPPLIERS', // Fornitori
  DOCUMENTS = 'DOCUMENTS', // Documenti
  AI_ASSISTANT = 'AI_ASSISTANT', // Assistente AI

  // Legacy - manteniamo per compatibilità
  ACCOUNTING = 'ACCOUNTING',
  RESIDENTS = 'RESIDENTS',
  MAINTENANCE = 'MAINTENANCE',
  EMERGENCY = 'EMERGENCY',
  ANALYTICS = 'ANALYTICS',
  LEGAL = 'LEGAL'
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

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  pec?: string;
  phone: string;
  fiscalCode: string;
  residenceAddress?: string;
  role: 'Proprietario' | 'Inquilino' | 'Comproprietario';
}

export interface Unit {
  id: string;
  condoId: string; // Collegamento obbligatorio al condominio
  internal: string; // Numero Interno (es. 1, A1, Int.5)
  staircase?: string; // Scala (es. A, B, 1)
  floor: string; // Piano
  subalterno?: string; // Riferimento catastale
  type: 'Appartamento' | 'Box' | 'Cantina' | 'Negozio';
  surface?: number; // Superficie in mq
  monthlyFee?: number; // Quota Mensile Ordinaria (€)
  millesimals: Record<string, number>; // Tabella -> valore millesimale
  ownerId: string; // ID del proprietario
  tenantId?: string; // ID dell'inquilino (opzionale)
  isRented?: boolean; // Flag per indicare se è affittato
}

export interface MillesimalTable {
  id: string;
  name: string; // es. "Tabella A - Spese Generali", "Tabella B - Riscaldamento"
  values: Record<string, number>; // unitId -> valore millesimale
}

export interface Condominium {
  id: string;

  // Dati Anagrafici
  name: string;
  street: string;
  streetNumber: string;
  cap: string;
  city: string;
  province: string;
  fiscalCode: string;

  // Dati Strutturali
  constructionYear?: number; // Anno Costruzione
  numberOfFloors?: number; // Numero Piani
  numberOfStaircases?: number; // Numero Scale
  numberOfUnits: number; // Numero Interni (totalUnits rinominato)

  // Dati Finanziari
  monthlyFee?: number; // Quota Mensile Ordinaria (€)

  // Multimedia
  imageUrl?: string; // URL Immagine

  // Servizi
  hasElevator?: boolean; // Ascensore
  hasCentralHeating?: boolean; // Risc. Centrale
  hasGarden?: boolean; // Giardino
  hasParking?: boolean; // Parcheggio

  // Tabelle Millesimali
  millesimalTables?: MillesimalTable[]; // Array di tabelle millesimali

  // Note
  notes?: string; // Note libere

  // Legacy/Compatibilità
  cadastralData?: string;
  totalUnits: number; // Manteniamo per compatibilità, uguale a numberOfUnits
}
