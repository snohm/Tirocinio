import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Explore from './Explore';
import AutocompleteSelect from './AutocompleteSelect';
import '../styles/app.css';
import '../styles/explore.css';

export default function App() {
  const [searchItems, setSearchItems] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className='center'>
            <p className='title'>AgriPapers</p>
            <AutocompleteSelect onSelectionChange={setSearchItems} selectedItems={searchItems} />
          </div>
        } />
        <Route path="/explore" element={
          <Explore setSearchItems={setSearchItems} searchItems={searchItems} />
        } />
      </Routes>
    </BrowserRouter>
  );
}
