import psycopg2
import os
from dotenv import load_dotenv

def dbConn(dotenv_path="", search_path="public"):
   load_dotenv(dotenv_path=dotenv_path)
   conn = psycopg2.connect(
      host=os.getenv('DB_HOST'),
      port=os.getenv('DB_PORT'),
      dbname=os.getenv('DB_NAME'),
      user=os.getenv('DB_USER'),
      password=os.getenv('DB_PASSWORD')
   )
   cursor = conn.cursor()
   cursor.execute(f"SET search_path TO {search_path};")
   
   return conn, cursor

def get_ent_ids(ent: list[str]):
   conn, cursor = dbConn(dotenv_path="dbconn.env", search_path="agroann")
   id_lst = []
   ent = [e.strip().lower() for e in ent]
   for e in ent:
       cursor.execute("SELECT id FROM entities WHERE name = %s", (e,))
       id = cursor.fetchone()
       assert id
       id_lst.append(id[0])
   return id_lst