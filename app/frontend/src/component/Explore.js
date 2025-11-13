import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AutocompleteSelect from './AutocompleteSelect';
import ArticleDisplay from './ArticleDisplay';
import '../styles/explore.css';

export default function Explore({ setSearchItems, searchItems }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (searchItems.length === 0) {
      navigate('/');
    }
  }, [searchItems, navigate]);

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2>AgriPapers</h2>
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
