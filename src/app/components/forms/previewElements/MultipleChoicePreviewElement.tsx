import { useEffect, useState } from 'react';
import { Box, Checkbox } from '@mantine/core';
import { FormElement } from '@/core/types';
import CheckboxGroup from '@/app/components/shared/CheckboxGroup';

interface Props {
  element: FormElement;
  isPreview?: boolean;
  setChoiceValues?: (value: any) => void;
  error?: string;
}

export default function MultipleChoicePreviewElement({
  element,
  isPreview = false,
  setChoiceValues,
  error,
}: Props) {
  const [checks, setChecks] = useState<string[]>([]);

  const handleChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const updatedChecks = [...checks];
    const option = event.currentTarget.labels[0].textContent;

    if (event.currentTarget.checked) {
      setChecks((prevChecks) => [...prevChecks, option]);
    } else {
      if (updatedChecks.find((check) => check === option)) {
        const index = updatedChecks.findIndex((check) => check === option);
        updatedChecks.splice(index, 1);
        setChecks(updatedChecks);
      }
    }
  };

  const updateChecks = (checks: string[]) => {
    setChoiceValues((prevValues: any[]) => {
      const values = [...prevValues];
      if (values.find((value) => value.id === element.id)) {
        const index = values.findIndex((value) => value.id === element.id);
        values.splice(index, 1, { id: element.id, value: checks });
      } else {
        return [...values, { id: element.id, value: checks }];
      }
      return values;
    });
  };

  useEffect(() => {
    updateChecks(checks);
  }, [checks]);

  return (
    <Box>
      <CheckboxGroup
        label={element?.label}
        description={element?.showDescription && element?.description}
        required={element?.required}
        error={error}
      >
        {element?.options.map((option) => (
          <Checkbox
            color="blue"
            onChange={handleChange}
            disabled={isPreview}
            label={option.option}
            key={option.id}
            classNames={{
              input: isPreview && '!cursor-default',
              label: isPreview && '!cursor-default',
            }}
          />
        ))}
      </CheckboxGroup>
    </Box>
  );
}
