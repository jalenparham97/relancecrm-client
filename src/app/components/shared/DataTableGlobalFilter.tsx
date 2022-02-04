import { useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import Search from './Search';

interface Props {
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  placeholder?: string;
  className?: string;
}

export default function DataTableGlobalFilter({
  globalFilter,
  setGlobalFilter,
  placeholder = 'Search',
  className,
}: Props) {
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
      className={className}
    />
  );
}
