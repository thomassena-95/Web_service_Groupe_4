from app import create_app
from extensions import db
from models import User, Classroom, Book, ReadingAssignment, StudentReading
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

def init_db():
    app = create_app()
    with app.app_context():
        # Créer les tables
        db.create_all()
        
        # Vérifier si les utilisateurs de test existent déjà
        if not User.query.filter_by(email='prof@test.com').first():
            # Créer le professeur
            prof = User(
                email='prof@test.com',
                password=generate_password_hash('prof123'),
                role='professor',
                first_name='Professeur',
                last_name='Test'
            )
            db.session.add(prof)
            db.session.flush()  # Pour obtenir l'ID du professeur
        
        if not User.query.filter_by(email='eleve@test.com').first():
            # Créer l'élève
            eleve = User(
                email='eleve@test.com',
                password=generate_password_hash('eleve123'),
                role='student',
                first_name='Élève',
                last_name='Test'
            )
            db.session.add(eleve)
            db.session.flush()  # Pour obtenir l'ID de l'élève

        # Créer une classe de test si elle n'existe pas
        if not Classroom.query.filter_by(name='Classe Test').first():
            classe = Classroom(
                name='Classe Test',
                professor_id=prof.id
            )
            db.session.add(classe)
            db.session.flush()

            # Ajouter l'élève à la classe
            classe.students.append(eleve)

        # Créer un livre de test
        if not Book.query.filter_by(title='Le Petit Prince').first():
            livre = Book(
                title='Le Petit Prince',
                author='Antoine de Saint-Exupéry',
                published_at=datetime(1943, 4, 6)
            )
            db.session.add(livre)
            db.session.flush()

            # Créer un devoir de lecture
            devoir = ReadingAssignment(
                book_id=livre.id,
                classroom_id=classe.id,
                assigned_date=datetime.now(),
                due_date=datetime.now() + timedelta(days=7)
            )
            db.session.add(devoir)
            db.session.flush()

            # Créer un résumé de test
            resume = StudentReading(
                user_id=eleve.id,
                assignment_id=devoir.id,
                summary='Un résumé de test pour Le Petit Prince',
                status='en_attente',
                submitted_at=datetime.now()
            )
            db.session.add(resume)

        # Sauvegarder toutes les modifications
        db.session.commit()
        print("Base de données initialisée avec succès!")

if __name__ == '__main__':
    init_db()
