import os
import psycopg2
from psycopg2 import pool
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Global connection pool
connection_pool = None

def get_db_pool():
    """Initializes and returns the database connection pool."""
    global connection_pool
    if connection_pool is None:
        try:
            print("Initializing database connection pool...")
            connection_pool = psycopg2.pool.SimpleConnectionPool(
                minconn=1,
                maxconn=10,
                host=os.getenv('DB_HOST'),
                port=os.getenv('DB_PORT'),
                dbname=os.getenv('DB_NAME'),
                user=os.getenv('DB_USER'),
                password=os.getenv('DB_PASSWORD')
            )
            print("Database connection pool initialized successfully.")
        except psycopg2.OperationalError as e:
            print(f"Error connecting to the database: {e}")
            # In a real app, you might want to exit or handle this more gracefully
            raise e
    return connection_pool

def get_db_connection():
    """Gets a connection from the pool."""
    db_pool = get_db_pool()
    return db_pool.getconn()

def release_db_connection(conn):
    """Releases a connection back to the pool."""
    db_pool = get_db_pool()
    db_pool.putconn(conn)

def init_db():
    """
    Initializes the database by creating tables from schema.sql.
    This is intended for first-time setup.
    """
    print("Attempting to initialize the database...")
    conn = None
    try:
        # Get a connection directly, as the pool might not be for the default 'postgres' db
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT'),
            dbname="postgres", # Connect to the default db to create a new one
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD')
        )
        conn.autocommit = True
        cursor = conn.cursor()

        db_name = os.getenv('DB_NAME')

        # Check if database exists
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'")
        if not cursor.fetchone():
            print(f"Database '{db_name}' does not exist. Creating...")
            cursor.execute(f"CREATE DATABASE {db_name}")
            print(f"Database '{db_name}' created.")
        else:
            print(f"Database '{db_name}' already exists.")

        cursor.close()
        conn.close()

        # Connect to the actual database to create schema
        conn = get_db_connection()
        cursor = conn.cursor()

        print("Reading schema.sql...")
        with open('schema.sql', 'r') as f:
            sql_script = f.read()

        print("Executing schema.sql to create tables...")
        cursor.execute(sql_script)

        conn.commit()
        print("Database initialized successfully with tables.")

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error while initializing database: {error}")
    finally:
        if conn is not None:
            release_db_connection(conn)

if __name__ == '__main__':
    # This allows running `python db.py` to initialize the database
    init_db()
