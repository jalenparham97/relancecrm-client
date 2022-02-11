import React, { useEffect, useState } from 'react';
import {
  ActionIcon,
  Box,
  Divider,
  TextInput,
  Tooltip,
  Chip,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { FiCopy, FiTrash2 } from 'react-icons/fi';
import { CgFormatHeading } from 'react-icons/cg';
import { useRecoilState, useRecoilValue } from 'recoil';
import { formState, selectedElementState } from '@/app/store';
import { Form, FormElement } from '@/core/types';
import { nanoid } from 'nanoid';
import FormElementContainer from '../FormElementContainer';

interface Props {
  element: FormElement;
  index?: number;
}

export default function HeadingElement({ element, index }: Props) {
  const [selectedId, setSelectedId] = useRecoilState(selectedElementState);
  const [form, setForm] = useRecoilState(formState);
  const [newId, setNewId] = useState(selectedId);

  const isSelected = element.id === selectedId;

  const updateLabelOrDescription = (
    e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
              name="label"
              placeholder="Use this as a heading between sections of questions"
              defaultValue={element?.label || 'Use this as a heading between sections of questions'}
              onChange={updateLabelOrDescription}
            />
            {element.showDescription && (
              <Textarea
                name="description"
                placeholder="Enter a description"
                defaultValue={element?.description}
                onChange={updateLabelOrDescription}
              />
            )}
          </Box>
          <Divider />
          <Box className="flex items-center justify-between">
            <Box className="flex items-center space-x-2">
              <Box className="pt-[5px]">{<CgFormatHeading size="" />}</Box>
              <Text className="font-medium text-sm">Heading</Text>
            </Box>
            <Box className="flex items-center space-x-2">
              <Box className="flex items-center space-x-2 mr-4">
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
                  <FiCopy />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Delete" position="bottom">
                <ActionIcon variant="default" onClick={deleteElement}>
                  <FiTrash2 className="text-red-600" />
                </ActionIcon>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      )}
      {!isSelected && (
        <Box className="space-y-2">
          <Box className="space-y-2">
            <Title order={4}>{element?.label || 'Section heading'}</Title>
            {element.showDescription && <Text>{element?.description}</Text>}
          </Box>
        </Box>
      )}
    </FormElementContainer>
  );
}
