from extensions import db
from sqlalchemy.orm import relationship
from datetime import datetime

classroom_student = db.Table('classroom_student',
    db.Column('classroom_id', db.Integer, db.ForeignKey('classroom.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'professor' ou 'student'
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relations
    classrooms = relationship("Classroom", back_populates="professor")
    student_readings = relationship("StudentReading", back_populates="student")
    enrolled_classrooms = relationship("Classroom", 
                                     secondary="classroom_student",
                                     back_populates="students")

class Classroom(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    professor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relations
    professor = relationship("User", back_populates="classrooms")
    reading_assignments = relationship("ReadingAssignment", back_populates="classroom")
    students = relationship("User", 
                          secondary="classroom_student",  # Table d'association
                          back_populates="enrolled_classrooms")

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    published_at = db.Column(db.DateTime)

    # Relations
    reading_assignments = relationship("ReadingAssignment", back_populates="book")

class ReadingAssignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    classroom_id = db.Column(db.Integer, db.ForeignKey('classroom.id'), nullable=False)
    assigned_date = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime)

    # Relations
    book = relationship("Book", back_populates="reading_assignments")
    classroom = relationship("Classroom", back_populates="reading_assignments")
    student_readings = relationship("StudentReading", back_populates="assignment")

class StudentReading(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    assignment_id = db.Column(db.Integer, db.ForeignKey('reading_assignment.id'), nullable=False)
    summary = db.Column(db.Text)  # Le résumé de l'étudiant
    status = db.Column(db.String(20), nullable=False, default='en_attente')  # 'en_attente', 'valide', 'refuse'
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    validated_at = db.Column(db.DateTime)

    # Relations
    student = relationship("User", back_populates="student_readings")
    assignment = relationship("ReadingAssignment", back_populates="student_readings")
