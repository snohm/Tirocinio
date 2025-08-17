import { useState, useEffect } from 'react';

export default function useFetch(url) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
    url = `http://localhost:5000${url}`;
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
    }, [url]);
    return { data, loading };
}