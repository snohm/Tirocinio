from collections import defaultdict

def get_ent_ids(cursor, ent: list[str]) -> dict[str, int]:
    '''Restituisce le coppie nome - id delle entità passate come parametro.'''
    ent2id = defaultdict(int)
    ent = [e.strip().lower() for e in ent]
    for e in ent:
        cursor.execute("SELECT id FROM entities WHERE name = %s", (e,))
        id = cursor.fetchone()
        if not id:
          raise ValueError(f"Entity '{e}' not found in the database.")
        ent2id[e] = id[0]
    return dict(ent2id)

def get_derivated_ent(cursor, ent: list[str]) -> dict[str, int]:
    '''Restituisce le entità derivate dalle relazioni 'type_of' e 'same_as' e il loro id.'''
    rel_ent = list()
    ent = [e.strip().lower() for e in ent]
    for e in ent:
        cursor.execute("SELECT * FROM get_same_as(%s)", (e,))
        rel_ent.append(cursor.fetchall())
        cursor.execute("SELECT * FROM get_type_of(%s)", (e,))
        rel_ent.append(cursor.fetchall())
    res = [tuple for lst in rel_ent for tuple in lst]
    return dict(res)

def get_art_by_ent(cursor, ent: list[str], keys: list[int] = None) -> dict[int, list[str]]:
    '''Restituisce un dizionario ordinato, in modo non crescente, secondo
    il numero di entità (ent) associate a ciascun articolo.
    Se keys è specificato, verrano considerate le entità derivate di quelle
    passate come paramero, inoltre gli articoli contenuti in keys saranno esclusi dal risultato.'''
    art2ent = defaultdict(list)
    if keys is None: 
        name2id = get_ent_ids(cursor, ent)
        keys = list()
    else: 
        name2id = get_derivated_ent(cursor, ent)
    for name, id in name2id.items():
        cursor.execute("SELECT id_articles FROM mapping WHERE id_entities = %s", (id,))
        art_ids = cursor.fetchall()
        for art_id in art_ids:
            if art_id[0] not in keys:
                art2ent[art_id[0]].append(name)
    return dict(sorted(art2ent.items(), key=lambda item: len(item[1]), reverse=True))

def get_art_info(cursor, art_ids: list[int]) -> dict[int, dict]:
    '''Restituisce per ogni articolo, presente in art_ids, le relative informazioni.'''
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