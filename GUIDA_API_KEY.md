# 🔑 GUIDA COMPLETA: Creare la Google Gemini API Key

## 📍 Passo 1: Vai su Google AI Studio

**URL:** https://aistudio.google.com/apikey

Oppure cerca su Google: "Google AI Studio API Key"

---

## 🔐 Passo 2: Accedi con il tuo Account Google

- Usa il tuo account Google personale o di lavoro
- Se non hai un account Google, creane uno gratuitamente

---

## ➕ Passo 3: Clicca su "Crea chiave API"

Nella pagina "Chiavi API" vedrai:

1. **In alto a destra:** Pulsante blu **"Crea chiave API"** (o "Create API key")
2. **Tabella centrale:** Lista delle tue chiavi esistenti (se ne hai già create)

**👉 Clicca sul pulsante "Crea chiave API"**

---

## 🎯 Passo 4: Scegli il Progetto

Apparirà un popup con 2 opzioni:

### Opzione A: Crea in un nuovo progetto (CONSIGLIATO per iniziare)
- ✅ Seleziona: **"Crea chiave API in un nuovo progetto"**
- Google creerà automaticamente un progetto per te
- Nome automatico: "Generative Language Client"

### Opzione B: Usa un progetto esistente
- Se hai già un progetto Google Cloud, puoi selezionarlo
- Utile se vuoi organizzare meglio le tue risorse

**👉 Per semplicità, scegli "Crea in un nuovo progetto"**

---

## 🎉 Passo 5: Copia la Chiave API

Dopo aver cliccato "Crea":

1. **Apparirà la tua chiave API** - una stringa lunga tipo:
   ```
   AIzaSyD...........................xyz123
   ```

2. **IMPORTANTE:** Vedrai un'icona 📋 per copiare la chiave
   - **Clicca sull'icona di copia**
   - La chiave verrà copiata negli appunti

3. **⚠️ ATTENZIONE:**
   - Questa chiave ti verrà mostrata **UNA SOLA VOLTA**
   - Se la perdi, dovrai crearne una nuova
   - **Salvala subito nel file `.env`**

---

## 💾 Passo 6: Inserisci la Chiave nel Progetto

### Sul tuo computer:

1. **Apri il file `.env`** nella cartella del progetto:
   ```
   c:\Users\Max\Downloads\Condoai-main\Condoai-main\.env
   ```

2. **Sostituisci** `your-api-key-here` con la chiave che hai copiato:
   ```env
   VITE_GEMINI_API_KEY=AIzaSyD...........................xyz123
   ```

3. **Salva il file** (Ctrl+S)

### Su Vercel (per il deployment):

1. Vai su **Vercel Dashboard** → Il tuo progetto
2. Clicca su **Settings** → **Environment Variables**
3. Aggiungi:
   - **Nome:** `VITE_GEMINI_API_KEY`
   - **Valore:** La chiave che hai copiato
   - **Ambienti:** Seleziona tutti (Production, Preview, Development)
4. Clicca **Save**

---

## ✅ Passo 7: Verifica che Funzioni

### Test locale:

1. **Riavvia il server di sviluppo:**
   ```bash
   # Ferma il server (Ctrl+C nel terminale)
   # Poi riavvialo
   npm run dev
   ```

2. **Apri:** http://localhost:3000 (o 3001)

3. **Prova una funzionalità AI:**
   - Vai nella Dashboard
   - Clicca su "Analizza Dati Finanziari" nel pannello "Analisi AI"
   - Se funziona, vedrai una risposta generata dall'AI ✅

---

## 📊 Informazioni sulla Quota Gratuita

Google Gemini offre un **livello gratuito generoso**:

- ✅ **15 richieste al minuto** (RPM)
- ✅ **1 milione di token al giorno**
- ✅ **1.500 richieste al giorno**

**Questo è più che sufficiente per:**
- Sviluppo e test
- Piccole applicazioni
- Demo e prototipi

**Se superi la quota gratuita:**
- Puoi configurare la fatturazione su Google Cloud
- Pagherai solo per l'utilizzo extra
- Prezzi molto competitivi

---

## 🔒 Sicurezza della Chiave API

### ✅ FARE:
- ✅ Salvare la chiave nel file `.env`
- ✅ Aggiungere `.env` al `.gitignore` (già fatto ✅)
- ✅ Usare variabili d'ambiente su Vercel
- ✅ Rigenerare la chiave se pensi sia stata compromessa

### ❌ NON FARE:
- ❌ NON committare la chiave su Git
- ❌ NON condividere la chiave pubblicamente
- ❌ NON inserire la chiave direttamente nel codice
- ❌ NON pubblicare screenshot con la chiave visibile

---

## 🆘 Problemi Comuni

### "Invalid API Key"
**Soluzione:**
- Verifica di aver copiato la chiave completa
- Controlla che non ci siano spazi prima/dopo
- Assicurati che il nome della variabile sia esatto: `VITE_GEMINI_API_KEY`

### "Quota exceeded"
**Soluzione:**
- Aspetta qualche minuto (la quota si resetta)
- Controlla l'utilizzo su: https://aistudio.google.com/usage
- Se necessario, configura la fatturazione

### "API Key not found"
**Soluzione:**
- Riavvia il server di sviluppo
- Verifica che il file `.env` sia nella root del progetto
- Controlla che non ci siano errori di battitura

---

## 📱 Link Utili

- **Crea API Key:** https://aistudio.google.com/apikey
- **Dashboard Utilizzo:** https://aistudio.google.com/usage
- **Documentazione:** https://ai.google.dev/docs
- **Prezzi:** https://ai.google.dev/pricing

---

## 🎯 Riepilogo Veloce

1. Vai su https://aistudio.google.com/apikey
2. Accedi con Google
3. Clicca "Crea chiave API"
4. Scegli "Crea in un nuovo progetto"
5. Copia la chiave (icona 📋)
6. Incolla nel file `.env`:
   ```
   VITE_GEMINI_API_KEY=la-tua-chiave-qui
   ```
7. Salva e riavvia il server
8. Testa l'AI! 🎉

---

**Tempo richiesto:** 2-3 minuti
**Costo:** Gratuito (con quota generosa)
**Difficoltà:** Facile ⭐

**Buona creazione! 🚀**
