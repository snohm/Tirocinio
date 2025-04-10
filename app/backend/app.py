from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import json
import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from utils.backend import get_art_by_ent, get_art_info
from utils.dbConn import dbConn

app = Flask(__name__)
CORS(app)

@app.get("/")
def index():
    conn, cursor = dbConn('../../dbConn.env', search_path="agroann")
    param = list(request.args.to_dict().keys())
    try:
        art2ent = get_art_by_ent(cursor, param)
    except ValueError as e:
        return jsonify(str(e)), 404
    der_art = get_art_by_ent(cursor, param, keys=list(art2ent.keys()))
    art2ent.update(der_art)
    art_info = get_art_info(cursor, list(art2ent.keys()))
    conn.close()
    cursor.close()
    return Response(json.dumps({"art2ent": art2ent, "art_info": art_info}), mimetype="application/json"), 200

if __name__ == "__main__":
    app.run(debug=True)