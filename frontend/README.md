# 📱 Frontend - Plateforme de Gestion de Lectures

## 📋 Description
Interface utilisateur React pour la plateforme de gestion de lectures. Développée avec React, Vite, et Material-UI.

## 🛠️ Technologies utilisées
- React 18
- Vite
- Material-UI (MUI)
- React Router
- Axios
- React Context (pour la gestion d'état)
- JWT pour l'authentification

## ⚡ Installation

### Prérequis
- Node.js (v16 ou supérieur)
- npm ou yarn

### Installation des dépendances
```bash
cd frontend
npm install
```

### Variables d'environnement
Créer un fichier `.env` à la racine du frontend :
```env
VITE_API_URL=http://localhost:5009
```

## 🚀 Développement

### Lancer en mode développement
```bash
npm run dev
```
L'application sera accessible sur http://localhost:3000

### Build pour production
```bash
npm run build
```

### Tests
```bash
npm test
```

## 📁 Structure du projet

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## 🎯 Fonctionnalités principales

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

## 🔒 Authentification
- JWT pour la gestion des sessions
- Routes protégées
- Gestion des rôles (professeur/élève)

## 🎨 UI/UX
- Material-UI pour le design
- Thème personnalisé
- Responsive design
- Animations fluides

## 📱 Responsive Design
- Mobile-first approach
- Breakpoints Material-UI
- Adaptations spécifiques pour mobile

## 🧪 Tests
- Tests unitaires avec Jest
- Tests de composants avec React Testing Library
- Tests d'intégration

## 🚀 Déploiement
```bash
# Build pour production
npm run build

# Vérifier le build
npm run preview
```

## 📊 Performance
- Code splitting
- Lazy loading des composants
- Optimisation des images
- Caching des requêtes API

## 🐛 Débogage
- React Developer Tools
- Console de développement
- Logs d'erreur détaillés

## 🎯 Bonnes pratiques
- ESLint pour le linting
- Prettier pour le formatage
- Git hooks pour la qualité du code
- Documentation des composants

## 🔄 Workflow de développement
1. Créer une branche pour une nouvelle fonctionnalité
2. Développer et tester
3. Créer une pull request
4. Code review
5. Merge dans main

## 🚫 Problèmes courants
| Problème | Solution |
|----------|----------|
| Erreur CORS | Vérifier la configuration du backend |
| Erreur d'authentification | Vérifier le token JWT |
| Problème de build | Nettoyer le cache npm |

## 📚 Documentation
- [Material-UI](https://mui.com/)
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)
