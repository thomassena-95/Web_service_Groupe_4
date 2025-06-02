import pytest
from app import create_app
from models import db, User, Classroom, Book, ReadingAssignment, StudentReading
from werkzeug.security import generate_password_hash

@pytest.fixture
def app():
    app = create_app()
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_create_student_reading(client):
    # Créer un professeur
    professor = User(
        email='prof@test.com',
        password=generate_password_hash('password123'),
        role='professor',
        first_name='John',
        last_name='Doe'
    )
    db.session.add(professor)
    db.session.commit()
    
    # Créer un étudiant
    student = User(
        email='student@test.com',
        password=generate_password_hash('password123'),
        role='student',
        first_name='Jane',
        last_name='Doe'
    )
    db.session.add(student)
    db.session.commit()
    
    # Créer une classe
    classroom = Classroom(
        name='Test Class',
        professor_id=professor.id
    )
    classroom.students.append(student)
    db.session.add(classroom)
    db.session.commit()
    
    # Créer un livre
    book = Book(
        title='Test Book',
        author='Test Author'
    )
    db.session.add(book)
    db.session.commit()
    
    # Créer un devoir
    assignment = ReadingAssignment(
        book_id=book.id,
        classroom_id=classroom.id
    )
    db.session.add(assignment)
    db.session.commit()
    
    # Se connecter en tant qu'étudiant
    login_response = client.post('/api/auth/login', json={
        'email': 'student@test.com',
        'password': 'password123'
    })
    token = login_response.json['access_token']
    
    # Créer un résumé
    response = client.post('/api/student-readings',
        json={
            'assignment_id': assignment.id,
            'summary': 'Test summary'
        },
        headers={'Authorization': f'Bearer {token}'}
    )
    
    assert response.status_code == 201
    assert response.json['summary'] == 'Test summary'
    assert response.json['status'] == 'en_attente'

def test_get_my_readings(client):
    # Créer un professeur
    professor = User(
        email='prof@test.com',
        password=generate_password_hash('password123'),
        role='professor',
        first_name='John',
        last_name='Doe'
    )
    db.session.add(professor)
    db.session.commit()
    
    # Créer un étudiant
    student = User(
        email='student@test.com',
        password=generate_password_hash('password123'),
        role='student',
        first_name='Jane',
        last_name='Doe'
    )
    db.session.add(student)
    db.session.commit()
    
    # Créer une classe
    classroom = Classroom(
        name='Test Class',
        professor_id=professor.id
    )
    classroom.students.append(student)
    db.session.add(classroom)
    db.session.commit()
    
    # Créer un livre
    book = Book(
        title='Test Book',
        author='Test Author'
    )
    db.session.add(book)
    db.session.commit()
    
    # Créer un devoir
    assignment = ReadingAssignment(
        book_id=book.id,
        classroom_id=classroom.id
    )
    db.session.add(assignment)
    db.session.commit()
    
    # Créer un résumé
    reading = StudentReading(
        user_id=student.id,
        assignment_id=assignment.id,  # Utiliser l'ID du devoir créé
        summary='Test summary',
        status='en_attente'
    )
    db.session.add(reading)
    db.session.commit()
    
    # Se connecter en tant qu'étudiant
    login_response = client.post('/api/auth/login', json={
        'email': 'student@test.com',
        'password': 'password123'
    })
    token = login_response.json['access_token']
    
    # Récupérer les résumés
    response = client.get('/api/student-readings/me',
        headers={'Authorization': f'Bearer {token}'}
    )
    
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['summary'] == 'Test summary'

def test_validate_reading(client):
    # Créer un professeur
    professor = User(
        email='prof@test.com',
        password=generate_password_hash('password123'),
        role='professor',
        first_name='John',
        last_name='Doe'
    )
    db.session.add(professor)
    db.session.commit()
    
    # Créer un étudiant
    student = User(
        email='student@test.com',
        password=generate_password_hash('password123'),
        role='student',
        first_name='Jane',
        last_name='Doe'
    )
    db.session.add(student)
    db.session.commit()
    
    # Créer une classe
    classroom = Classroom(
        name='Test Class',
        professor_id=professor.id
    )
    classroom.students.append(student)
    db.session.add(classroom)
    db.session.commit()
    
    # Créer un livre
    book = Book(
        title='Test Book',
        author='Test Author'
    )
    db.session.add(book)
    db.session.commit()
    
    # Créer un devoir
    assignment = ReadingAssignment(
        book_id=book.id,
        classroom_id=classroom.id
    )
    db.session.add(assignment)
    db.session.commit()
    
    # Créer un résumé
    reading = StudentReading(
        user_id=student.id,
        assignment_id=assignment.id,
        summary='Test summary',
        status='en_attente'
    )
    db.session.add(reading)
    db.session.commit()
    
    # Se connecter en tant que professeur
    login_response = client.post('/api/auth/login', json={
        'email': 'prof@test.com',
        'password': 'password123'
    })
    token = login_response.json['access_token']
    
    # Valider le résumé
    response = client.put(f'/api/student-readings/{reading.id}/validate',
        json={'status': 'valide'},
        headers={'Authorization': f'Bearer {token}'}
    )
    
    assert response.status_code == 200
    assert response.json['status'] == 'valide'
