import csv
import os
from tqdm import tqdm

def run(conn):
    cursor = conn.cursor()
    for file in os.listdir('data/entities/type_of'):
        tqdm.write(f"\tProcessing: {file}")
        file = os.path.join('data/entities/type_of', file)
        with open(file, mode='r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter=';')
            next(reader)
            for row in tqdm(reader):
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
    cursor.close()
