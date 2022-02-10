import { useEffect, useState } from 'react';
import {
  ActionIcon,
  Box,
  Divider,
  TextInput,
  Textarea,
  Tooltip,
  Chip,
  Text,
  RadioGroup,
  Radio,
} from '@mantine/core';
import { FiCopy, FiTrash2, FiPlus, FiX, FiCheckCircle } from 'react-icons/fi';
import { useRecoilState, useRecoilValue } from 'recoil';
import { formState, selectedElementState } from '@/app/store';
import { FormElement } from '@/core/types';
import Button from '@/app/components/shared/Button';
import FormElementContainer from '../FormElementContainer';
import { nanoid } from 'nanoid';

interface Props {
  element: FormElement;
}

export default function SingleChoiceElement({ element }: Props) {
  const [selectedId, setSelectedId] = useRecoilState(selectedElementState);
  const [form, setForm] = useRecoilState(formState);
  const [newId, setNewId] = useState(selectedId);

  const isSelected = element.id === selectedId;

  const updateLabelOrDescription = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const { value, name } = e.currentTarget;

    const updatedContent = form.content.map((el) => {
      const newElement = { ...el };
      if (el.id === element.id) {
        newElement[name] = value.trim();
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

  const addOption = () => {
    const updatedElement = { ...element };

    updatedElement.options = [
      ...element.options,
      { id: nanoid(), option: `Option ${element.options.length + 1}` },
    ];

    setForm((prevForm) => ({
      ...prevForm,
      content: form.content.map((element) => {
        if (element.id === updatedElement.id) {
          return updatedElement;
        }
        return element;
      }),
    }));
  };

  const updateOption = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const { id, value } = e.currentTarget;
    let updatedElement = { ...element };

    const updatedOptions = updatedElement.options.map((option) => {
      if (id === option.id) {
        return { ...option, option: value.trim() };
      }
      return option;
    });

    updatedElement.options = updatedOptions;

    setForm((prevForm) => ({
      ...prevForm,
      content: form.content.map((element) => {
        if (element.id === updatedElement.id) {
          return { ...updatedElement };
        }
        return { ...element };
      }),
    }));
  };

  const deleteOption = (id: string) => {
    const updatedElement = { ...element };

    updatedElement.options = element.options.filter((option) => option.id !== id);

    setForm((prevForm) => ({
      ...prevForm,
      content: form.content.map((element) => {
        if (element.id === updatedElement.id) {
          return updatedElement;
        }
        return element;
      }),
    }));
  };

  return (
    <FormElementContainer elementId={element.id}>
      {isSelected && (
        <Box className="space-y-4">
          <Box className="space-y-3">
            <TextInput
              autoFocus
              placeholder="Enter a question"
              name="label"
              defaultValue={element?.label || 'Single choice selection'}
              onChange={updateLabelOrDescription}
            />
            {element.showDescription && (
              <TextInput
                placeholder="Enter a description"
                name="description"
                defaultValue={element?.description}
                onChange={updateLabelOrDescription}
              />
            )}

            <Box className="space-y-2">
              {element?.options.map((option) => (
                <Box className="flex items-center" key={option.id}>
                  <Radio disabled value="" />
                  <TextInput
                    id={option.id}
                    className="w-full"
                    placeholder="Enter and option"
                    defaultValue={option.option}
                    onChange={updateOption}
                  />
                  <ActionIcon
                    className="ml-3"
                    variant="default"
                    size="lg"
                    onClick={() => deleteOption(option.id)}
                  >
                    <FiX />
                  </ActionIcon>
                </Box>
              ))}
            </Box>

            <Button compact variant="default" leftIcon={<FiPlus />} onClick={addOption}>
              Add option
            </Button>
          </Box>
          <Divider />
          <Box className="flex items-center justify-between">
            <Box className="flex items-center space-x-2">
              <Box className="pt-[5px]">{<FiCheckCircle />}</Box>
              <Text className="font-medium text-sm">Single choice selection</Text>
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
          <RadioGroup
            label={element?.label || 'Single choice selection'}
            description={element?.showDescription && element?.description}
            required={element.required}
            variant="vertical"
            classNames={{ radio: '!text-dark-800' }}
          >
            {element?.options?.map((option) => (
              <Radio
                key={option.id}
                disabled
                value={option.option}
                sx={(theme) => ({
                  '& span': {
                    color: theme.colors.dark[8],
                    fontSize: '14px',
                  },
                })}
              >
                {option.option}
              </Radio>
            ))}
          </RadioGroup>
        </Box>
      )}
    </FormElementContainer>
  );
}
