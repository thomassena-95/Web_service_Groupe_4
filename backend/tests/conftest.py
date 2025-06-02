import pytest
from app import create_app, db
from config import Config
import os
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager

# Charger les variables d'environnement depuis .env
load_dotenv()

@pytest.fixture(scope='session')
def app():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def app_context(app):
    with app.app_context():
        yield

# Ajoutons des logs pour le débogage
@pytest.fixture(autouse=True)
def setup_logging(caplog):
    caplog.set_level("DEBUG")
