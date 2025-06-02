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

def test_complete_workflow(client):
    """
    Test complet du workflow de l'application :
    1. Inscription et connexion d'un professeur
    2. Création d'une classe
    3. Inscription et connexion d'un étudiant
    4. Ajout de l'étudiant à la classe
    5. Création d'un livre
    6. Création d'un devoir
    7. Soumission d'un résumé par l'étudiant
    8. Validation du résumé par le professeur
    """
    
    # 1. Inscription du professeur
    prof_data = {
        'email': 'prof@test.com',
        'password': 'password123',
        'role': 'professor',
        'first_name': 'John',
        'last_name': 'Doe'
    }
    response = client.post('/api/auth/register', json=prof_data)
    assert response.status_code == 201
    
    # Connexion du professeur
    login_response = client.post('/api/auth/login', json={
        'email': 'prof@test.com',
        'password': 'password123'
    })
    assert login_response.status_code == 200
    prof_token = login_response.json['access_token']
    
    # 2. Création d'une classe
    classroom_response = client.post('/api/classrooms',
        json={'name': 'Classe Test'},
        headers={'Authorization': f'Bearer {prof_token}'}
    )
    assert classroom_response.status_code == 201
    classroom_id = classroom_response.json['classroom']['id']
    
    # 3. Inscription de l'étudiant
    student_data = {
        'email': 'student@test.com',
        'password': 'password123',
        'role': 'student',
        'first_name': 'Jane',
        'last_name': 'Doe'
    }
    response = client.post('/api/auth/register', json=student_data)
    assert response.status_code == 201
    
    # Connexion de l'étudiant
    login_response = client.post('/api/auth/login', json={
        'email': 'student@test.com',
        'password': 'password123'
    })
    assert login_response.status_code == 200
    student_token = login_response.json['access_token']
    
    # 4. Ajout de l'étudiant à la classe (via le modèle)
    student = User.query.filter_by(email='student@test.com').first()
    classroom = db.session.get(Classroom, classroom_id)
    classroom.students.append(student)
    db.session.commit()
    
    # 5. Création d'un livre
    book = Book(
        title='Test Book',
        author='Test Author'
    )
    db.session.add(book)
    db.session.commit()
    
    # 6. Création d'un devoir
    assignment_response = client.post('/api/assignments',
        json={
            'book_id': book.id,
            'classroom_id': classroom_id
        },
        headers={'Authorization': f'Bearer {prof_token}'}
    )
    assert assignment_response.status_code == 201
    assignment_id = assignment_response.json['id']
    
    # 7. Soumission d'un résumé par l'étudiant
    reading_response = client.post('/api/student-readings',
        json={
            'assignment_id': assignment_id,
            'summary': 'Test summary'
        },
        headers={'Authorization': f'Bearer {student_token}'}
    )
    assert reading_response.status_code == 201
    reading_id = reading_response.json['id']
    
    # Vérification que l'étudiant peut voir son résumé
    my_readings_response = client.get('/api/student-readings/me',
        headers={'Authorization': f'Bearer {student_token}'}
    )
    assert my_readings_response.status_code == 200
    assert len(my_readings_response.json) == 1
    assert my_readings_response.json[0]['summary'] == 'Test summary'
    
    # 8. Validation du résumé par le professeur
    validate_response = client.put(f'/api/student-readings/{reading_id}/validate',
        json={'status': 'valide'},
        headers={'Authorization': f'Bearer {prof_token}'}
    )
    assert validate_response.status_code == 200
    assert validate_response.json['status'] == 'valide'
    
    # Vérification finale que le résumé est bien validé
    final_reading_response = client.get('/api/student-readings/me',
        headers={'Authorization': f'Bearer {student_token}'}
    )
    assert final_reading_response.status_code == 200
    assert final_reading_response.json[0]['status'] == 'valide'
