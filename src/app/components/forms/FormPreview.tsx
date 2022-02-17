import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Paper, Title, TextInput, Textarea, Text } from '@mantine/core';
import { Form, FormResponse, FormResponseContent } from '@/core/types';
import { EMAIL_REGEX, NUMBER_REGEX, PHONE_NUMBER_REGEX } from '@/core/constants';
import { useResponseAddMutation } from '@/app/api/responses';
import { omitObjProperty } from '@/core/utils';
import { isEmpty } from 'lodash';
import Button from '../shared/Button';
import HeadingPreviewElement from './previewElements/HeadingPreviewElement';
import SingleChoicePreviewElement from './previewElements/SingleChoicePreviewElement';
import MultipleChoicePreviewElement from './previewElements/MultipleChoicePreviewElement';

interface Props {
  form: Form;
  isPreview?: boolean;
}

export default function FormPreview({ form, isPreview = false }: Props) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [choiceValues, setChoiceValues] = useState<{ id: string; value: string[] | string }[]>([]);
  const [choiceErrors, setChoiceErrors] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
    reset,
  } = useForm();

  const handleAddResponse = useResponseAddMutation();

  const onSubmit = async (data: any) => {
    let errors = {};

    if (isPreview) return;

    for (const item of form.content) {
      const choiceValue = choiceValues.find((value) => value.id === item.id);
      if (item.required && choiceValue) {
        if (isEmpty(choiceValue?.value)) {
          setChoiceErrors((prevErrors) => {
            errors = { ...prevErrors, [item.id]: 1 };
            return {
              ...prevErrors,
              [item.id]: `Please make at least one choice`,
            };
          });
        }
      }
    }

    if (isEmpty(errors)) {
      try {
        const content: FormResponseContent = form.content.map((item) => {
          const choiceValue = choiceValues.find((value) => value.id === item.id);

          if (choiceValue !== undefined) {
            return {
              element: omitObjProperty(item, ['description', 'showDescription']),
              value: choiceValue?.value,
            };
          }

          if (choiceValue === undefined) {
            return {
              element: omitObjProperty(item, ['description', 'showDescription']),
              value: '',
            };
          }

          return {
            element: omitObjProperty(item, ['description', 'showDescription']),
            value: data[item.id],
          };
        });
        const response: FormResponse = { formId: form._id, content };
        await handleAddResponse.mutateAsync(response);
        setIsSubmitted(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    for (const item of form.content) {
      const choiceValue = choiceValues.find((value) => value.id === item.id);
      if (!isEmpty(choiceValue?.value)) {
        setChoiceErrors((prevErrors) => ({ ...prevErrors, [item.id]: '' }));
      }
    }
  }, [choiceValues]);

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

      <Box className="px-5 sm:px-20 md:px-32 py-10">
        {isSubmitted && (
          <Box className="text-center space-y-3">
            <Title order={2}>Thanks</Title>
            <Text>Your response was submitted successfully!</Text>
          </Box>
        )}

        {!isSubmitted && (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box className="space-y-5">
              {form?.content?.map((element) => {
                if (element.subtype === 'single_line') {
                  return (
                    <TextInput
                      key={element.id}
                      label={element.label}
                      disabled={isPreview}
                      required={element.required}
                      {...register(`${element.id}`, {
                        required: {
                          value: element.required,
                          message: `${element.label} is required`,
                        },
                      })}
                      defaultValue={''}
                      classNames={{
                        disabled: '!cursor-default',
                        input: 'focus:outline-none focus:border-blue-500',
                      }}
                      error={formErrors[`${element.id}`]?.message}
                    />
                  );
                }
                if (element.subtype === 'email') {
                  return (
                    <TextInput
                      key={element.id}
                      label={element.label}
                      disabled={isPreview}
                      required={element.required}
                      {...register(`${element.id}`, {
                        required: {
                          value: element.required,
                          message: `${element.label} is required`,
                        },
                        pattern: {
                          value: EMAIL_REGEX,
                          message: 'Please enter a valid email address',
                        },
                      })}
                      defaultValue={''}
                      classNames={{
                        disabled: '!cursor-default',
                        input: 'focus:outline-none focus:border-blue-500',
                      }}
                      error={formErrors[`${element.id}`]?.message}
                    />
                  );
                }
                if (element.subtype === 'paragraph') {
                  return (
                    <Textarea
                      key={element.id}
                      label={element.label}
                      disabled={isPreview}
                      required={element.required}
                      {...register(`${element.id}`, {
                        required: {
                          value: element.required,
                          message: `${element.label} is required`,
                        },
                      })}
                      defaultValue={''}
                      classNames={{
                        disabled: '!cursor-default',
                        input: 'focus:outline-none focus:border-blue-500',
                      }}
                      error={formErrors[`${element.id}`]?.message}
                    />
                  );
                }
                if (element.subtype === 'heading') {
                  return <HeadingPreviewElement key={element.id} element={element} />;
                }
                if (element.subtype === 'single_choice') {
                  return (
                    <SingleChoicePreviewElement
                      key={element.id}
                      element={element}
                      isPreview={isPreview}
                      setChoiceValues={setChoiceValues}
                      error={choiceErrors[element.id]}
                    />
                  );
                }
                if (element.subtype === 'multiple_choice') {
                  return (
                    <MultipleChoicePreviewElement
                      key={element.id}
                      element={element}
                      isPreview={isPreview}
                      setChoiceValues={setChoiceValues}
                      error={choiceErrors[element.id]}
                    />
                  );
                }
                if (element.subtype === 'number') {
                  return (
                    <TextInput
                      key={element.id}
                      label={element?.label}
                      description={element.showDescription && element?.description}
                      required={element?.required}
                      disabled={isPreview}
                      {...register(`${element.id}`, {
                        required: {
                          value: element.required,
                          message: `${element.label} is required`,
                        },
                        pattern: {
                          value: NUMBER_REGEX,
                          message: 'Please enter a valid number',
                        },
                      })}
                      classNames={{
                        disabled: '!cursor-default',
                        input: 'focus:outline-none focus:border-blue-500',
                      }}
                      error={formErrors[`${element.id}`]?.message}
                    />
                  );
                }
                if (element.subtype === 'phone') {
                  return (
                    <TextInput
                      key={element.id}
                      label={element?.label}
                      description={element.showDescription && element?.description}
                      required={element?.required}
                      disabled={isPreview}
                      {...register(`${element.id}`, {
                        required: {
                          value: element.required,
                          message: `${element.label} is required`,
                        },
                        pattern: {
                          value: PHONE_NUMBER_REGEX,
                          message: 'Please enter a valid phone number',
                        },
                      })}
                      classNames={{
                        disabled: '!cursor-default',
                        input: 'focus:outline-none focus:border-blue-500',
                      }}
                      error={formErrors[`${element.id}`]?.message}
                    />
                  );
                }
              })}
            </Box>
            <Button
              className="mt-8"
              type="submit"
              size="md"
              fullWidth
              sx={{
                backgroundColor: `${form?.brandFillColor}`,
                color: `${form?.brandTextColor}`,
                ':hover': {
                  backgroundColor: `${form?.brandFillColor}`,
                },
              }}
              loading={isSubmitting}
            >
              {form?.submitButtonText}
            </Button>
          </form>
        )}
      </Box>
    </Paper>
  );
}
