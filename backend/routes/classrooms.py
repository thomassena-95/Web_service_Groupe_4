from flask import Blueprint, request, jsonify
from models import db, Classroom, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import CORS

classrooms_bp = Blueprint('classrooms', __name__)
CORS(classrooms_bp, origins='*')

# 🔹 Récupérer toutes les classes du professeur
@classrooms_bp.route('/classrooms', methods=['GET'])
@jwt_required()
def get_classrooms():
    current_user_id = get_jwt_identity()
    classrooms = Classroom.query.filter_by(professor_id=current_user_id).all()
    return jsonify([
        {
            'id': c.id,
            'name': c.name,
            'professor_id': c.professor_id
        }
        for c in classrooms
    ])

# 🔹 Créer une nouvelle classe
@classrooms_bp.route('/classrooms', methods=['POST'])
@jwt_required()
def create_classroom():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        if not data or 'name' not in data:
            return jsonify({'error': 'Le nom de la classe est requis'}), 400

        classroom = Classroom(
            name=data['name'],
            professor_id=current_user_id
        )
        db.session.add(classroom)
        db.session.commit()

        return jsonify({
            'message': 'Classe créée avec succès',
            'classroom': {
                'id': classroom.id,
                'name': classroom.name,
                'professor_id': classroom.professor_id
            }
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 422

# 🔹 Récupérer une classe spécifique
@classrooms_bp.route('/classrooms/<int:id>', methods=['GET'])
@jwt_required()
def get_classroom(id):
    current_user_id = int(get_jwt_identity())
    classroom = db.session.get(Classroom, id)

    if not classroom:
        return jsonify({'error': 'Classe non trouvée'}), 404

    if classroom.professor_id != current_user_id:
        return jsonify({'error': 'Accès non autorisé'}), 403

    return jsonify({
        'id': classroom.id,
        'name': classroom.name,
        'professor_id': classroom.professor_id
    })

# 🔹 Mettre à jour une classe
@classrooms_bp.route('/classrooms/<int:id>', methods=['PUT'])
@jwt_required()
def update_classroom(id):
    current_user_id = int(get_jwt_identity())
    classroom = db.session.get(Classroom, id)

    if not classroom:
        return jsonify({'error': 'Classe non trouvée'}), 404

    if classroom.professor_id != current_user_id:
        return jsonify({'error': 'Accès non autorisé'}), 403

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Aucune donnée fournie'}), 400

    if 'name' in data:
        classroom.name = data['name']

    db.session.commit()
    return jsonify({'message': 'Classe mise à jour avec succès'})

# 🔹 Supprimer une classe
@classrooms_bp.route('/classrooms/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_classroom(id):
    current_user_id = int(get_jwt_identity())
    classroom = db.session.get(Classroom, id)

    if not classroom:
        return jsonify({'error': 'Classe non trouvée'}), 404

    if classroom.professor_id != current_user_id:
        return jsonify({'error': 'Accès non autorisé'}), 403

    db.session.delete(classroom)
    db.session.commit()
    return jsonify({'message': 'Classe supprimée avec succès'})

# 🔹 Ajouter un étudiant à une classe
@classrooms_bp.route('/classrooms/<int:id>/students', methods=['POST'])
@jwt_required()
def add_student_to_classroom(id):
    current_user_id = int(get_jwt_identity())
    classroom = db.session.get(Classroom, id)

    if not classroom:
        return jsonify({'error': 'Classe non trouvée'}), 404

    if classroom.professor_id != current_user_id:
        return jsonify({'error': 'Accès non autorisé'}), 403

    data = request.get_json()
    if not data or 'student_id' not in data:
        return jsonify({'error': 'ID de l\'étudiant requis'}), 400

    student = db.session.get(User, data['student_id'])
    if not student or student.role != 'student':
        return jsonify({'error': 'Étudiant non trouvé'}), 404

    if student in classroom.students:
        return jsonify({'error': 'L\'étudiant est déjà dans cette classe'}), 400

    classroom.students.append(student)
    db.session.commit()

    return jsonify({'message': 'Étudiant ajouté avec succès'}), 200

# 🔹 Supprimer un étudiant d'une classe
@classrooms_bp.route('/classrooms/<int:id>/students/<int:student_id>', methods=['DELETE'])
@jwt_required()
def remove_student_from_classroom(id, student_id):
    current_user_id = int(get_jwt_identity())
    classroom = db.session.get(Classroom, id)

    if not classroom:
        return jsonify({'error': 'Classe non trouvée'}), 404

    if classroom.professor_id != current_user_id:
        return jsonify({'error': 'Accès non autorisé'}), 403

    student = db.session.get(User, student_id)
    if not student:
        return jsonify({'error': 'Étudiant non trouvé'}), 404

    if student not in classroom.students:
        return jsonify({'error': 'L\'étudiant n\'est pas dans cette classe'}), 400

    classroom.students.remove(student)
    db.session.commit()

    return jsonify({'message': 'Étudiant supprimé avec succès'}), 200

# 🔹 Récupérer les étudiants d'une classe
@classrooms_bp.route('/classrooms/<int:id>/students', methods=['GET'])
@jwt_required()
def get_classroom_students(id):
    current_user_id = int(get_jwt_identity())
    classroom = db.session.get(Classroom, id)

    if not classroom:
        return jsonify({'error': 'Classe non trouvée'}), 404

    if classroom.professor_id != current_user_id:
        return jsonify({'error': 'Accès non autorisé'}), 403

    return jsonify([{
        'id': student.id,
        'first_name': student.first_name,
        'last_name': student.last_name,
        'email': student.email
    } for student in classroom.students])

# 🔹 Récupérer tous les étudiants disponibles
@classrooms_bp.route('/users/students', methods=['GET'])
@jwt_required()
def get_available_students():
    current_user_id = int(get_jwt_identity())
    user = db.session.get(User, current_user_id)

    if not user or user.role != 'professor':
        return jsonify({'error': 'Accès non autorisé'}), 403

    students = User.query.filter_by(role='student').all()
    return jsonify([{
        'id': student.id,
        'first_name': student.first_name,
        'last_name': student.last_name,
        'email': student.email
    } for student in students])
