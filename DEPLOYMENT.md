# 🚀 Guida Rapida Deployment Vercel

## Passi da seguire (5 minuti):

### 1️⃣ Vai su Vercel
Apri: https://vercel.com/new

### 2️⃣ Importa questo progetto
- Clicca "Import Git Repository"
- Seleziona il repository di questo progetto
- Vercel rileverà automaticamente Vite ✅

### 3️⃣ IMPORTANTE: Aggiungi la variabile d'ambiente
**Prima di cliccare Deploy**, vai su "Environment Variables" e aggiungi:

```
Nome:  VITE_GEMINI_API_KEY
Valore: [la tua chiave API di Google Gemini]
```

**Come ottenere la chiave API:**
1. Vai su: https://aistudio.google.com/apikey
2. Clicca "Create API Key"
3. Copia la chiave generata

**Dove inserirla su Vercel:**
- Nella sezione "Environment Variables"
- Seleziona tutti gli ambienti: Production, Preview, Development

### 4️⃣ Deploy!
- Clicca "Deploy"
- Attendi 1-2 minuti
- Il tuo sito sarà live su: `https://[nome-progetto].vercel.app`

---

## ✅ Checklist pre-deployment:

- [ ] File `.env` è nel `.gitignore` (già fatto ✅)
- [ ] File `.env.example` esiste come template (già fatto ✅)
- [ ] Build locale funziona: `npm run build` (già testato ✅)
- [ ] Hai la chiave API di Google Gemini
- [ ] Hai configurato `VITE_GEMINI_API_KEY` su Vercel

---

## 🔄 Aggiornamenti futuri:

Dopo il primo deployment, ogni volta che fai push su GitHub/GitLab:
1. Vercel farà automaticamente il build
2. Il sito si aggiornerà in 1-2 minuti
3. Zero downtime! 🎉

---

## 🆘 Problemi comuni:

**Pagina bianca dopo deployment?**
→ Controlla che `VITE_GEMINI_API_KEY` sia configurata su Vercel

**Errore di build?**
→ Guarda i logs su Vercel Dashboard → Deployments → [ultimo deployment] → View Function Logs

**Funzionalità AI non funzionano?**
→ Verifica che la chiave API sia valida su https://aistudio.google.com/apikey

---

## 📱 Dopo il deployment:

Il tuo gestionale sarà accessibile da:
- 💻 Desktop
- 📱 Tablet
- 🌐 Qualsiasi browser moderno

URL esempio: `https://domusa-condoai.vercel.app`

---

**Buon deployment! 🚀**
