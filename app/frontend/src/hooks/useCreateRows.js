import { useState, useEffect } from "react";

export default function useCreateRows(art, startIdx) {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (Object.keys(art).length === 0) {
            setRows([]);
            return;
        }

        const { display_order, art_info, art2ent } = art;
        const newRows = display_order.map((id, idx) => {
            const info = art_info[id];
            const ents = art2ent[id];
            return {
                id,
                index: startIdx + idx + 1,
                title: info.title,
                doi: info.doi,
                url: info.url,
                abstract: info.abstract,
                entities: ents.join(', ')
            };
        });

        setRows(newRows);
    }, [art, startIdx]);

    return rows;
}
