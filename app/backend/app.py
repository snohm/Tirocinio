from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.functions import get_art_by_ent, get_art_info
from utils.dbPool import dbPool

app = Flask(__name__)
CORS(app)

pool = dbPool(2, 5, '../../dbConn.env')
search_path = 'agroann'

@app.get("/api/ent")
def ent():
    conn = pool.getconn()
    cursor = conn.cursor()
    cursor.execute(f'SET search_path TO {search_path}')
    param = request.args.get('ent_name')
    if not param: param = ''
    cursor.execute("SELECT name FROM entities WHERE name ILIKE %s ORDER BY name ", ('%'+ param + '%',))
    ent = cursor.fetchall()
    cursor.close()
    pool.putconn(conn)
    return jsonify([e[0] for e in ent]), 200

@app.get("/api/art")
def art_v2():
    conn = pool.getconn()
    cursor = conn.cursor()
    cursor.execute(f'SET search_path TO {search_path}')
    related = request.args.get('related', default=False, type=bool)
    param = list(request.args.to_dict().keys())
    if related:
        param.remove('related')
    try:
        art2ent = get_art_by_ent(cursor, param)
    except ValueError as e:
        return jsonify(str(e)), 404
    if related:
        art2ent = get_art_by_ent(cursor, param, keys=list(art2ent.keys()))
    art_info = get_art_info(cursor, list(art2ent.keys()))
    cursor.close()
    pool.putconn(conn)
    return jsonify({"display_order": list(art2ent.keys()),"art2ent": art2ent, "art_info": art_info}), 200

@app.get("/api/art/<art_id>/related_ent")
def related_ent(art_id):
    conn = pool.getconn()
    cursor = conn.cursor()
    cursor.execute(f'SET search_path TO {search_path}')
    cursor.execute("SELECT e.name FROM mapping m JOIN entities e ON e.id = m.id_entities WHERE m.id_articles = %s", (art_id,))
    ent = cursor.fetchall()
    cursor.close()
    pool.putconn(conn)
    return jsonify([e[0] for e in ent]), 200

if __name__ == "__main__":
    app.run(debug=True)