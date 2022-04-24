import { useEffect, useState } from 'react';
import { Box, Radio, RadioGroup } from '@mantine/core';
import { FormElement } from '@/core/types';

interface Props {
  element: FormElement;
  isPreview?: boolean;
  setChoiceValues?: (value: any) => void;
  error?: string;
}

export default function SingleChoicePreviewElement({
  element,
  isPreview = false,
  setChoiceValues,
  error,
}: Props) {
  const [value, setValue] = useState('');

  const handleChange = (val: string) => {
    setChoiceValues((prevValues: any[]) => {
      const values = [...prevValues];
      if (values.find((value) => value.id === element.id)) {
        const index = values.findIndex((value) => value.id === element.id);
        values.splice(index, 1, { id: element.id, value: val });
      } else {
        return [...values, { id: element.id, value: val }];
      }
      return values;
    });
    setValue(val);
  };

  const updateValue = (val: string) => {
    setChoiceValues((prevValues: any[]) => {
      const values = [...prevValues];
      if (values.find((value) => value.id === element.id)) {
        const index = values.findIndex((value) => value.id === element.id);
        values.splice(index, 1, { id: element.id, value: val });
      } else {
        return [...values, { id: element.id, value: val }];
      }
      return values;
    });
  };

  useEffect(() => {
    updateValue(value);
  }, [value]);

  return (
    <Box>
      <RadioGroup
        label={element?.label}
        description={element?.showDescription && element?.description}
        required={element.required}
        orientation="vertical"
        color="blue"
        value={value}
        onChange={handleChange}
        error={error}
        classNames={{ label: '!text-dark-800 !text-[14px]' }}
      >
        {element?.options.map((option) => (
          <Radio
            key={option.id}
            disabled={isPreview}
            value={option.option}
            label={option.option}
          />
        ))}
      </RadioGroup>
    </Box>
  );
}
