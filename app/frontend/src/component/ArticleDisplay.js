import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import './css/table.css';
import { customStyles, columns, conditionalRowStyles } from './customTable';
import ExpandableComponent from './ExpandableComponent';

function ArticleDisplay({addToSearch, searchItems }) {
    const [resetPagination, setResetPagination] = useState(false);
    const [rows, setRows] = useState([]);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setData({});
    const query = searchItems.join('&');
    const getArt = async () => {
      try {
        const response = await fetch(`http://localhost:5000/v2/api/art?${query}`);
        const art = await response.json();
        setData(art);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    getArt();
    }, [searchItems]);

    useEffect(() => {
        if (Object.keys(data).length === 0) {
            setRows([]);
            return;
        }
    
        const { display_order, art_info, art2ent } = data;
        const generateRows = async () => {
            const newRows = display_order.map((id, idx) => {
                const info = art_info[id];
                const ents = art2ent[id];
                return {
                    id,
                    index: idx + 1,
                    title: info.title,
                    doi: info.doi,
                    url: info.url,
                    abstract: info.abstract,
                    entities: ents.join(', ')
                };
            });
            setRows(newRows);
        };
        
        generateRows();
        setResetPagination(prev => !prev);
    }, [data]);
    
    return (
        <DataTable
            columns={columns}
            data={rows}
            customStyles={customStyles}
            pagination
            expandableRows
            expandableRowsComponent={(row) => (
                <ExpandableComponent data={row.data} addToSearch={addToSearch} />
            )}
            highlightOnHover
            expandOnRowClicked
            paginationResetDefaultPage={resetPagination}
            conditionalRowStyles={conditionalRowStyles}
            progressPending={loading}
            progressComponent={<div className='loader'></div>}
        />
    );
}

export default ArticleDisplay;
