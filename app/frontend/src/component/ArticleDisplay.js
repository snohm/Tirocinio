import React from 'react';
import DataTable from 'react-data-table-component';

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
  };
  

function ArticleDisplay({ data }) {
    if (Object.keys(data).length === 0) {
        return;
    }
    const { display_order, art_info, art2ent } = data;
    const rows = display_order.map(id => {
        const info = art_info[id];
        const ents = art2ent[id] || [];
        return {
            id,
            title: info.title,
            doi: info.doi,
            url: info.url,
            abstract: info.abstract,
            entities: ents.join(', ')
        };
    });

    const columns = [
        { name: 'Title', 
            selector: row => row.title, 
            wrap: true },
        { name: 'DOI', selector: row => row.doi,
            width:'15%',
            hide: 'md'
        },
        { name: 'Link',
            selector: row => row.url,
            cell: row => <a href={row.url} target="_blank">Go to</a>,
            width:'10%'
        },
        { name: 
            'Entities', selector: row => row.entities, 
            wrap: true,
            hide:'sm'
        }
    ];

    const ExpandableComponent = ({ data }) => (
        <div style={{ padding: '1rem', background: '#f9f9f9' }}>
            <strong>Abstract:</strong>
            <p>{data.abstract}</p>
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
            striped
            expandOnRowClicked
        />
    );
}

export default ArticleDisplay;
