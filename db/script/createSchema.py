import os
import sys
from tqdm import tqdm
import sqlparse

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../utils')))
from utils.dbConn import dbConn

conn, cursor = dbConn(dotenv_path="../dbconn.env")

with open("schema.sql", "r", encoding="utf-8") as f:
    sql_script = f.read()
    statements = sqlparse.split(sql_script)
    for stmt in tqdm(statements):
        stmt = stmt.strip()
        if stmt:
            cursor.execute(stmt)

conn.commit()
cursor.close()
conn.close()
