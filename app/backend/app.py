from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from collections import defaultdict
import json
import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from utils.utils import dbConn, get_ent_ids

conn, cursor = dbConn(dotenv_path="../../dbconn.env", search_path="agroann")

def get_art_by_ent(ent: list[str], keys: list[int] = list()) -> dict[int, list[str]]:
    '''Restituisce un dizionario ordinato in modo non crescente 
    in base alla lunghezza della lista di entità associate a ciascun articolo'''
    art2ent = defaultdict(list)
    if keys == []: name2id = get_ent_ids(ent)
    else: name2id = get_derivated_ent(ent)
    for name, id in name2id.items():
        cursor.execute("SELECT id_articles FROM mapping WHERE id_entities = %s", (id,))
        art_ids = cursor.fetchall()
        for art_id in art_ids:
            if art_id[0] not in keys:
                art2ent[art_id[0]].append(name)
    return dict(sorted(art2ent.items(), key=lambda item: len(item[1]), reverse=True))

def get_art_info(art_ids: list[int]) -> dict[int, dict]:
    '''Restituisce, per ogni articolo, le informazioni associate'''
    art_info = defaultdict(dict)
    for id in art_ids:
        cursor.execute("SELECT title, abstract, doi, url FROM articles WHERE id = %s", (id,))
        info = cursor.fetchone()
        art_info[id] = {
            "title": info[0],
            "abstract": info[1],
            "doi": info[2],
            "url": info[3]
        }
    return dict(art_info)

def get_derivated_ent(ent: list[str]) -> dict[str, int]:
    '''Restituisce le entità derivate dalle relazioni 'type_of' e 'same_as' '''
    rel_ent = list()
    ent = [e.strip().lower() for e in ent]
    for e in ent:
        cursor.execute("SELECT * FROM get_same_as(%s)", (e,))
        rel_ent.append(cursor.fetchall())
        cursor.execute("SELECT * FROM get_type_of(%s)", (e,))
        rel_ent.append(cursor.fetchall())
    res = [tuple for lst in rel_ent for tuple in lst]
    return dict(res) 
              

app = Flask(__name__)
CORS(app)

@app.get("/")
def index():
    param = list(request.args.to_dict().keys())
    try:
        art2ent = get_art_by_ent(param)
    except ValueError as e:
        return jsonify(str(e)), 404
    der_art = get_art_by_ent(param, keys=list(art2ent.keys()))
    art2ent.update(der_art)
    art_info = get_art_info(list(art2ent.keys()))
    return Response(json.dumps({"art2ent": art2ent, "art_info": art_info}), mimetype="application/json"), 200

if __name__ == "__main__":
    app.run(debug=True)