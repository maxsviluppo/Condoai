

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
  type: 'Entrata' | 'Uscita';
  amount: number;
  date: string;
  description: string;
  category: string;
}

export interface Message {
  id: string;
  sender: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

export interface Assembly {
  id: string;
  date: string;
  type: 'Ordinaria' | 'Straordinaria';
  status: 'Programmata' | 'Completata';
  topics: string[];
  attendees?: number;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  pec?: string;
  phone?: string;
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
  tenantInfo?: { // Dati inquilino per uso amministratore (se non in anagrafica)
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
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

// Fornitore
export interface Supplier {
  id: string;
  companyName: string; // Ragione Sociale
  category: 'Idraulico' | 'Elettricista' | 'Pulizie' | 'Manutenzione' | 'Amministrazione' | 'Assicurazioni' | 'Altro';
  contactPerson?: string; // Referente
  phone?: string;
  email?: string;
  vatNumber?: string; // P. IVA
}

// Spesa/Uscita
export interface Expense {
  id: string;
  condoId: string; // Condominio di riferimento
  type: 'Uscita'; // Sempre "Uscita" per questo tipo

  // Importi
  netAmount: number; // Netto Pagato
  accessoryExpenses: number; // Spese Accessorie
  withholdingTax: number; // Ritenute d'Acconto
  totalAmount: number; // Totale Spesa (calcolato automaticamente)

  // Dettagli
  date: string; // Data
  category: 'Manutenzione Ordinaria' | 'Manutenzione Straordinaria' | 'Pulizia' | 'Energia Elettrica' | 'Riscaldamento' | 'Acqua' | 'Amministrazione' | 'Assicurazioni' | 'Altro';
  paymentMethod: 'Bonifico' | 'Assegno' | 'Contanti' | 'Carta' | 'RID' | 'Altro';
  supplierId: string; // ID Fornitore

  // Ripartizione Millesimale
  millesimalDistribution: Record<string, number>; // Tabella -> percentuale (deve sommare 100%)

  // Fattura
  invoiceNumber?: string;
  isPaid: boolean; // Già pagato

  // Note
  description?: string;
}

// Pagamento Quota Condominiale
export interface Payment {
  id: string;
  unitId: string; // ID Unità Immobiliare
  condoId: string; // ID Condominio
  year: number; // Anno
  month: number; // Mese (1-12)

  // Importi
  expectedAmount: number; // Quota mensile prevista
  paidAmount: number; // Importo pagato

  // Stato
  status: 'unpaid' | 'partial' | 'paid'; // Non pagato, Acconto, Pagato

  // Dettagli
  paymentDate?: string; // Data pagamento
  paymentMethod?: 'Bonifico' | 'Assegno' | 'Contanti' | 'Carta' | 'RID' | 'Altro';
  notes?: string;
}
