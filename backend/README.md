# 🚀 Backend - Plateforme de Gestion de Lectures

## 📋 Description
API REST développée avec Flask pour la gestion des lectures, des classes et des résumés d'élèves. Utilise PostgreSQL comme base de données et JWT pour l'authentification.

## 🛠️ Technologies utilisées
- **Flask** : Framework web Python
- **SQLAlchemy** : ORM pour la gestion de la base de données
- **PostgreSQL** : Base de données relationnelle
- **JWT** : Authentification et autorisation
- **Alembic** : Gestion des migrations
- **Docker** : Conteneurisation
- **Pytest** : Tests unitaires

## 📌 Prérequis

### Outils recommandés
- [Postman](https://www.postman.com/downloads/) pour tester l'API
- [DBeaver](https://dbeaver.io/download/) pour la base de données
- [Python](https://www.python.org/downloads/) (v3.8+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## 🚀 Installation & Exécution

### 🏗️ Installation

#### 1️⃣ Cloner le projet
```bash
git clone <url-du-repo>
cd backend
```

#### 2️⃣ Configuration de l'environnement
Créer un fichier `.env` :
```env
FLASK_APP=app
FLASK_ENV=development
DATABASE_URL=postgresql://myuser:mot_de_passe@db:5432/esme_inge
JWT_SECRET_KEY=votre_clé_secrète
```

#### 3. Installation des dépendances
```bash
pip install -r requirements.txt
```

### 🏗️ Installation avec Docker

#### 1️⃣ Construire et démarrer l'application avec Docker
```bash
make docker-build
```

L'API sera accessible sur [http://localhost:5009](http://localhost:5009).

> **Note :** Si vous souhaitez uniquement démarrer l'application sans reconstruire l'image Docker :
> ```bash
> make docker-up
> ```

### 🐳 Pour arrêter l'application
```bash
make docker-down
```

> 📦 **Persistance des données** : Les données PostgreSQL sont stockées dans un volume Docker nommé `postgres_data`. Elles sont donc conservées même après l'arrêt ou la suppression du conteneur.
> 
> De plus, les fichiers de migration Alembic sont synchronisés avec le dossier local `./migrations/`, ce qui permet de conserver l'historique des migrations et de les versionner dans Git.

## 📚 Structure du projet

## �� API Endpoints

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
PUT /classrooms/<id>
DELETE /classrooms/<id>
```

### Lectures
```http
GET /readings
POST /readings
GET /readings/<id>
PUT /readings/<id>
DELETE /readings/<id>
```

### Résumés
```http
GET /summaries
POST /summaries
GET /summaries/<id>
PUT /summaries/<id>
```

## 🗃️ Modèles de données
```python
# User
class User:
    id: int
    email: str
    role: str  # 'professor' ou 'student'
    # ...

# Classroom
class Classroom:
    id: int
    name: str
    professor_id: int
    # ...

# ReadingAssignment
class ReadingAssignment:
    id: int
    book_id: int
    classroom_id: int
    # ...

# StudentReading
class StudentReading:
    id: int
    user_id: int
    assignment_id: int
    summary: str
    status: str
    # ...
```

## 🧪 Tests
```bash
# Lancer tous les tests
pytest

# Tests spécifiques
pytest tests/test_auth.py
pytest tests/test_classrooms.py
```

## 🛠️ Commandes utiles

| Commande | Description |
|----------|-------------|
| `make docker-build` | Build et démarre les conteneurs |
| `make docker-up` | Démarre les conteneurs existants |
| `make docker-down` | Arrête les conteneurs |
| `make db-init` | Initialise la base de données |
| `make db-migrate` | Crée une migration |
| `make db-upgrade` | Applique les migrations |
| `make db-reset` | Réinitialise la base |

## 🔒 Sécurité
- Authentification JWT
- Hachage des mots de passe
- Protection CORS
- Validation des données
- Gestion des rôles

## 📊 Base de données
- PostgreSQL
- Migrations avec Alembic
- Relations bidirectionnelles
- Contraintes d'intégrité

## 🐛 Débogage
- Logs détaillés
- Mode debug Flask
- Tests unitaires
- Validation des données

## 📝 Documentation
- Docstrings Python
- Documentation API
- Exemples de requêtes
- Schémas de données

## 🚫 Problèmes courants
| Problème | Solution |
|----------|----------|
| Erreur de connexion DB | Vérifier les variables d'environnement |
| Erreur CORS | Configurer les origines autorisées |
| Erreur de migration | Vérifier l'état de la base |

## 🔄 Workflow de développement
1. Créer une branche
2. Développer et tester
3. Créer une migration si nécessaire
4. Pull request
5. Code review
6. Merge

## 📈 Performance
- Optimisation des requêtes
- Indexation de la base
- Mise en cache
- Pagination des résultats

## ❗ Conseils supplémentaires pour les utilisateurs Windows

- Si la commande `make` n'est pas reconnue, ajoutez manuellement le dossier contenant `make.exe` à votre variable d'environnement `PATH`.
- Il est recommandé d'utiliser Git Bash, PowerShell ou WSL pour éviter les problèmes liés aux chemins ou à l'encodage des commandes dans le terminal.
- En cas d'erreur lors de l'exécution des commandes Makefile, vérifiez que Docker est bien lancé et que les conteneurs sont en cours d'exécution (`make docker-up`).
