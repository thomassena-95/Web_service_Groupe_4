# Documentation Frontend

## Structure de la Documentation

### API Documentation
- `API_ENDPOINTS.md` : Documentation complète de tous les endpoints disponibles dans l'API backend
  - Liste tous les endpoints avec leurs méthodes HTTP
  - Détaille les paramètres requis et les réponses
  - Indique les permissions nécessaires
  - Fournit des exemples de requêtes et réponses

### Configuration API
- `src/api/endpoints.js` : Configuration des URLs des endpoints
  - Centralise toutes les URLs de l'API
  - Facilite la maintenance et les modifications
  - Permet l'autocomplétion dans l'IDE

## Comment Utiliser

### Pour les Développeurs
1. Consultez `API_ENDPOINTS.md` pour comprendre les endpoints disponibles
2. Utilisez les constantes de `endpoints.js` dans vos services API
3. Exemple d'utilisation :
   ```javascript
   import { ENDPOINTS } from '../api/endpoints';
   
   // Dans un service API
   const response = await axios.post(ENDPOINTS.AUTH.LOGIN, {
     email: 'user@example.com',
     password: 'password123'
   });
   ```

### Bonnes Pratiques
1. Toujours utiliser les constantes de `endpoints.js` plutôt que des URLs en dur
2. Maintenir la documentation à jour lors des modifications de l'API
3. Vérifier les permissions requises avant d'appeler un endpoint
4. Gérer les erreurs selon les codes d'erreur documentés

## Maintenance
- Mettre à jour `API_ENDPOINTS.md` lors de l'ajout/modification d'endpoints
- Synchroniser les modifications entre la documentation et `endpoints.js`
- Vérifier la cohérence des URLs entre le frontend et le backend

## Ressources
- [Documentation Axios](https://axios-http.com/docs/intro)
- [Documentation React Router](https://reactrouter.com/docs/en/v6)
- [Documentation JWT](https://jwt.io/introduction)
