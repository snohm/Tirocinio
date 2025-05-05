import React, { useEffect, useState } from 'react';
import AutocompleteSelect from './AutocompleteSelect';
import ArticleDisplay from './ArticleDisplay';

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
        <div style={{ width: '50%', alignItems: 'center', margin: 'auto' }}>
          <AutocompleteSelect onSelectionChange={setSearchItems} selectedItems={searchItems} />
        </div>
      </div>
      <div style={{ width: '90%', alignItems: 'center', margin: 'auto' }}>
        <ArticleDisplay data={results} loading={loading} addToSearch={setSearchItems} />
      </div>
    </>
  );
}

export default App;
