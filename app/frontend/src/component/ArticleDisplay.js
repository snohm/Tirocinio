import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import './css/table.css';
import { customStyles, columns, conditionalRowStyles } from './customTable';
import ExpandableComponent from './ExpandableComponent';
import useFetch from '../hooks/useFetch';

export default function ArticleDisplay({ addToSearch, searchItems }) {
    const [resetPagination, setResetPagination] = useState(false);
    const [rows, setRows] = useState([]);
    const { data: art, loading } = useFetch(`/v2/api/art?${searchItems.join('&')}`);

    useEffect(() => {
        if (Object.keys(art).length === 0) {
            setRows([]);
            return;
        }

        const { display_order, art_info, art2ent } = art;
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
    }, [art]);

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
