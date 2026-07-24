import logging
import os
from logging.handlers import RotatingFileHandler
from app.config.config import Config

def setup_logger(name="student_attendance_logger"):
    """
    Configure and return a standard logger that outputs to both a rotating file
    and the console, conforming to the LOG_LEVEL and LOG_FILE set in config.
    """
    logger = logging.getLogger(name)
    
    # Avoid duplicate handlers if setup is called multiple times
    if not logger.handlers:
        log_level = getattr(logging, Config.LOG_LEVEL, logging.INFO)
        logger.setLevel(log_level)

        # Standard log message layout
        formatter = logging.Formatter(
            "[%(asctime)s] %(levelname)s in %(module)s (line: %(lineno)d): %(message)s"
        )

        # Console Output Handler
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

        # File Output Handler (Rotating)
        try:
            # Ensure the directory for the log file exists
            log_dir = os.path.dirname(Config.LOG_FILE)
            if log_dir:
                os.makedirs(log_dir, exist_ok=True)
                
            file_handler = RotatingFileHandler(
                Config.LOG_FILE,
                maxBytes=5 * 1024 * 1024,  # 5MB rotating file size
                backupCount=3,
                encoding="utf-8"
            )
            file_handler.setFormatter(formatter)
            logger.addHandler(file_handler)
        except Exception as e:
            # If log file initialization fails, default to console-only logging
            logger.warning(f"Failed to initialize file logging: {str(e)}")

    return logger

# Single instances of logger for reuse across the app
app_logger = setup_logger()
