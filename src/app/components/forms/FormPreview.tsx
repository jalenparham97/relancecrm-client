import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { Box, Paper, Title, TextInput, Textarea, NumberInput } from '@mantine/core';
import { Form } from '@/core/types';
import Button from '../shared/Button';
import HeadingPreviewElement from './previewElements/HeadingPreviewElement';
import SingleChoicePreviewElement from './previewElements/SingleChoicePreviewElement';
import MultipleChoicePreviewElement from './previewElements/MultipleChoicePreviewElement';

interface Props {
  form: Form;
  isPreview?: boolean;
}

export default function FormPreview({ form, isPreview = false }: Props) {
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      test: [{ firstName: 'Bill', lastName: 'Luo' }],
      anotherTest: [{ email: 'Bill', name: 'Luo' }],
    },
  });
  const { fields } = useFieldArray({ control, name: 'anotherTest' });
  const { fields: testFields } = useFieldArray({ control, name: 'test' });

  console.log({ fields, testFields });

  return (
    <Paper
      withBorder
      className="border-gray-600 border-opacity-20 shadow-sm border-t-8"
      sx={{
        borderTopColor: `${form?.brandFillColor} !important`,
      }}
    >
      <Box
        className="w-full h-56 flex border-b-gray-600 border-opacity-20 justify-center items-center"
        sx={{
          backgroundImage: `url("${form?.headerImage?.url}")`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          borderBottom: '1px solid',
        }}
      >
        <Box className={`${form?.headerImage?.url && ' bg-white px-8 py-3 rounded'}`}>
          <Title className={`text-center`} order={2}>
            {form?.header}
          </Title>
        </Box>
      </Box>

      <Box className=" px-5 sm:px-20 md:px-32 py-10">
        <form className="">
          <Box className="space-y-5">
            {form?.content?.map((element) => {
              if (element.subtype === 'single_line') {
                return (
                  <TextInput
                    key={element.id}
                    label={element.label}
                    required={element.required}
                    disabled={isPreview}
                    classNames={{
                      disabled: '!cursor-default',
                      input: 'focus:outline-none focus:border-blue-500',
                    }}
                  />
                );
              }
              if (element.subtype === 'email') {
                return (
                  <TextInput
                    key={element.id}
                    label={element.label}
                    required={element.required}
                    disabled={isPreview}
                    type="email"
                    classNames={{
                      disabled: '!cursor-default',
                      input: 'focus:outline-none focus:border-blue-500',
                    }}
                  />
                );
              }
              if (element.subtype === 'paragraph') {
                return (
                  <Textarea
                    key={element.id}
                    label={element.label}
                    required={element.required}
                    disabled={isPreview}
                    classNames={{
                      disabled: '!cursor-default',
                      input: 'focus:outline-none focus:border-blue-500',
                    }}
                  />
                );
              }
              if (element.subtype === 'heading') {
                return <HeadingPreviewElement key={element.id} element={element} />;
              }
              if (element.subtype === 'single_choice') {
                return <SingleChoicePreviewElement key={element.id} element={element} isPreview />;
              }
              if (element.subtype === 'multiple_choice') {
                return (
                  <MultipleChoicePreviewElement key={element.id} element={element} isPreview />
                );
              }
              if (element.subtype === 'number') {
                return (
                  <NumberInput
                    label={element?.label}
                    description={element.showDescription && element?.description}
                    required={element?.required}
                    disabled={isPreview}
                    classNames={{
                      disabled: '!cursor-default',
                      input: 'focus:outline-none focus:border-blue-500',
                    }}
                  />
                );
              }
            })}
          </Box>
          <Button
            className="mt-8"
            size="md"
            fullWidth
            sx={{
              backgroundColor: `${form?.brandFillColor}`,
              color: `${form?.brandTextColor}`,
              ':hover': {
                backgroundColor: `${form?.brandFillColor}`,
              },
            }}
          >
            {form?.submitButtonText}
          </Button>
        </form>
      </Box>
    </Paper>
  );
}
