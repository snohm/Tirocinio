import React, { useState, useEffect } from 'react';
import { gsLink } from './customTable';

async function related_ent(art_id) {
    try {
        const response = await fetch(`http://localhost:5000/api/art/${art_id}/related_ent`);
        return await response.json();
    } catch (err) {
        console.error('Error fetching data:', err);
        return '';
    }
}

function ExpandableComponent({ data, addToSearch }) {
    const [relatedEntities, setRelatedEntities] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchRelatedEntities = async () => {
            try {
                const relEnt = await related_ent(data.id);
                if (isMounted) {
                    setRelatedEntities(relEnt);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error fetching related entities:", err);
                    setRelatedEntities("Errore nel caricamento.");
                    setLoading(false);
                }
            }
        };

        fetchRelatedEntities();
        return () => { isMounted = false; };
    }, [data.id]);

    return (
        <div style={{ padding: '1rem', backgroundColor: data.index % 2 === 0 ? '#ffffff' : '#f2f2f2' }}>
            {window.innerWidth > 700 ? '':
            <div>
                <strong>Links:</strong>
                <ul style={{paddingLeft: '20px'}}>
                    <li><a href={data.url} target="_blank" rel="noreferrer noopener">Scopus</a>  </li>
                    <li><a href={gsLink(data.title)} target="_blank" rel="noreferrer noopener">Google Scholar</a>   </li>
                    <li><a href={'https://doi.org/' + data.doi} target="_blank" rel="noreferrer noopener">DOI</a></li>
                </ul>
            </div>
            }
            <div>
                <strong>Related entities:</strong>
                <p>
                {loading ? "Loading..." : 
                    relatedEntities.map((ent, index) => (
                        <span
                            className='clickable'
                            onClick={() => addToSearch(prev => prev.includes(ent) ? prev : [...prev, ent])}
                            key={index}
                        >
                            {ent}{index < relatedEntities.length - 1 ? ', ' : ''}
                        </span>
                    ))
                }
                </p>
            </div>
            <div>
                <strong>Abstract:</strong>
                <p>{data.abstract}</p>
            </div>
        </div>
    );
}

export default ExpandableComponent;
