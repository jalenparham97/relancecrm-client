import { useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import Search from './Search';

export default function DataTableGlobalFilter({
  globalFilter,
  setGlobalFilter,
  placeholder = 'Search',
}) {
  const [value, setValue] = useState(globalFilter);

  const onChange = useAsyncDebounce((value: string) => {
    setGlobalFilter(value || '');
  }, 300);

  return (
    <Search
      value={value || ''}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={placeholder}
    />
  );
}
