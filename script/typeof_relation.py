import psycopg2
import csv
import utils
import os

conn, cursor = utils.dbConn(dotenv_path="dbconn.env", search_path="agroann")
try:
    for file in os.listdir('data/entities/type_of'):
        file = os.path.join('data/entities/type_of', file)
        with open(file, mode='r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter=';')
            next(reader)
            for row in reader:
                row = [e.strip().lower() for e in row]
                parent_id = None
                for ent in row:
                    if not ent : break
                    cursor.execute("SELECT id FROM entities WHERE name = %s", (ent,))
                    id = cursor.fetchone()
                    if id: 
                        parent_id = id
                        continue    
                    cursor.execute("INSERT INTO entities (name) VALUES (%s) RETURNING id", (ent,))
                    id = cursor.fetchone()
                    cursor.execute("INSERT INTO relationship (type, id1, id2) VALUES (%s, %s, %s)", ('type_of', parent_id, id)) 
                    parent_id = id

    conn.commit()
    print("Dati inseriti correttamente!")

except psycopg2.Error as e:
    print(f"Errore nell'inserimento dati: {e}")
    conn.rollback()
except Exception as e:
    print(e)

finally:
    cursor.close()
    conn.close()