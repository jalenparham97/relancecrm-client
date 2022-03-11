import { Box, Paper } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { useUnmount } from 'react-use';
import { useRecoilState } from 'recoil';
import { Draggable } from 'react-beautiful-dnd';
import { selectedElementState } from '@/app/store';
import { IconGripHorizontal } from '@tabler/icons';

interface Props {
  children: React.ReactNode;
  elementId: string | number;
  index?: number;
}

export default function FormElementContainer({ children, elementId, index }: Props) {
  const { hovered, ref } = useHover();
  const [selectedId, setSelectedId] = useRecoilState(selectedElementState);

  useUnmount(() => setSelectedId(''));

  const handleSelect = () => setSelectedId(elementId);

  const isSelected = elementId === selectedId;

  return (
    <Draggable key={elementId} draggableId={elementId as string} index={index}>
      {(provided, snapshot) => (
        <Box ref={ref}>
          {isSelected && (
            <Box ref={provided.innerRef} {...provided.draggableProps}>
              <Paper
                onClick={handleSelect}
                p="lg"
                withBorder
                className={`relative border-gray-600 border-opacity-20 shadow-sm ${
                  isSelected && 'border-opacity-50 shadow-lg'
                }`}
              >
                <Box className="absolute -top-[2px] left-1/2" {...provided.dragHandleProps}>
                  <IconGripHorizontal className="text-gray-600" />
                </Box>
                {children}
              </Paper>
            </Box>
          )}
          {!isSelected && (
            <Box ref={provided.innerRef} {...provided.draggableProps}>
              <Paper
                onClick={handleSelect}
                p="lg"
                withBorder
                className={`relative border-gray-600 border-opacity-20 shadow-sm ${
                  isSelected && 'border-opacity-50 shadow-lg'
                }`}
              >
                {hovered && (
                  <Box className="absolute -top-[2px] left-1/2" {...provided.dragHandleProps}>
                    <IconGripHorizontal className="text-gray-600" />
                  </Box>
                )}
                {children}
              </Paper>
            </Box>
          )}
        </Box>
      )}
    </Draggable>
  );
}
