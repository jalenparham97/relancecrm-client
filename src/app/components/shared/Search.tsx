import { TextInput, TextInputProps } from '@mantine/core';
import { AiOutlineSearch } from 'react-icons/ai';

interface Props extends TextInputProps {
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<{ value: string }>) => void;
  [x: string]: any;
}

export default function Search({ searchValue, onSearchChange, ...otherProps }: Props) {
  return (
    <TextInput
      icon={<AiOutlineSearch />}
      value={searchValue}
      onChange={onSearchChange}
      {...otherProps}
    />
  );
}
