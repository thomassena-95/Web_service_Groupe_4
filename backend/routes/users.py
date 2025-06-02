from flask import Blueprint, request, jsonify
from models import db, User, StudentReading
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import CORS

users_bp = Blueprint('users', __name__)
CORS(users_bp, origins='*')

@users_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    current_user_id = int(get_jwt_identity())
    user = db.session.get(User, current_user_id)

    if not user or user.role != 'professor':
        return jsonify({'error': 'Accès non autorisé'}), 403

    role = request.args.get('role')
    query = User.query

    if role:
        query = query.filter_by(role=role)

    users = query.all()
    return jsonify([{
        'id': user.id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'role': user.role
    } for user in users])

@users_bp.route('/users/students', methods=['GET'])
@jwt_required()
def get_students():
    try:
        print("🔍 Début de la requête GET /users/students")
        current_user_id = int(get_jwt_identity())
        print(f"👤 ID de l'utilisateur: {current_user_id}")
        
        user = db.session.get(User, current_user_id)
        print(f"👤 Utilisateur trouvé: {user.first_name} {user.last_name} (Rôle: {user.role})")
        
        if not user or user.role != 'professor':
            print("❌ Accès refusé: Utilisateur non professeur")
            return jsonify({'error': 'Accès non autorisé'}), 403
        
        # Récupérer tous les étudiants
        students = User.query.filter_by(role='student').all()
        print(f"📚 Nombre d'étudiants trouvés: {len(students)}")
        
        result = [{
            'id': student.id,
            'first_name': student.first_name,
            'last_name': student.last_name,
            'email': student.email,
            'role': student.role
        } for student in students]
        
        print("✅ Liste des étudiants préparée avec succès")
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return jsonify({'error': str(e)}), 500 

@users_bp.route('/users/<int:student_id>/submissions', methods=['GET'])
@jwt_required()
def get_student_submissions(student_id):
    try:
        print("🔍 Début de la requête GET /users/{student_id}/submissions")
        current_user_id = int(get_jwt_identity())
        print(f"👤 ID du professeur: {current_user_id}")
        
        # Vérifier que l'utilisateur est un professeur
        professor = db.session.get(User, current_user_id)
        if not professor or professor.role != 'professor':
            print("❌ Accès refusé: Utilisateur non professeur")
            return jsonify({'error': 'Accès non autorisé'}), 403
        
        # Vérifier que l'étudiant existe
        student = db.session.get(User, student_id)
        if not student or student.role != 'student':
            print("❌ Étudiant non trouvé")
            return jsonify({'error': 'Étudiant non trouvé'}), 404
        
        # Récupérer les soumissions de l'étudiant
        submissions = StudentReading.query.filter_by(user_id=student_id).all()
        print(f"📚 Nombre de soumissions trouvées: {len(submissions)}")
        
        result = [{
            'id': submission.id,
            'assignment_id': submission.assignment_id,
            'summary': submission.summary,
            'status': submission.status,
            'submitted_at': submission.submitted_at.isoformat(),
            'validated_at': submission.validated_at.isoformat() if submission.validated_at else None,
            'assignment': {
                'id': submission.assignment.id,
                'book': {
                    'id': submission.assignment.book.id,
                    'title': submission.assignment.book.title,
                    'author': submission.assignment.book.author
                },
                'classroom': {
                    'id': submission.assignment.classroom.id,
                    'name': submission.assignment.classroom.name
                }
            }
        } for submission in submissions]
        
        print("✅ Liste des soumissions préparée avec succès")
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return jsonify({'error': str(e)}), 500 