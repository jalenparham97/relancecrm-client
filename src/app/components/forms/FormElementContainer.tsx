import { Paper } from '@mantine/core';
import { useUnmount } from 'react-use';
import { useRecoilState } from 'recoil';
import { selectedElementState } from '@/app/store';

interface Props {
  children: React.ReactNode;
  elementId: string | number;
}

export default function FormElementContainer({ children, elementId }: Props) {
  const [selectedId, setSelectedId] = useRecoilState(selectedElementState);

  useUnmount(() => setSelectedId(''));

  const handleSelect = () => setSelectedId(elementId);

  const isSelected = elementId === selectedId;

  return (
    <Paper
      onClick={handleSelect}
      padding="lg"
      withBorder
      className={`border-gray-600 border-opacity-20 shadow-sm ${
        isSelected && 'border-opacity-50 shadow-lg'
      }`}
    >
      {children}
    </Paper>
  );
}
