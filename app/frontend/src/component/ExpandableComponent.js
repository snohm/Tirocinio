import { gsLink } from './customTable';
import useFetch from '../hooks/useFetch';

export default function ExpandableComponent({ data, addToSearch }) {
    const { data: relatedEntities, loading } = useFetch(`/api/art/${data.id}/related_ent`);

    return (
        <div style={{ padding: '1rem', backgroundColor: data.index % 2 === 0 ? '#ffffff' : '#f2f2f2' }}>
            {window.innerWidth > 700 ? '' :
                <div>
                    <strong>Links:</strong>
                    <ul style={{ paddingLeft: '20px' }}>
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
                        Object.values(relatedEntities).map((ent, index) => (
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
