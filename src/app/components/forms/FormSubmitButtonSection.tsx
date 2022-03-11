import { Box, Divider, Paper, TextInput } from '@mantine/core';
import { useRecoilState } from 'recoil';
import { formState } from '@/app/store';
import Button from '../shared/Button';

export default function FormSubmitButtonSection() {
  const [form, setForm] = useRecoilState(formState);

  const updateSubmitButtonText = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setForm((prevForm) => ({
      ...prevForm,
      submitButtonText: value,
    }));
  };

  return (
    <Paper p="lg" withBorder className={`border-gray-600 border-opacity-20 shadow-sm`}>
      <Box className="space-y-3">
        <Button
          fullWidth
          size="md"
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
        <Divider />
        <TextInput
          label="Button text"
          value={form?.submitButtonText}
          onChange={updateSubmitButtonText}
        />
      </Box>
    </Paper>
  );
}
