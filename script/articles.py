import utils
import os
import rispy

conn, cursor = utils.dbConn(dotenv_path="dbconn.env", search_path="agroann")

for file in os.listdir('data/articles'):
    file = os.path.join('data/articles', file)
    with open(file, 'r', encoding='utf-8') as f:
        entries = rispy.load(f)
        for art in entries:
            if 'abstract' in art:
                cursor.execute("INSERT INTO articles (doi, title, abstract, url) VALUES (%s, %s, %s, %s)", (art.get('doi'), art.get('title'), art.get('abstract'), art.get('urls')))

conn.commit()
cursor.close()
conn.close()