import React from 'react';
import AsyncSelect from 'react-select/async';

async function loadOptions(inputValue){
    if (inputValue.length < 2) return [];

    try {
      const res = await fetch(`http://localhost:5000/api/ent?ent_name=${encodeURIComponent(inputValue)}`);
      const data = await res.json();
      return data.map((item) => ({
        label: item,
        value: item
      }));
    } catch (err) {
      console.error('Err fetching entities:', err);
      return [];
    }
};

function AutocompleteSelect({ onSelectionChange, selectedItems }) {

  const handleChange = (selectedOptions) => {
    const opt = selectedOptions.map((o) => o.value);
    onSelectionChange(opt);
  };

  return (
    <AsyncSelect
      isMulti
      cacheOptions
      defaultOptions={[]}
      loadOptions={loadOptions}
      onChange={handleChange}
      value={selectedItems.map((item) => ({ label: item, value: item }))}
      placeholder="Search and select..."
    />
  );
};

export default AutocompleteSelect;
