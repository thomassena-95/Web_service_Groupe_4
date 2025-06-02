import os
from datetime import timedelta

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://myuser:mot_de_passe@db:5432/esme_inge')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'clé_test_unique_et_simple'  # Une seule clé pour tous les environnements
    JWT_ACCESS_TOKEN_EXPIRES = False  # Désactive l'expiration pour les tests
    JWT_CSRF_CHECK_FORM = False
    JWT_CSRF_IN_COOKIES = False
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_CSRF_METHODS = []
