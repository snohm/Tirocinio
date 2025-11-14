import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import '../styles/table.css';
import { customStyles, columns, conditionalRowStyles } from './customTable';
import ExpandableComponent from './ExpandableComponent';
import useFetch from '../hooks/useFetch';
import useCreateRows from '../hooks/useCreateRows';

export default function ArticleDisplay({ addToSearch, searchItems }) {
    const [resetPagination, setResetPagination] = useState(false);
    const { data: art, loading } = useFetch(`/api/art?${searchItems.join('&')}`);
    const { data: der_art } = useFetch(`/api/art?related=true&${searchItems.join('&')}`);

    const rows = useCreateRows(art, 0);
    const derRows = useCreateRows(der_art, rows.length);

    useEffect(() => {
        setResetPagination(prev => !prev);
    }, [rows]);

    return (
        <DataTable
            columns={columns}
            data={[...rows, ...derRows]}
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
