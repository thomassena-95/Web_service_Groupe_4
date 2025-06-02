import pytest
import json
from models import db, User, Classroom
from werkzeug.security import generate_password_hash

def test_create_classroom(client, caplog):
    caplog.set_level("DEBUG")
    print("\nDébut du test create_classroom")
    
    # Créer un professeur
    professor = User(
        email='prof@test.com',
        password=generate_password_hash('password123'),
        role='professor',
        first_name='John',
        last_name='Doe'
    )
    print("Professeur créé:", professor.email)
    
    try:
        db.session.add(professor)
        db.session.commit()
        print("Professeur ajouté à la base de données")
    except Exception as e:
        print("Erreur lors de l'ajout du professeur:", str(e))
        raise

    # Se connecter en tant que professeur
    login_data = {
        'email': 'prof@test.com',
        'password': 'password123'
    }
    print("Tentative de connexion avec:", login_data)
    
    login_response = client.post('/api/auth/login',
                               json=login_data,
                               content_type='application/json')
    print("Réponse de connexion:", login_response.data.decode())
    
    token = json.loads(login_response.data)['access_token']
    print("Token obtenu:", token)

    # Créer une classe
    classroom_data = {
        'name': 'Classe Test'
    }
    print("Création de classe avec:", classroom_data)
    
    response = client.post('/api/classrooms',
                          json=classroom_data,
                          headers={
                              'Authorization': f'Bearer {token}'
                          })
    print("Réponse de création de classe:", response.data.decode())
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert 'classroom' in data
    assert data['classroom']['name'] == 'Classe Test'

def test_get_classrooms(client):
    # Créer un professeur
    professor = User(
        email='prof2@test.com',
        password=generate_password_hash('password123'),
        role='professor',
        first_name='Jane',
        last_name='Smith'
    )
    db.session.add(professor)
    db.session.commit()

    # Créer quelques classes
    classroom1 = Classroom(name='Classe A', professor_id=professor.id)
    classroom2 = Classroom(name='Classe B', professor_id=professor.id)
    db.session.add_all([classroom1, classroom2])
    db.session.commit()

    # Se connecter
    login_data = {
        'email': 'prof2@test.com',
        'password': 'password123'
    }
    login_response = client.post('/api/auth/login',
                               data=json.dumps(login_data),
                               content_type='application/json')
    token = json.loads(login_response.data)['access_token']

    # Récupérer les classes
    response = client.get('/api/classrooms',
                         headers={
                             'Authorization': f'Bearer {token}',
                             'Content-Type': 'application/json'
                         })
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 2
    assert data[0]['name'] == 'Classe A'
    assert data[1]['name'] == 'Classe B'

def test_get_classroom_details(client):
    # Créer un professeur
    professor = User(
        email='prof3@test.com',
        password=generate_password_hash('password123'),
        role='professor',
        first_name='Alice',
        last_name='Johnson'
    )
    db.session.add(professor)
    db.session.commit()

    # Créer une classe
    classroom = Classroom(name='Classe Test', professor_id=professor.id)
    db.session.add(classroom)
    db.session.commit()

    # Se connecter
    login_data = {
        'email': 'prof3@test.com',
        'password': 'password123'
    }
    login_response = client.post('/api/auth/login',
                               data=json.dumps(login_data),
                               content_type='application/json')
    token = json.loads(login_response.data)['access_token']

    # Récupérer les détails de la classe
    response = client.get(f'/api/classrooms/{classroom.id}',
                         headers={
                             'Authorization': f'Bearer {token}',
                             'Content-Type': 'application/json'
                         })
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['name'] == 'Classe Test'
    assert data['professor_id'] == professor.id
