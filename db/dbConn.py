import time
import psycopg2
import os
from dotenv import load_dotenv

def dbConn(dotenv_path=""):
   load_dotenv(dotenv_path=dotenv_path)
   for i in range(5):
      try:
         conn = psycopg2.connect(
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT'),
            dbname=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD')
         )
         return conn
      except psycopg2.OperationalError as e:
         print(f"Attempt {i+1}/5: Unable to connect to the database. Error: {e}")
         time.sleep(3)
   raise Exception("Max retries reached. Unable to connect to the database.")