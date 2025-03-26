import utils
import json

def get_id_ent(ent):
    id_lst = []
    ent = [e.strip().lower() for e in ent]
    for e in ent:
        cursor.execute("SELECT id FROM entities WHERE name = %s", (e,))
        id = cursor.fetchone()
        assert id
        id_lst.append(id[0])
    return id_lst

conn, cursor = utils.dbConn(dotenv_path="dbconn.env", search_path="agroann")

with open('data/entities/mapping/art2ent.json', 'r', encoding='utf-8') as f:
    entries = json.load(f)
    for id_art, ent_lst in entries.items():
        id_lst = get_id_ent(ent_lst)
        for id_ent in id_lst:
            cursor.execute("INSERT INTO mapping (id_articles, id_entities) VALUES (%s, %s)", (id_art, id_ent))

with open('data/entities/mapping/ent2art.json', 'r', encoding='utf-8') as f:
    entries = json.load(f)
    for ent, art_id_lst in entries.items():
        cursor.execute("SELECT id FROM entities WHERE name = %s", (ent,))
        id_ent = cursor.fetchone()
        assert id_ent
        for id_art in art_id_lst:
            cursor.execute("INSERT INTO mapping (id_articles, id_entities) VALUES (%s, %s)", (id_art, id_ent))

conn.commit()
cursor.close()
conn.close()

