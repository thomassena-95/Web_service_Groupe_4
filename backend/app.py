from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from extensions import db, jwt
import logging

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Configuration des logs
    logging.basicConfig(level=logging.DEBUG)
    
    # Configuration CORS globale
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # Route racine pour vérifier que le serveur fonctionne
    @app.route('/')
    def index():
        return jsonify({"status": "ok", "message": "API is running"})
    
    # Middleware pour logger les requêtes
    @app.before_request
    def log_request_info():
        app.logger.debug('Headers: %s', request.headers)
        app.logger.debug('Body: %s', request.get_data())
    
    # Initialisation des extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # Enregistrement des blueprints
    from routes.auth import auth_bp
    from routes.classrooms import classrooms_bp
    from routes.books import books_bp
    from routes.assignments import assignments_bp
    from routes.student_readings import student_readings_bp
    from routes.users import users_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(classrooms_bp, url_prefix='/api')
    app.register_blueprint(books_bp, url_prefix='/api')
    app.register_blueprint(assignments_bp, url_prefix='/api')
    app.register_blueprint(student_readings_bp, url_prefix='/api')
    app.register_blueprint(users_bp, url_prefix='/api')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0')