# 🚀 Comandi Git per Deploy

## Se hai già un repository Git configurato:

```bash
# 1. Aggiungi tutti i file modificati
git add .

# 2. Commit con messaggio descrittivo
git commit -m "feat: prepare for Vercel deployment with environment variables"

# 3. Push al repository
git push origin main
```

## Se NON hai ancora un repository Git:

```bash
# 1. Inizializza repository
git init

# 2. Aggiungi tutti i file
git add .

# 3. Primo commit
git commit -m "feat: initial commit - DomusA ready for Vercel"

# 4. Crea repository su GitHub/GitLab/Bitbucket
# Poi collega il repository remoto:
git remote add origin https://github.com/TUO-USERNAME/TUO-REPO.git

# 5. Push
git branch -M main
git push -u origin main
```

## Verifica prima del push:

```bash
# Controlla lo status
git status

# Verifica che .env NON sia nella lista (deve essere ignorato)
# Se vedi .env nella lista, FERMATI e controlla .gitignore

# Vedi cosa verrà committato
git diff --cached
```

## ⚠️ IMPORTANTE: Verifica Sicurezza

Prima di fare push, assicurati che:
- [ ] `.env` NON è nella lista dei file da committare
- [ ] `.env.example` SÌ è nella lista (è safe, non contiene chiavi reali)
- [ ] `.gitignore` contiene `.env`

Se vedi `.env` in `git status`, esegui:
```bash
git rm --cached .env
git commit -m "fix: remove .env from git tracking"
```

## Dopo il push:

1. Vai su https://vercel.com/new
2. Importa il repository
3. Aggiungi `VITE_GEMINI_API_KEY` nelle Environment Variables
4. Deploy! 🎉

---

**Pronto per il push? Esegui i comandi sopra! 🚀**
