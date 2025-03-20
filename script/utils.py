import psycopg2
import os
from dotenv import load_dotenv

def dbConn(dotenv_path="", search_path="public"):
    load_dotenv(dotenv_path=dotenv_path)
    try:
        conn = psycopg2.connect(
           host=os.getenv('DB_HOST'),
           port=os.getenv('DB_PORT'),
           dbname=os.getenv('DB_NAME'),
           user=os.getenv('DB_USER'),
           password=os.getenv('DB_PASSWORD')
        )
        cursor = conn.cursor()
        cursor.execute(f"SET search_path TO {search_path};")

        print("Connessione al database riuscita!")
        return conn, cursor

    except Exception as e:
        print(f"Errore di connessione: {e}")
        exit()