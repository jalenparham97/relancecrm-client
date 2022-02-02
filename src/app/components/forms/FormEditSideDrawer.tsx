import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Text, Navbar, Title, Group, ScrollArea, Checkbox } from '@mantine/core';
import { FiHash, FiSave, FiEye, FiCheckCircle, FiCheckSquare } from 'react-icons/fi';
import { CgFormatHeading, CgDetailsLess, CgDetailsMore } from 'react-icons/cg';
import { useIsDarkMode } from '@/app/hooks';
import { useRecoilState } from 'recoil';
import { formState, selectedElementState } from '@/app/store';
import { FormElement, FormElementSubTypeType } from '@/core/types';
import { nanoid } from 'nanoid';
import Button from '@/app/components/shared/Button';
import FormElementType from './FormElementType';
import BrandColorPicker from '../shared/BrandColorPicker';

const elementsLabelMap = {
  heading: 'Section heading',
  single_line: 'Single line text',
  paragraph: 'Paragraph text',
  multiple_choice: 'Multiple choice selection',
  single_choice: 'Single choice selection',
  number: 'Number',
};

interface Props {
  drawerWidth?: number;
}

export default function FormEditSideDrawer({ drawerWidth = 370 }: Props) {
  const isDarkMode = useIsDarkMode();
  const [selectedId, setSelectedId] = useRecoilState(selectedElementState);
  const [form, setForm] = useRecoilState(formState);
  const [newId, setNewId] = useState('');

  const insertElement = (content: FormElement[], subtype: FormElementSubTypeType) => {
    const newContent = [...content];
    const elementId = nanoid(8);
    const element: FormElement = {
      id: elementId,
      label: elementsLabelMap[subtype],
      subtype,
      type: 'text',
      required: false,
      description: '',
      showDescription: false,
    };

    if (subtype === 'multiple_choice' || subtype === 'single_choice') {
      element.options = ['Option 1', 'Option 2', 'Option 3'];
    }

    if (selectedId) {
      newContent.splice(newContent.findIndex((el) => el.id === selectedId) + 1, 0, element);
    } else {
      newContent.push(element);
    }

    setNewId(elementId);

    return newContent;
  };

  useEffect(() => {
    setSelectedId(newId);
  }, [newId]);

  const addHeadingElement = () => {
    return setForm((prevForm) => ({
      ...prevForm,
      content: insertElement(prevForm.content, 'heading'),
    }));
  };
  const addSingleTextElement = () => {
    return setForm((prevForm) => ({
      ...prevForm,
      content: insertElement(prevForm.content, 'single_line'),
    }));
  };
  const addParagraphElement = () => {
    return setForm((prevForm) => ({
      ...prevForm,
      content: insertElement(prevForm.content, 'paragraph'),
    }));
  };
  const addNumberElement = () => {
    return setForm((prevForm) => ({
      ...prevForm,
      content: insertElement(prevForm.content, 'number'),
    }));
  };
  const addSingleChoiceElement = () => {
    return setForm((prevForm) => ({
      ...prevForm,
      content: insertElement(prevForm.content, 'single_choice'),
    }));
  };
  const addMultipleChoiceElement = () => {
    return setForm((prevForm) => ({
      ...prevForm,
      content: insertElement(prevForm.content, 'multiple_choice'),
    }));
  };

  return (
    <Navbar
      fixed
      padding="xs"
      className={`!border-l ${
        isDarkMode ? '!border-gray-800 !border-opacity-70' : '!border-gray-300'
      } !border-r-0`}
      sx={{ borderLeft: '1px solid' }}
      width={{ base: drawerWidth }}
      position={{ top: 0, right: 0 }}
    >
      <Navbar.Section
        grow
        component={ScrollArea}
        ml={-10}
        mr={-10}
        sx={{ paddingLeft: 20, paddingRight: 10 }}
      >
        <Box className="pt-[75px] pb-14 w-[97.5%]">
          <Group direction="column" spacing="lg" grow>
            <Box className="flex w-full justify-between space-x-3">
              <Button variant="default" fullWidth leftIcon={<FiEye />}>
                Preview
              </Button>
              <Button fullWidth leftIcon={<FiSave />}>
                Save changes
              </Button>
            </Box>
            <Box className="space-y-2">
              <Box>
                <Title order={2}>Form elements</Title>
                <Text>Select a new form element type</Text>
              </Box>
              <Box className="space-y-2">
                <FormElementType
                  icon={<CgFormatHeading size="20px" />}
                  name="Heading"
                  onClick={addHeadingElement}
                />
                <FormElementType
                  icon={<CgDetailsLess size="20px" />}
                  name="Single line text"
                  onClick={addSingleTextElement}
                />
                <FormElementType
                  icon={<CgDetailsMore size="20px" />}
                  name="Paragraph text"
                  onClick={addParagraphElement}
                />
                <FormElementType
                  icon={<FiCheckCircle size="20px" />}
                  name="Single choice selection"
                  onClick={addSingleChoiceElement}
                />
                <FormElementType
                  icon={<FiCheckSquare size="20px" />}
                  name="Multiple choice selection"
                  onClick={addMultipleChoiceElement}
                />
                <FormElementType
                  icon={<FiHash size="20px" />}
                  name="Number"
                  onClick={addNumberElement}
                />
              </Box>
            </Box>

            <Box className="space-y-2">
              <Title order={2}>Branding options</Title>
              <Box className="space-y-2">
                <BrandColorPicker />
                <Checkbox label="Save these brading options as your default" />
              </Box>
            </Box>
          </Group>
        </Box>
      </Navbar.Section>
    </Navbar>
  );
}
