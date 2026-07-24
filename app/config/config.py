import os
from pathlib import Path
from dotenv import load_dotenv

# Base Directory of the Project
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load environment variables from .env file
load_dotenv(os.path.join(BASE_DIR, '.env'))

class Config:
    """Base Configuration class."""

    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-change-in-production")

    # JWT Settings
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-key-change-in-production")
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_MINUTES", "60")) * 60

    # Database Configuration
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = int(os.getenv("DB_PORT", "3306"))
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_NAME = os.getenv("DB_NAME")
    DB_CHARSET = os.getenv("DB_CHARSET", "utf8mb4")

    # File Upload Settings
    UPLOAD_FOLDER = os.path.join(BASE_DIR, os.getenv("UPLOAD_FOLDER", "app/uploads"))
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH_MB", "5")) * 1024 * 1024
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

    # Logging Configuration
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
    LOG_FILE = os.path.join(BASE_DIR, os.getenv("LOG_FILE", "app.log"))

class DevelopmentConfig(Config):
    """Development environment configurations."""
    DEBUG = True
    TESTING = False

class TestingConfig(Config):
    """Testing environment configurations."""
    DEBUG = True
    TESTING = True
    # Fast token expiry for testing purposes
    JWT_ACCESS_TOKEN_EXPIRES = 300

class ProductionConfig(Config):
    """Production environment configurations."""
    DEBUG = False
    TESTING = False

# Mapping configuration envs
config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig
}
