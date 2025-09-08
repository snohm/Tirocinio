from tqdm import tqdm
import sqlparse

def run(conn):
    cursor = conn.cursor()
    with open("schema.sql", "r", encoding="utf-8") as f:
        sql_script = f.read()
        statements = sqlparse.split(sql_script)
        for stmt in tqdm(statements):
            stmt = stmt.strip()
            if stmt:
                cursor.execute(stmt)
    cursor.execute("SET search_path TO agroann;")
    cursor.close()