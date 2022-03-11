import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Text, Navbar, Title, Group, ScrollArea } from '@mantine/core';
import {
  FiHash,
  FiSave,
  FiEye,
  FiCheckCircle,
  FiCheckSquare,
  FiAtSign,
  FiPhone,
} from 'react-icons/fi';
import { CgFormatHeading, CgDetailsLess, CgDetailsMore } from 'react-icons/cg';
import { useIsDarkMode, useToasts } from '@/app/hooks';
import { useRecoilState } from 'recoil';
import { useForm, useFormUpdateMutation } from '@/app/api/forms';
import { formState, selectedElementState } from '@/app/store';
import { FormElement, FormElementSubTypeType } from '@/core/types';
import { nanoid } from 'nanoid';
import { isEqual } from 'lodash';
import Button from '@/app/components/shared/Button';
import FormElementType from './FormElementType';
import BrandColorPicker from '../shared/BrandColorPicker';
import Link from '../shared/Link';

const elementsLabelMap = {
  heading: 'Section heading',
  single_line: 'Single line text',
  paragraph: 'Paragraph text',
  multiple_choice: 'Multiple choice selection',
  single_choice: 'Single choice selection',
  number: 'Number',
  email: 'Email',
  phone: 'Phone number',
};

interface Props {
  drawerWidth?: number;
}

export default function FormEditSideDrawer({ drawerWidth = 370 }: Props) {
  const isDarkMode = useIsDarkMode();
  const toasts = useToasts();
  const { query } = useRouter();
  const { data: formData } = useForm(query.id as string);
  const [form, setForm] = useRecoilState(formState);
  const [selectedId, setSelectedId] = useRecoilState(selectedElementState);
  const [newId, setNewId] = useState('');

  const handleUpdateFormSubmit = useFormUpdateMutation(form?._id);

  const saveForm = async () => {
    try {
      await handleUpdateFormSubmit.mutateAsync(form);
      // toasts.success('Form updated');
    } catch (error) {
      console.log(error);
    }
  };

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
      element.options = [
        { id: nanoid(), option: 'Option 1' },
        { id: nanoid(), option: 'Option 2' },
        { id: nanoid(), option: 'Option 3' },
      ];
    }

    if (subtype === 'email') {
      element.type = 'email';
      element.required = true;
    }

    if (subtype === 'phone') {
      element.type = 'tel';
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
  const addEmailElement = () => {
    return setForm((prevForm) => ({
      ...prevForm,
      content: insertElement(prevForm.content, 'email'),
    }));
  };
  const addNumberElement = () => {
    return setForm((prevForm) => ({
      ...prevForm,
      content: insertElement(prevForm.content, 'number'),
    }));
  };
  const addPhoneNumberElement = () => {
    return setForm((prevForm) => ({
      ...prevForm,
      content: insertElement(prevForm.content, 'phone'),
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

  const setTextColor = (color: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      brandTextColor: color,
    }));
  };

  const setBgColor = (color: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      brandFillColor: color,
    }));
  };

  return (
    <Navbar
      fixed
      p="xs"
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
              <Link href={`/forms/${form?._id}/preview`}>
                <Button variant="default" fullWidth leftIcon={<FiEye />}>
                  Preview
                </Button>
              </Link>
              <Button
                fullWidth
                leftIcon={<FiSave />}
                onClick={saveForm}
                loading={handleUpdateFormSubmit.isLoading}
                disabled={isEqual(formData, form)}
              >
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
                  icon={<FiAtSign size="20px" />}
                  name="Email input"
                  onClick={addEmailElement}
                />
                <FormElementType
                  icon={<FiPhone size="20px" />}
                  name="Phone number input"
                  onClick={addPhoneNumberElement}
                />
                <FormElementType
                  icon={<FiHash size="20px" />}
                  name="Number input"
                  onClick={addNumberElement}
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
              </Box>
            </Box>

            <Box className="space-y-2">
              <Title order={2}>Branding options</Title>
              <Box className="space-y-2">
                <BrandColorPicker
                  bgColor={form?.brandFillColor}
                  textColor={form?.brandTextColor}
                  setTextColor={setTextColor}
                  setBgColor={setBgColor}
                />
                <Box>
                  <Button variant="default" compact to="/settings/account">
                    Set your default brand colors
                  </Button>
                </Box>
              </Box>
            </Box>
          </Group>
        </Box>
      </Navbar.Section>
    </Navbar>
  );
}
