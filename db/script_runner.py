from script import createSchema, typeof_relation, sameas_relation, articles, mapping
from dbConn import dbConn

scripts = [
    createSchema,
    typeof_relation,
    sameas_relation,
    articles,
    mapping,
]

conn = dbConn(dotenv_path="../dbConn.env")
try:
    for script in scripts:
        print(f"Running: {script.__name__}")
        script.run(conn)
    conn.commit()
    print("Database setup completed successfully.")
except Exception as e:
    print(f"An error occurred: {e}\nRollback")
    conn.rollback()
finally:
    conn.close()