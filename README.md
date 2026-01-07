# DomusA - Gestionale Condominiale Intelligente

Applicazione web moderna per la gestione intelligente di condomini, con integrazione AI tramite Google Gemini.

## 🚀 Deployment su Vercel

### Prerequisiti
1. Account Vercel (gratuito su [vercel.com](https://vercel.com))
2. Chiave API Google Gemini da [Google AI Studio](https://aistudio.google.com/apikey)

### Passi per il deployment

#### 1. Preparazione del repository
```bash
# Assicurati che tutti i file siano committati
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

#### 2. Importa il progetto su Vercel
1. Vai su [vercel.com](https://vercel.com) e fai login
2. Clicca su "Add New Project"
3. Importa il repository GitHub/GitLab/Bitbucket
4. Vercel rileverà automaticamente che è un progetto Vite

#### 3. Configura le variabili d'ambiente
**IMPORTANTE:** Prima del deployment, aggiungi questa variabile d'ambiente:

- **Nome:** `VITE_GEMINI_API_KEY`
- **Valore:** La tua chiave API di Google Gemini

**Come aggiungere la variabile:**
1. Nel pannello di configurazione del progetto su Vercel
2. Vai su "Environment Variables"
3. Aggiungi `VITE_GEMINI_API_KEY` con il valore della tua chiave API
4. Seleziona tutti gli ambienti (Production, Preview, Development)

#### 4. Deploy
1. Clicca su "Deploy"
2. Attendi che Vercel completi il build (circa 1-2 minuti)
3. Il tuo sito sarà disponibile su `https://your-project-name.vercel.app`

## 🛠️ Sviluppo Locale

### Installazione
```bash
npm install
```

### Configurazione
1. Copia il file `.env.example` in `.env`:
   ```bash
   cp .env.example .env
   ```

2. Modifica `.env` e inserisci la tua chiave API:
   ```
   VITE_GEMINI_API_KEY=la-tua-chiave-api-qui
   ```

### Avvio del server di sviluppo
```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:3000` (o altra porta se 3000 è occupata).

### Build di produzione
```bash
npm run build
npm run preview
```

## 📋 Funzionalità

- **Dashboard:** Panoramica completa di tutti i condomini
- **Anagrafica & Unità:** Gestione condomini, proprietari e unità immobiliari
- **Contabilità:** Gestione finanziaria e bilanci
- **Archivio AI:** Documenti intelligenti con analisi AI
- **Manutenzioni:** Tracciamento richieste di manutenzione
- **Emergenze:** Hub per la gestione delle emergenze
- **Analisi AI:** Insights finanziari e predittivi powered by Google Gemini

## 🔒 Sicurezza

- ✅ Il file `.env` è escluso dal repository (vedi `.gitignore`)
- ✅ Le chiavi API sono gestite tramite variabili d'ambiente
- ✅ Usa sempre `.env.example` come template (senza valori reali)

## 🆘 Troubleshooting

### Pagina bianca dopo il deployment
- Verifica che `VITE_GEMINI_API_KEY` sia configurata correttamente su Vercel
- Controlla i logs di build su Vercel per eventuali errori
- Assicurati che il build sia completato con successo

### Errori di build
- Verifica che tutte le dipendenze siano installate: `npm install`
- Controlla che non ci siano errori TypeScript: `npm run build`

## 📝 Licenza

Progetto privato - Tutti i diritti riservati

## 👨‍💻 Supporto

Per assistenza, contatta il team di sviluppo.
