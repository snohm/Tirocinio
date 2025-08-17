import { useState, useEffect } from 'react';

export default function useFetch(path) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const url = `http://localhost:5000${path}`;
        setData({});
        setLoading(true);
        const getArt = async () => {
            try {
                const response = await fetch(url);
                const art = await response.json();
                setData(art);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        getArt();
    }, [path]);
    return { data, loading };
}