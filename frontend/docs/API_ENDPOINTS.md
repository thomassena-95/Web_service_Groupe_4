# Documentation des Endpoints API

## Authentification (`/api/auth`)
### POST /api/auth/register
- **Description**: Inscription d'un nouvel utilisateur
- **Body**: 
  ```json
  {
    "email": "string",
    "password": "string",
    "role": "professor" | "student",
    "first_name": "string",
    "last_name": "string"
  }
  ```
- **Réponse**: `201 Created`
- **Auth**: Non requis

### POST /api/auth/login
- **Description**: Connexion d'un utilisateur
- **Body**: 
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Réponse**: `200 OK` avec token JWT
- **Auth**: Non requis

### GET /api/auth/me
- **Description**: Récupérer les informations de l'utilisateur connecté
- **Réponse**: `200 OK` avec données utilisateur
- **Auth**: Requis

## Classes (`/api/classrooms`)
### GET /api/classrooms
- **Description**: Liste des classes du professeur
- **Réponse**: `200 OK` avec liste des classes
- **Auth**: Requis (Professeur)

### POST /api/classrooms
- **Description**: Créer une nouvelle classe
- **Body**: 
  ```json
  {
    "name": "string"
  }
  ```
- **Réponse**: `201 Created`
- **Auth**: Requis (Professeur)

### GET /api/classrooms/:id
- **Description**: Détails d'une classe spécifique
- **Réponse**: `200 OK`
- **Auth**: Requis (Professeur)

### PUT /api/classrooms/:id
- **Description**: Mettre à jour une classe
- **Body**: 
  ```json
  {
    "name": "string"
  }
  ```
- **Réponse**: `200 OK`
- **Auth**: Requis (Professeur)

### DELETE /api/classrooms/:id
- **Description**: Supprimer une classe
- **Réponse**: `200 OK`
- **Auth**: Requis (Professeur)

## Livres (`/api/books`)
### GET /api/books
- **Description**: Liste de tous les livres
- **Réponse**: `200 OK`
- **Auth**: Non requis

### GET /api/books/:id
- **Description**: Détails d'un livre spécifique
- **Réponse**: `200 OK`
- **Auth**: Requis

### POST /api/books
- **Description**: Ajouter un nouveau livre
- **Body**: 
  ```json
  {
    "title": "string",
    "author": "string",
    "published_at": "YYYY-MM-DD"
  }
  ```
- **Réponse**: `201 Created`
- **Auth**: Non requis

### PUT /api/books/:id
- **Description**: Mettre à jour un livre
- **Body**: 
  ```json
  {
    "title": "string",
    "author": "string",
    "published_at": "YYYY-MM-DD"
  }
  ```
- **Réponse**: `200 OK`
- **Auth**: Requis

### DELETE /api/books/:id
- **Description**: Supprimer un livre
- **Réponse**: `200 OK`
- **Auth**: Requis

## Devoirs (`/api/assignments`)
### POST /api/assignments
- **Description**: Créer un nouveau devoir
- **Body**: 
  ```json
  {
    "book_id": "integer",
    "classroom_id": "integer"
  }
  ```
- **Réponse**: `201 Created`
- **Auth**: Requis (Professeur)

### GET /api/assignments
- **Description**: Liste des devoirs (différente selon le rôle)
- **Réponse**: `200 OK`
- **Auth**: Requis

### GET /api/assignments/:id
- **Description**: Détails d'un devoir spécifique
- **Réponse**: `200 OK`
- **Auth**: Requis

## Lectures Étudiants (`/api/student-readings`)
### POST /api/student-readings
- **Description**: Soumettre un résumé
- **Body**: 
  ```json
  {
    "assignment_id": "integer",
    "summary": "string"
  }
  ```
- **Réponse**: `201 Created`
- **Auth**: Requis (Étudiant)

### GET /api/student-readings/me
- **Description**: Liste des résumés de l'étudiant
- **Réponse**: `200 OK`
- **Auth**: Requis (Étudiant)

### PUT /api/student-readings/:id/validate
- **Description**: Valider un résumé
- **Body**: 
  ```json
  {
    "status": "valide" | "refuse"
  }
  ```
- **Réponse**: `200 OK`
- **Auth**: Requis (Professeur)

## Codes d'erreur communs
- `400 Bad Request`: Données invalides
- `401 Unauthorized`: Non authentifié
- `403 Forbidden`: Non autorisé
- `404 Not Found`: Ressource non trouvée
- `422 Unprocessable Entity`: Erreur de validation
