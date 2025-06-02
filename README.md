# 📚 Plateforme de Gestion de Lectures

## 📋 Description
Application web permettant aux professeurs de gérer les lectures assignées aux élèves et aux élèves de soumettre leurs résumés. Développée avec Flask et React.

## ⚡ Prérequis

* [Docker Desktop](https://www.docker.com/products/docker-desktop)
* Git
* Make
  * Windows : `choco install make`
  * MacOS : `xcode-select --install`
  * Linux : `sudo apt install make`

Vérification des installations :
```bash
docker --version
docker-compose --version
git --version
make --version
```

## 🔄 Installation et exécution

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd <nom-du-dossier>
```

### 2. Lancer l'application
```bash
make docker-build
```
ou
```bash
docker-compose up --build
```

### 3. Accéder à l'application
* Frontend : [http://localhost:3000](http://localhost:3000)
* Backend API : [http://localhost:5009](http://localhost:5009)
* Base de données PostgreSQL :
  * Hôte : `localhost`
  * Port : `5432`
  * Utilisateur : `myuser`
  * Mot de passe : `mot_de_passe`
  * Base : `esme_inge`

## 🎯 Fonctionnalités

### Interface Professeur
- Dashboard avec statistiques
- Gestion des classes
- Attribution des lectures
- Validation des résumés

### Interface Élève
- Liste des lectures assignées
- Soumission de résumés
- Historique des résumés
- Dashboard personnel

## 🛠️ Commandes utiles

```bash
make docker-build   # Build et démarre tous les services
make docker-up      # Démarre sans rebuild
make docker-down    # Stoppe et supprime les conteneurs
make db-init        # Init migrations (une seule fois)
make db-migrate     # Crée une nouvelle migration
make db-upgrade     # Applique les migrations
make db-reset       # Supprime + recrée la base
```

## 📊 Structure du projet

```
full-app/
├── backend/         # Application Flask + DB migrations
├── frontend/        # Application React (Vite)
├── docker-compose.yml
├── Makefile         # Commandes utiles pour dev
└── README.md
```

---

## 🚀 Commandes utiles (via `make`)

```bash
make docker-build   # Build et démarre tous les services
make docker-up      # Démarre sans rebuild
make docker-down    # Stoppe et supprime les conteneurs
make db-init        # Init migrations (une seule fois)
make db-migrate     # Crée une nouvelle migration
make db-upgrade     # Applique les migrations
make db-reset       # Supprime + recrée la base
```

---

## 🛠️ Conseils pour développement

* Codez dans `backend/` et `frontend/`
* Toute modification est automatiquement prise en compte au redémarrage des conteneurs
* Si erreur base de données : vérifiez les migrations (`make db-upgrade`)

---

## 📊 Problèmes courants

| Problème                           | Solution                                                                                   |
| ---------------------------------- | ------------------------------------------------------------------------------------------ |
| Frontend affiche 404 sur une route | NGINX est configuré pour rediriger vers `index.html`. Assurez-vous que le build est bon.   |
| Erreur de connexion DB             | Vérifiez si la base est bien démarrée (`docker ps`) et que les migrations sont appliquées. |
| Port déjà utilisé                  | Modifiez les ports dans `docker-compose.yml`.                                              |

---

## 🚫 Ce que vous ne devez pas modifier

* Ne changez pas le `docker-compose.yml` sauf si vous comprenez bien les impacts.
* Ne modifiez pas le `Dockerfile` sans refaire les builds.

---

## 📅 Prochaines étapes

1. Définissez les routes de votre API Flask
2. Construisez votre UI React
3. Ajoutez vos tables et migrations si besoin
4. Gérez l'authentification si nécessaire

Bon développement ! 🚀

## 🗃️ Structure de la base de données
[Insérer le diagramme de la base de données]

## 📝 Documentation API
[Insérer la documentation de l'API]

## 🧪 Tests
```bash
# Backend
cd backend
python -m pytest

# Frontend
cd frontend
npm test
```

## 🛠️ Auteur
[Votre nom]

## 📄 Licence
[Insérer la licence]

## 🚀 Installation rapide

```bash
# Cloner le repository
git clone [URL_DU_REPO]

# Lancer l'application
docker-compose up --build
```

## 🔑 Comptes de test

### Professeur
- Email: prof@test.com
- Mot de passe: prof123
- Classe: "Classe Test"

### Élève
- Email: eleve@test.com
- Mot de passe: eleve123
- Livre assigné: "Le Petit Prince"

## 📡 Endpoints principaux

### Authentification
```http
POST /auth/login
POST /auth/register
GET /auth/me
```

### Classes
```http
GET /classrooms
POST /classrooms
GET /classrooms/<id>
```

### Lectures
```http
GET /readings
POST /readings
GET /readings/<id>
```

### Résumés
```http
GET /summaries
POST /summaries
GET /summaries/<id>
PUT /summaries/<id>
```

## 📊 Exemple de workflow

1. **Élève**
   - Se connecte
   - Consulte les lectures assignées
   - Soumet un résumé

2. **Professeur**
   - Se connecte
   - Consulte les résumés soumis
   - Valide ou refuse les résumés

## 🛠️ Technologies utilisées
- Backend: Flask, PostgreSQL
- Frontend: React, Material-UI
- Docker pour le déploiement