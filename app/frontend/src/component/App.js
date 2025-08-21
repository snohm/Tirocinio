import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Explore from './Explore';
import AutocompleteSelect from './AutocompleteSelect';

export default function App() {
  const [searchItems, setSearchItems] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <AutocompleteSelect onSelectionChange={setSearchItems} selectedItems={searchItems} />
        } />
        <Route path="/explore" element={
          <Explore setSearchItems={setSearchItems} searchItems={searchItems} />
        } />
      </Routes>
    </BrowserRouter>
  );
}
