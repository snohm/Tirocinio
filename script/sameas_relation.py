from collections import defaultdict
import csv
import utils
import os

def insert_entities(ent):
    id_lst = []
    ent = [e.strip().lower() for e in ent]
    for e in ent:
        if not e: break
        cursor.execute("SELECT id FROM entities WHERE name = %s", (e,))
        id = cursor.fetchone()
        if id:
            id_lst.append(id[0])
            continue
        cursor.execute("INSERT INTO entities (name) VALUES (%s) RETURNING id", (e,))
        id_lst.append(cursor.fetchone()[0])
    return id_lst


conn, cursor = utils.dbConn(dotenv_path="dbconn.env", search_path="agroann")

id_pairs = defaultdict(bool)
for file in os.listdir('data/entities/same_as'):
    file = os.path.join('data/entities/same_as', file)
    with open(file, mode='r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter=';')
        next(reader)
        for row in reader:
            if not row: break
            id_lst = insert_entities(row)
            for id in id_lst:
                for sameas_id in id_lst:  
                    if id_pairs.get((id, sameas_id)): continue
                    id_pairs[(id, sameas_id)] = True
                    cursor.execute("INSERT INTO relationship (type, id1, id2) VALUES (%s, %s, %s)", ('same_as', sameas_id, id)) 

conn.commit()
cursor.close()
conn.close()
