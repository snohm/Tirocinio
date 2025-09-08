import time
import psycopg2
import psycopg2.pool
import os
from dotenv import load_dotenv

def dbPool(min_conn: int, max_conn: int, dotenv_path=""):
   load_dotenv(dotenv_path=dotenv_path)
   for i in range(5):
      try:
         pool = psycopg2.pool.SimpleConnectionPool(
            minconn=min_conn,
            maxconn=max_conn,
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT'),
            dbname=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD')
         )
         return pool
      except psycopg2.OperationalError as e:
         print(f"Attempt {i+1}/5: Unable to connect to the database. Error: {e}")
         time.sleep(3)
   raise Exception("Max retries reached. Unable to connect to the database.")