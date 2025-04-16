import React, { useEffect, useState } from 'react';
import AutocompleteSelect from './AutocompleteSelect';
import ArticleDisplay from './ArticleDisplay';

function App() {
  const [searchItems, setSearchItems] = useState([]);
  const [results, setResults] = useState({});

  useEffect(() => {
    const query = searchItems.join('&');
    fetch(`http://localhost:5000/api/art?${query}`)
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((err) => console.error('Error fetching data:', err)); 
    }, [searchItems]);
  
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2>Select keywords</h2>
        <div style={{ width: '50%', alignItems: 'center', margin: 'auto' }}>
          <AutocompleteSelect onSelectionChange={setSearchItems} />
        </div>
      </div>
      <div style={{ width: '90%', alignItems: 'center', margin: 'auto' }}>
        <ArticleDisplay data={results} />
      </div>
    </>
  );
}

export default App;
