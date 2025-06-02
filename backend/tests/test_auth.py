import pytest
from app import create_app, db
from models import User
import json
from werkzeug.security import generate_password_hash

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@db:5432/esme_db_test'
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

def test_register_success(client):
    # Données de test
    user_data = {
        'email': 'test@example.com',
        'password': 'password123',
        'role': 'professor',
        'first_name': 'John',
        'last_name': 'Doe'
    }
    
    # Test de l'inscription
    response = client.post('/api/auth/register',
                          data=json.dumps(user_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    assert b'Utilisateur cr' in response.data

def test_register_duplicate_email(client):
    # Créer un utilisateur
    user = User(
        email='test@example.com',
        password='password123',
        role='professor',
        first_name='John',
        last_name='Doe'
    )
    db.session.add(user)
    db.session.commit()
    
    # Tenter de créer un utilisateur avec le même email
    user_data = {
        'email': 'test@example.com',
        'password': 'password123',
        'role': 'student',
        'first_name': 'Jane',
        'last_name': 'Doe'
    }
    
    response = client.post('/api/auth/register',
                          data=json.dumps(user_data),
                          content_type='application/json')
    
    assert response.status_code == 400
    assert b'Email d' in response.data

def test_login_success(client):
    # Créer un utilisateur avec le mot de passe hashé
    user = User(
        email='test@example.com',
        password=generate_password_hash('password123'),  # Hash le mot de passe
        role='professor',
        first_name='John',
        last_name='Doe'
    )
    db.session.add(user)
    db.session.commit()
    
    # Test de la connexion
    login_data = {
        'email': 'test@example.com',
        'password': 'password123'
    }
    
    response = client.post('/api/auth/login',
                          data=json.dumps(login_data),
                          content_type='application/json')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'access_token' in data
    assert data['user']['email'] == 'test@example.com'

def test_login_wrong_password(client):
    # Créer un utilisateur
    user = User(
        email='test@example.com',
        password='password123',
        role='professor',
        first_name='John',
        last_name='Doe'
    )
    db.session.add(user)
    db.session.commit()
    
    # Test de la connexion avec mauvais mot de passe
    login_data = {
        'email': 'test@example.com',
        'password': 'wrongpassword'
    }
    
    response = client.post('/api/auth/login',
                          data=json.dumps(login_data),
                          content_type='application/json')
    
    assert response.status_code == 401
    assert b'Email ou mot de passe incorrect' in response.data

def test_get_current_user(client):
    # Créer un utilisateur avec le mot de passe hashé
    user = User(
        email='test@example.com',
        password=generate_password_hash('password123'),
        role='professor',
        first_name='John',
        last_name='Doe'
    )
    db.session.add(user)
    db.session.commit()

    # Se connecter pour obtenir un token
    login_data = {
        'email': 'test@example.com',
        'password': 'password123'
    }

    login_response = client.post('/api/auth/login',
                               data=json.dumps(login_data),
                               content_type='application/json')
    
    print("\nRéponse du login:", login_response.data.decode())
    
    token = json.loads(login_response.data)['access_token']
    print("\nToken généré:", token)

    # Test de la route /me
    response = client.get('/api/auth/me',
                         headers={
                             'Authorization': f'Bearer {token}',
                             'Content-Type': 'application/json'
                         })
    
    print("\nRéponse de /me:", response.data.decode())

    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['email'] == 'test@example.com'
    assert data['role'] == 'professor'
