from flask import Blueprint, request, jsonify
from models import db, Book, ReadingAssignment, StudentReading
from datetime import datetime
from flask_jwt_extended import jwt_required

books_bp = Blueprint('books', __name__)

# �� Récupérer tous les livres
@books_bp.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    return jsonify([
        {'id': b.id, 'title': b.title, 'author': b.author, 'published_at': b.published_at.strftime('%Y-%m-%d') if b.published_at else None}
        for b in books
    ])

# 🔹 Récupérer un livre par ID
@books_bp.route('/books/<int:id>', methods=['GET'])
@jwt_required()
def get_book(id):
    book = db.session.get(Book, id)
    if not book:
        return jsonify({'error': 'Livre non trouvé'}), 404
    return jsonify(book.to_dict())

# 🔹 Ajouter un livre
@books_bp.route('/books', methods=['POST'])
def add_book():
    data = request.get_json()

    if not data or 'title' not in data or 'author' not in data:
        return jsonify({'error': 'Invalid data, title and author are required'}), 400

    published_at = None
    if 'published_at' in data:
        try:
            published_at = datetime.strptime(data['published_at'], '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Invalid date format, expected YYYY-MM-DD'}), 400

    book = Book(title=data['title'], author=data['author'], published_at=published_at)
    db.session.add(book)
    db.session.commit()
    return jsonify({'message': 'Book added successfully', 'id': book.id}), 201

# 🔹 Mettre à jour un livre
@books_bp.route('/books/<int:id>', methods=['PUT'])
@jwt_required()
def update_book(id):
    book = db.session.get(Book, id)
    if not book:
        return jsonify({'error': 'Livre non trouvé'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    if 'title' in data:
        book.title = data['title']
    if 'author' in data:
        book.author = data['author']
    if 'published_at' in data:
        try:
            book.published_at = datetime.strptime(data['published_at'], '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Invalid date format, expected YYYY-MM-DD'}), 400

    db.session.commit()
    return jsonify({'message': 'Book updated successfully'})

# 🔹 Supprimer un livre
@books_bp.route('/books/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_book(id):
    try:
        book = db.session.get(Book, id)
        if not book:
            return jsonify({'error': 'Livre non trouvé'}), 404

        # Vérifier s'il y a des devoirs associés
        assignments = ReadingAssignment.query.filter_by(book_id=id).all()
        if assignments:
            # Supprimer d'abord les devoirs associés
            for assignment in assignments:
                # Supprimer les lectures des étudiants associées à ce devoir
                StudentReading.query.filter_by(assignment_id=assignment.id).delete()
                # Supprimer le devoir
                db.session.delete(assignment)
            
            # Commit les suppressions des devoirs
            db.session.commit()

        # Maintenant on peut supprimer le livre
        db.session.delete(book)
        db.session.commit()
        
        return jsonify({'message': 'Livre et ses devoirs associés supprimés avec succès'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
