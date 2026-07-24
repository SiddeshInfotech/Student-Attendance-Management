import os
from app import create_app

# Instantiate the app instance using FLASK_ENV or default to development configuration
env_name = os.getenv("FLASK_ENV", "development")
app = create_app(env_name)

if __name__ == "__main__":
    # Exposes app execution for gunicorn / local direct execution
    app.run(
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "5000")),
        debug=app.config.get("DEBUG", False)
    )
