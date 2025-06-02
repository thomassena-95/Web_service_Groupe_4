import pytest
from app import create_app
from models import db, User, Classroom, ReadingAssignment, Book
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

def test_create_assignment(client):
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
    
    # Créer une classe
    classroom = Classroom(
        name='Test Class',
        professor_id=professor.id
    )
    db.session.add(classroom)
    db.session.commit()
    
    # Créer un livre
    book = Book(
        title='Test Book',
        author='Test Author'
    )
    db.session.add(book)
    db.session.commit()
    
    # Se connecter en tant que professeur
    login_response = client.post('/api/auth/login', json={
        'email': 'prof@test.com',
        'password': 'password123'
    })
    token = login_response.json['access_token']
    
    # Créer un devoir
    response = client.post('/api/assignments', 
        json={
            'book_id': book.id,
            'classroom_id': classroom.id
        },
        headers={'Authorization': f'Bearer {token}'}
    )
    
    assert response.status_code == 201
    assert response.json['book_id'] == book.id
    assert response.json['classroom_id'] == classroom.id

def test_get_assignments_professor(client):
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
    
    # Créer une classe
    classroom = Classroom(
        name='Test Class',
        professor_id=professor.id
    )
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
    
    # Se connecter en tant que professeur
    login_response = client.post('/api/auth/login', json={
        'email': 'prof@test.com',
        'password': 'password123'
    })
    token = login_response.json['access_token']
    
    # Récupérer les devoirs
    response = client.get('/api/assignments',
        headers={'Authorization': f'Bearer {token}'}
    )
    
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['book_id'] == book.id
    assert response.json[0]['classroom_id'] == classroom.id

def test_get_assignments_student(client):
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
    
    # Récupérer les devoirs
    response = client.get('/api/assignments',
        headers={'Authorization': f'Bearer {token}'}
    )
    
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['book_id'] == book.id
    assert response.json[0]['classroom_id'] == classroom.id
