import {useState} from 'react';
import AutocompleteSelect from './AutocompleteSelect';
import ArticleDisplay from './ArticleDisplay';
import './css/app.css';

function App() {
  const [searchItems, setSearchItems] = useState([]);
  
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2>Select keywords</h2>
        <div className='select'>
          <AutocompleteSelect onSelectionChange={setSearchItems} selectedItems={searchItems} />
        </div>
      </div>
      <div className='table'>
        <ArticleDisplay addToSearch={setSearchItems} searchItems={searchItems} />
      </div>
    </>
  );
}

export default App;
