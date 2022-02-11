import { useEffect, useState } from 'react';
import { Box, Paper, Text, Title } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { User, UserBusinessInfo } from '@/core/types';
import Button from '@/app/components/shared/Button';
import BrandColorPicker from '../../shared/BrandColorPicker';

const colors = ['#4263eb', '#18cf76', '#0eb6ff', '#ffc607'];
const textColors = ['#ffffff', '#000000'];

interface Props {
  user?: User;
  submit?: (data: User) => Promise<void | User>;
}

export default function AccountBrandingOptions({ submit, user }: Props) {
  const [textColor, setTextColor] = useState(textColors[0]);
  const [bgColor, setBgColor] = useState(colors[0]);
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UserBusinessInfo>();

  useEffect(() => {
    setTextColor(user?.businessInfo?.branding?.textColor);
    setBgColor(user?.businessInfo?.branding?.bgColor);
  }, [user]);

  const onSubmit = async () => {
    try {
      const businessInfo: UserBusinessInfo = {
        branding: {
          textColor,
          bgColor,
        },
      };
      await submit({ businessInfo });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper padding="lg" withBorder className="border-gray-600 border-opacity-20 shadow-sm">
      <Title order={2}>Branding options</Title>
      <Text className="mt-1">Manage your businesses branding.</Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="mt-3 space-y-5">
          <Box className="w-80">
            <BrandColorPicker
              setBgColor={setBgColor}
              setTextColor={setTextColor}
              bgColor={bgColor}
              textColor={textColor}
            />
          </Box>
          <Button type="submit" loading={isSubmitting}>
            Save changes
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
