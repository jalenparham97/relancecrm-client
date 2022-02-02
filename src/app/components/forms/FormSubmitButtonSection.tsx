import React, { useState } from 'react';
import { Box, Divider, Paper, TextInput } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import Button from '../shared/Button';

export default function FormSubmitButtonSection() {
  const [buttonText, setButtonText] = useInputState('Send');

  return (
    <Paper padding="lg" withBorder className={`border-gray-600 border-opacity-20 shadow-sm`}>
      <Box className="space-y-3">
        <Button fullWidth size="md">
          {buttonText}
        </Button>
        <Divider />
        <TextInput label="Button text" value={buttonText} onChange={setButtonText} />
      </Box>
    </Paper>
  );
}
