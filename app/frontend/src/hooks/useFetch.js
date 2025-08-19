import { useState, useEffect } from 'react';

export default function useFetch(path) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const url = `http://localhost:5000${path}`;
        setData({});
        setLoading(true);
        const getData = async () => {
            try {
                const response = await fetch(url);
                const res = await response.json();
                setData(res);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [path]);
    return { data, loading };
}