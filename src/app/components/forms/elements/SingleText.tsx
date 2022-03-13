import { useEffect, useState } from 'react';
import { ActionIcon, Box, Divider, TextInput, Tooltip, Chip, Text } from '@mantine/core';
import { IconCopy, IconTrash } from '@tabler/icons';
import { CgDetailsLess } from 'react-icons/cg';
import { useRecoilState, useRecoilValue } from 'recoil';
import { FormElement } from '@/core/types';
import { formState, selectedElementState } from '@/app/store';
import FormElementContainer from '../FormElementContainer';
import { nanoid } from 'nanoid';

interface Props {
  element: FormElement;
  index?: number;
}

export default function SingleText({ element, index }: Props) {
  const [selectedId, setSelectedId] = useRecoilState(selectedElementState);
  const [form, setForm] = useRecoilState(formState);
  const [newId, setNewId] = useState(selectedId);

  const isSelected = element.id === selectedId;

  const updateLabelOrDescription = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const { value, name } = e.currentTarget;

    const updatedContent = form.content.map((el) => {
      const newElement = { ...el };
      if (el.id === element.id) {
        newElement[name] = value;
      }
      return newElement;
    });
    setForm((prevForm) => ({
      ...prevForm,
      content: updatedContent,
    }));
  };

  const updateShowDescription = () => {
    const updatedContent = form.content.map((el) => {
      const newElement = { ...el };
      if (el.id === element.id) {
        newElement.showDescription = !element.showDescription;
      }
      return newElement;
    });
    setForm((prevForm) => ({
      ...prevForm,
      content: updatedContent,
    }));
  };

  const updateIsRequired = () => {
    const updatedContent = form.content.map((el) => {
      const newElement = { ...el };
      if (el.id === element.id) {
        newElement.required = !element.required;
      }
      return newElement;
    });
    setForm((prevForm) => ({
      ...prevForm,
      content: updatedContent,
    }));
  };

  const duplicateElement = () => {
    const elementId = nanoid(8);
    const newContent = [...form.content];
    const newElement = { ...element, id: elementId };

    if (selectedId) {
      newContent.splice(newContent.findIndex((el) => el.id === selectedId) + 1, 0, newElement);
    } else {
      newContent.push(newElement);
    }

    setForm((prevForm) => ({
      ...prevForm,
      content: newContent,
    }));

    setNewId(elementId);
  };

  useEffect(() => {
    setSelectedId(newId);
  }, [newId]);

  const deleteElement = () => {
    const updatedContent = form.content.filter((el) => el.id !== element.id);
    setForm((prevForm) => ({
      ...prevForm,
      content: updatedContent,
    }));
  };

  return (
    <FormElementContainer elementId={element.id} index={index}>
      {isSelected && (
        <Box className="space-y-4">
          <Box className="space-y-3">
            <TextInput
              autoFocus
              placeholder="Enter a question"
              name="label"
              defaultValue={element?.label}
              onChange={updateLabelOrDescription}
            />
            {element?.showDescription && (
              <TextInput
                placeholder="Enter a description"
                name="description"
                defaultValue={element?.description}
                onChange={updateLabelOrDescription}
              />
            )}
            <TextInput
              placeholder="Client will type their answer here"
              disabled
              classNames={{ disabled: '!cursor-default' }}
            />
          </Box>
          <Divider />
          <Box className="flex items-center justify-between">
            <Box className="flex items-center space-x-2">
              <Box className="pt-[5px]">{<CgDetailsLess size="" />}</Box>
              <Text className="font-medium text-sm">Single line text</Text>
            </Box>
            <Box className="flex items-center space-x-2">
              <Box className="flex items-center space-x-2 mr-4">
                <Chip
                  color="green"
                  variant="filled"
                  value="chip"
                  checked={element.required}
                  onChange={updateIsRequired}
                >
                  Required
                </Chip>
                <Chip
                  color="green"
                  variant="filled"
                  value="chip"
                  checked={element.showDescription}
                  onChange={updateShowDescription}
                >
                  Description
                </Chip>
              </Box>
              <Tooltip label="Duplicate" position="bottom">
                <ActionIcon variant="default" onClick={duplicateElement}>
                  <IconCopy size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Delete" position="bottom">
                <ActionIcon variant="default" onClick={deleteElement}>
                  <IconTrash size={16} className="text-red-500" />
                </ActionIcon>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      )}
      {!isSelected && (
        <Box className="space-y-2">
          <TextInput
            label={element?.label || 'Single line text'}
            description={element.showDescription && element?.description}
            placeholder="Client will type their answer here"
            required={element?.required}
            disabled
            classNames={{ disabled: '!cursor-default' }}
          />
        </Box>
      )}
    </FormElementContainer>
  );
}
