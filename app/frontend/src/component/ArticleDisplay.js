import React from 'react';
import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import './css/table.css';

const customStyles = {
    headCells: {
        style: {
            fontSize: '16px',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif'
        },
    },
    cells: {
        style: {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif'
        },
    },
    rows: {
        highlightOnHoverStyle: {
            backgroundColor: '#d4f2ff',
        }
    }
};
const columns = [
    { name: 'Title', 
        selector: row => row.title,
        wrap: true 
    },
    { name: 'Links',
        cell: row => 
        <>
            <a href={row.url} target="_blank" rel="noreferrer noopener">Scopus</a>  
            <a href={gsLink(row.title)} target="_blank" rel="noreferrer noopener">Google Scholar</a>   
            <a href={'https://doi.org/' + row.doi} target="_blank" rel="noreferrer noopener">DOI</a>
        </>,
        width: '250px',
    },
    { name: 
        'Entities', selector: row => row.entities,
        wrap: true,
    }
];
const conditionalRowStyles = [
    {
        when: row => row.index % 2 === 0,
        style: {
            backgroundColor: '#ffffff',
        },
    },
    {
        when: row => row.index % 2 !== 0,
        style: {
            backgroundColor: '#f2f2f2',
        },
    },
];

function gsLink(title) {
    const baseUrl = 'https://scholar.google.com/scholar?q=';
    const formattedTitle = encodeURIComponent(title);
    return `${baseUrl}${formattedTitle}`;
}
async function related_ent(art_id) {
    try {
        const response = await fetch(`http://localhost:5000/api/art/${art_id}/related_ent`);
        const rel_ent = await response.json();
        return rel_ent.join(', ');
    } catch (err) {
        console.error('Error fetching data:', err);
        return '';
    }
}

function ArticleDisplay({ data }) {
    console.log('ArticleDisplay:');
    const [resetPagination, setResetPagination] = useState(false);
    const [rows, setRows] = useState([]);
    useEffect(() => {
        if (Object.keys(data).length === 0) return;
    
        const { display_order, art_info, art2ent } = data;
        const generateRows = async () => {
            const newRows = await Promise.all(display_order.map(async (id, idx) => {
                const info = art_info[id];
                const ents = art2ent[id];
                return {
                    id,
                    index: idx + 1,
                    title: info.title,
                    doi: info.doi,
                    url: info.url,
                    abstract: info.abstract,
                    entities: ents.join(', '),
                    rel_ent: await related_ent(id)
                };
            }));
            setRows(newRows);
        };
    
        generateRows();
        setResetPagination(prev => !prev);
    }, [data]);
    

    const ExpandableComponent = ({ data }) => (
        <div style={{ padding: '1rem', backgroundColor: data.index % 2 === 0 ? '#ffffff' : '#f2f2f2' }}>
            <div>
                <strong>Related entities:</strong>
                <p>{data.rel_ent}</p>
            </div>
            <div>
                <strong>Abstract:</strong>
                <p>{data.abstract}</p>
            </div>
        </div>
    );

    return (
        <DataTable
            columns={columns}
            data={rows}
            customStyles={customStyles}
            pagination
            expandableRows
            expandableRowsComponent={ExpandableComponent}
            highlightOnHover
            expandOnRowClicked
            paginationResetDefaultPage={resetPagination}
            conditionalRowStyles={conditionalRowStyles}
        />
    );
}

export default ArticleDisplay;
