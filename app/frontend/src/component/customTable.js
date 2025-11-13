export function gsLink(title) {
    const baseUrl = 'https://scholar.google.com/scholar?q=';
    const formattedTitle = encodeURIComponent(title);
    return `${baseUrl}${formattedTitle}`;
}

export const customStyles = {
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
export const columns = [
    { name: 'Title', 
        selector: row => row.title,
        wrap: true 
    },
    { name: 'Links',
        cell: row => 
        <>
            { row.url && <a href={row.url} target="_blank" rel="noreferrer noopener">Scopus</a> }
            { row.title && <a href={gsLink(row.title)} target="_blank" rel="noreferrer noopener">Google Scholar</a> }
            { row.doi && <a href={'https://doi.org/' + row.doi} target="_blank" rel="noreferrer noopener">DOI</a> }  
        </>,
        width: '250px',
        hide: 700,
    },
    { name: 
        'Entities', selector: row => row.entities,
        wrap: true,
        hide: 900,
    }
];
export const conditionalRowStyles = [
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