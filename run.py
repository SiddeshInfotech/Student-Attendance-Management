import os
import pymysql

from app.main import app
from app.config.config import Config


def check_database_connection():
    """Check MySQL database connection."""
    try:
        connection = pymysql.connect(
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME,
            charset=Config.DB_CHARSET,
            connect_timeout=10
        )

        print("\n===================================")
        print("✅ Database connected successfully!")
        print(f"Host     : {Config.DB_HOST}")
        print(f"Database : {Config.DB_NAME}")
        print(f"User     : {Config.DB_USER}")
        print("===================================\n")

        connection.close()

    except Exception as e:
        print("\n===================================")
        print("❌ Database connection failed!")
        print(f"Error: {e}")
        print("===================================\n")


if __name__ == "__main__":
    # Check database connection before starting Flask
    check_database_connection()

    # Fetch parameters from environment variables
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "5000"))

    # Run the server
    app.run(host=host, port=port)