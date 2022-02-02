import React, { useState } from 'react';
import { useToggle } from 'react-use';
import { useInputState } from '@mantine/hooks';
import { useIsDarkMode } from '@/app/hooks';
import { ActionIcon, Box, Divider, Paper, TextInput, Title, Tooltip } from '@mantine/core';
import { FiImage, FiSave } from 'react-icons/fi';
import { Form } from '@/core/types';
import Button from '../shared/Button';

interface Props {
  form: Form;
}

export default function FormHeaderSection({ form }: Props) {
  const isDarkMode = useIsDarkMode();
  const [editMode, toggleEditMode] = useToggle(false);
  const [buttonText, setButtonText] = useInputState('');

  return (
    <Paper
      padding={80}
      withBorder
      className={`relative border-gray-300 shadow-sm border-t-8 ${
        isDarkMode && '!border-gray-800'
      } !border-t-indigo-600`}
    >
      <Box className="">
        {/* <Box className="flex justify-center items-center">
          <Box className="p-8 w-8 bg-indigo-600 rounded"></Box>
        </Box> */}
        <Button
          size="xs"
          variant={'default'}
          className={`absolute top-2 right-3`}
          leftIcon={<FiImage size="15px" />}
        >
          Add cover
        </Button>
        {!editMode && (
          <Title className="text-center" order={2} onClick={() => toggleEditMode(true)}>
            {form?.header}
          </Title>
        )}
        {editMode && (
          <TextInput
            value={form?.header}
            // onBlur={() => toggleEditMode(false)}
            autoFocus
            rightSection={
              <Tooltip label="Save" position="bottom">
                <ActionIcon variant="default" onClick={() => toggleEditMode(false)}>
                  <FiSave />
                </ActionIcon>
              </Tooltip>
            }
          />
        )}
      </Box>
    </Paper>
  );
}
