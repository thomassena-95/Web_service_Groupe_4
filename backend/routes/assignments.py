from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, ReadingAssignment, Classroom, User, Book
from datetime import datetime

assignments_bp = Blueprint('assignments', __name__)

@assignments_bp.route('/assignments', methods=['POST'])
@jwt_required()
def create_assignment():
    try:
        data = request.get_json()
        
        # Créer le nouveau devoir
        assignment = ReadingAssignment(
            book_id=data.get('book_id'),
            classroom_id=data.get('classroom_id'),
            assigned_date=datetime.utcnow(),
            due_date=datetime.fromisoformat(data.get('due_date')) if data.get('due_date') else None
        )
        
        db.session.add(assignment)
        db.session.commit()
        
        return jsonify({
            'id': assignment.id,
            'book_id': assignment.book_id,
            'classroom_id': assignment.classroom_id,
            'assigned_date': assignment.assigned_date.isoformat(),
            'due_date': assignment.due_date.isoformat() if assignment.due_date else None
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@assignments_bp.route('/assignments', methods=['GET'])
@jwt_required()
def get_assignments():
    try:
        assignments = ReadingAssignment.query.join(Book).all()
        return jsonify([{
            'id': a.id,
            'book_id': a.book_id,
            'classroom_id': a.classroom_id,
            'assigned_date': a.assigned_date.isoformat(),
            'due_date': a.due_date.isoformat() if a.due_date else None,
            'book': {
                'id': a.book.id,
                'title': a.book.title,
                'author': a.book.author,
                'published_at': a.book.published_at.isoformat() if a.book.published_at else None
            }
        } for a in assignments])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@assignments_bp.route('/assignments/<int:id>', methods=['GET'])
@jwt_required()
def get_assignment(id):
    try:
        assignment = db.session.get(ReadingAssignment, id)
        if not assignment:
            return jsonify({'error': 'Devoir non trouvé'}), 404
        
        return jsonify({
            'id': assignment.id,
            'book_id': assignment.book_id,
            'classroom_id': assignment.classroom_id,
            'assigned_date': assignment.assigned_date.isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@assignments_bp.route('/assignments/<int:id>', methods=['PUT', 'PATCH'])
@jwt_required()
def update_assignment(id):
    try:
        assignment = db.session.get(ReadingAssignment, id)
        if not assignment:
            return jsonify({'error': 'Devoir non trouvé'}), 404
        
        data = request.get_json()
        
        # Mise à jour des champs
        if 'book_id' in data:
            assignment.book_id = data['book_id']
        if 'classroom_id' in data:
            assignment.classroom_id = data['classroom_id']
        if 'due_date' in data:
            assignment.due_date = datetime.fromisoformat(data['due_date']) if data['due_date'] else None
        
        db.session.commit()
        return jsonify({
            'id': assignment.id,
            'book_id': assignment.book_id,
            'classroom_id': assignment.classroom_id,
            'assigned_date': assignment.assigned_date.isoformat(),
            'due_date': assignment.due_date.isoformat() if assignment.due_date else None
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@assignments_bp.route('/assignments/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_assignment(id):
    try:
        assignment = db.session.get(ReadingAssignment, id)
        if not assignment:
            return jsonify({'error': 'Devoir non trouvé'}), 404
        
        db.session.delete(assignment)
        db.session.commit()
        return jsonify({'message': 'Devoir supprimé avec succès'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
