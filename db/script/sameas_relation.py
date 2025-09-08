from collections import defaultdict
import csv
import os
from tqdm import tqdm 

def insert_entities(cursor, ent):
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

def run(conn):
    cursor = conn.cursor() 
    id_pairs = defaultdict(bool)
    for file in os.listdir('data/entities/same_as'):
        tqdm.write(f"\tProcessing: {file}")
        file = os.path.join('data/entities/same_as', file)
        with open(file, mode='r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter=';')
            next(reader)
            for row in tqdm(reader):
                if not row: break
                id_lst = insert_entities(cursor, row)
                for id in id_lst:
                    for sameas_id in id_lst:  
                        if id_pairs.get((id, sameas_id)): continue
                        id_pairs[(id, sameas_id)] = True
                        cursor.execute("INSERT INTO relationship (type, id1, id2) VALUES (%s, %s, %s)", ('same_as', sameas_id, id)) 
    cursor.close()
