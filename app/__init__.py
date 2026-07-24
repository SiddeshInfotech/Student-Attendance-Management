from flask import Flask
from flask_jwt_extended import JWTManager
from app.config.config import config_by_name
from app.middleware.error_handler import register_error_handlers
from app.utils.logger import app_logger

# Import blueprints to register on the app factory
from app.routes.auth import auth_bp
from app.routes.dashboard import dashboard_bp
from app.routes.students import students_bp
from app.routes.attendance import attendance_bp
from app.routes.reports import reports_bp
from app.routes.profile import profile_bp
from app.routes.notifications import notifications_bp

# Initialize extensions
jwt = JWTManager()

def create_app(config_name: str = "development") -> Flask:
    """
    Application Factory Pattern for modular Flask app setup.
    """
    app = Flask(__name__)
    
    # Load configuration settings
    app.config.from_object(config_by_name[config_name])
    
    # Bind JWT Extension
    jwt.init_app(app)
    
    # Register global REST error handling middleware
    register_error_handlers(app)
    
    # Register individual blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(students_bp)
    app.register_blueprint(attendance_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(notifications_bp)
    
    app_logger.info(f"Flask Application factory completed. Configuration loaded: {config_name}")
    
    return app
