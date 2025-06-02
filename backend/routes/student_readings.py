from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, StudentReading, ReadingAssignment, User, Classroom, Book
from datetime import datetime

student_readings_bp = Blueprint('student_readings', __name__)

@student_readings_bp.route('/student-readings', methods=['POST'])
@jwt_required()
def create_student_reading():
    try:
        print("🔍 Début de la création d'une lecture")
        current_user_id = int(get_jwt_identity())
        print(f"👤 ID de l'utilisateur: {current_user_id}")
        
        data = request.get_json()
        print(f"📝 Données reçues: {data}")
        
        # Vérifier que l'utilisateur est un étudiant
        user = db.session.get(User, current_user_id)
        print(f"👤 Utilisateur trouvé: {user.first_name} {user.last_name} (Rôle: {user.role})")
        
        if not user:
            print("❌ Utilisateur non trouvé")
            return jsonify({'error': 'Utilisateur non trouvé'}), 404
            
        if user.role != 'student':
            print(f"❌ Rôle incorrect: {user.role} (attendu: student)")
            return jsonify({'error': 'Accès non autorisé'}), 403
        
        # Vérifier que le devoir existe
        assignment = db.session.get(ReadingAssignment, data.get('assignment_id'))
        print(f"📚 Devoir trouvé: {assignment.id if assignment else 'Non trouvé'}")
        
        if not assignment:
            print("❌ Devoir non trouvé")
            return jsonify({'error': 'Devoir non trouvé'}), 404
        
        # Vérifier que l'étudiant est dans la classe
        classroom = db.session.get(Classroom, assignment.classroom_id)
        print(f"🏫 Classe trouvée: {classroom.name if classroom else 'Non trouvée'}")
        
        if classroom:
            print(f"👥 Étudiants dans la classe: {[s.first_name for s in classroom.students]}")
            print(f"🔍 Vérification si {user.first_name} est dans la classe")
            
        if not classroom or user not in classroom.students:
            print(f"❌ L'étudiant {user.first_name} n'est pas dans la classe {classroom.name if classroom else 'Non trouvée'}")
            return jsonify({'error': 'Vous n\'êtes pas dans cette classe'}), 403
        
        # Créer le nouveau résumé
        student_reading = StudentReading(
            user_id=current_user_id,
            assignment_id=data.get('assignment_id'),
            summary=data.get('summary'),
            status='en_attente',
            submitted_at=datetime.utcnow()
        )
        
        db.session.add(student_reading)
        db.session.commit()
        
        print(f"✅ Résumé créé avec succès - ID: {student_reading.id}")
        
        return jsonify({
            'id': student_reading.id,
            'user_id': student_reading.user_id,
            'assignment_id': student_reading.assignment_id,
            'summary': student_reading.summary,
            'status': student_reading.status,
            'submitted_at': student_reading.submitted_at.isoformat()
        }), 201
        
    except Exception as e:
        print(f"❌ Erreur globale: {str(e)}")
        print(f"Type d'erreur: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@student_readings_bp.route('/student-readings/me', methods=['GET'])
@jwt_required()
def get_my_readings():
    current_user_id = int(get_jwt_identity())
    user = db.session.get(User, current_user_id)
    
    if not user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    
    # Récupérer tous les résumés de l'étudiant
    readings = StudentReading.query.filter_by(user_id=current_user_id).all()
    
    return jsonify([{
        'id': r.id,
        'assignment_id': r.assignment_id,
        'summary': r.summary,
        'status': r.status,
        'submitted_at': r.submitted_at.isoformat(),
        'validated_at': r.validated_at.isoformat() if r.validated_at else None
    } for r in readings])

@student_readings_bp.route('/student-readings/<int:id>', methods=['PATCH'])
@jwt_required()
def update_reading(id):
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    
    # Vérifier que l'utilisateur est un professeur
    user = db.session.get(User, current_user_id)
    if not user or user.role != 'professor':
        return jsonify({'error': 'Accès non autorisé'}), 403
    
    # Récupérer le résumé
    reading = db.session.get(StudentReading, id)
    if not reading:
        return jsonify({'error': 'Résumé non trouvé'}), 404
    
    # Vérifier que le professeur est le professeur de la classe
    assignment = db.session.get(ReadingAssignment, reading.assignment_id)
    classroom = db.session.get(Classroom, assignment.classroom_id)
    
    if not classroom or classroom.professor_id != current_user_id:
        return jsonify({'error': 'Accès non autorisé'}), 403
    
    # Mettre à jour le statut
    reading.status = data.get('status', 'validated')
    reading.validated_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({
        'id': reading.id,
        'status': reading.status,
        'validated_at': reading.validated_at.isoformat()
    })

@student_readings_bp.route('/student-readings', methods=['GET'])
@jwt_required()
def get_all_readings():
    try:
        print("🔍 Début de la requête GET /student-readings")
        current_user_id = int(get_jwt_identity())
        print(f"👤 ID du professeur: {current_user_id}")
        
        # Vérifier que l'utilisateur est un professeur
        professor = db.session.get(User, current_user_id)
        print(f"👤 Professeur trouvé: {professor.first_name} {professor.last_name}")
        
        if not professor or professor.role != 'professor':
            print("❌ Accès refusé: Utilisateur non professeur")
            return jsonify({'error': 'Accès non autorisé'}), 403
        
        # Récupérer toutes les lectures des classes du professeur
        readings = StudentReading.query.join(
            ReadingAssignment
        ).join(
            Classroom
        ).filter(
            Classroom.professor_id == current_user_id
        ).all()
        
        print(f"📚 Nombre de lectures trouvées: {len(readings)}")
        
        result = []
        for r in readings:
            # Récupérer les données associées
            student = db.session.get(User, r.user_id)
            assignment = db.session.get(ReadingAssignment, r.assignment_id)
            book = db.session.get(Book, assignment.book_id) if assignment else None
            classroom = db.session.get(Classroom, assignment.classroom_id) if assignment else None
            
            result.append({
                'id': r.id,
                'assignment_id': r.assignment_id,
                'user_id': r.user_id,
                'summary': r.summary,
                'status': r.status,
                'submitted_at': r.submitted_at.isoformat(),
                'validated_at': r.validated_at.isoformat() if r.validated_at else None,
                'student': {
                    'id': student.id,
                    'first_name': student.first_name,
                    'last_name': student.last_name
                } if student else None,
                'assignment': {
                    'id': assignment.id,
                    'book': {
                        'id': book.id,
                        'title': book.title,
                        'author': book.author
                    } if book else None,
                    'classroom': {
                        'id': classroom.id,
                        'name': classroom.name
                    } if classroom else None
                } if assignment else None
            })
        
        print("✅ Données préparées avec succès")
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({'error': str(e)}), 500
