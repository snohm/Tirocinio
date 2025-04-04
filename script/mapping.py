import json
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from utils.utils import dbConn

conn, cursor = dbConn(dotenv_path="dbconn.env", search_path="agroann")

with open('data/entities/mapping/ent2art.json', 'r', encoding='utf-8') as f:
    entries = json.load(f)
    for ent, art_id_lst in entries.items():
        cursor.execute("SELECT id FROM entities WHERE name = %s", (ent.strip().lower(),))
        id_ent = cursor.fetchone()
        for id_art in art_id_lst:
            cursor.execute("INSERT INTO mapping (id_articles, id_entities) VALUES (%s, %s)", (id_art, id_ent))

conn.commit()
cursor.close()
conn.close()

