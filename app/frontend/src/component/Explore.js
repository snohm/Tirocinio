import { useState } from 'react';
import AutocompleteSelect from './AutocompleteSelect';
import ArticleDisplay from './ArticleDisplay';
import '../styles/explore.css';

export default function Explore() {
  const [searchItems, setSearchItems] = useState([]);

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2>Agricultural Papers Finder</h2>
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
