import React, { useEffect, useState } from 'react';
import AutocompleteSelect from './AutocompleteSelect';
import ArticleDisplay from './ArticleDisplay';
import './css/app.css';

function App() {
  const [searchItems, setSearchItems] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setResults({});
    const query = searchItems.join('&');
    const getArt = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/art?${query}`);
        const data = await response.json();
        setResults(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    getArt();
    }, [searchItems]);
  
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2>Select keywords</h2>
        <div className='select'>
          <AutocompleteSelect onSelectionChange={setSearchItems} selectedItems={searchItems} />
        </div>
      </div>
      <div className='table'>
        <ArticleDisplay data={results} loading={loading} addToSearch={setSearchItems} />
      </div>
    </>
  );
}

export default App;
