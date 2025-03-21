import psycopg2
import csv
import utils
import os

def insert_row(row):
    ''''Inserisce una riga di entità nel database e restituisce la lista degli id delle entità inserite'''
    id_lst = []
    for e in row:
        if not e: break
        cursor.execute("SELECT id FROM entities WHERE name = %s", (e,))
        id = cursor.fetchone()
        if id:
            id_lst.append(id)[0]
            continue
        cursor.execute("INSERT INTO entities (name) VALUES (%s) RETURNING id", (e,))
        id_lst.append(cursor.fetchone()[0])
    return id_lst


conn, cursor = utils.dbConn(dotenv_path="dbconn.env", search_path="agroann")
try:
    for file in os.listdir('data/entities/same_as'):
        file = os.path.join('data/entities/same_as', file)
        with open(file, mode='r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter=';')
            next(reader)
            for row in reader:
                row = [e.strip().lower() for e in row]
                id_lst = insert_row(row)
                for id in id_lst:
                    for sameas_id in id_lst:  
                        cursor.execute("INSERT INTO relationship (type, id1, id2) VALUES (%s, %s, %s) RETURNING id1 id2", ('same_as', sameas_id, id)) 

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