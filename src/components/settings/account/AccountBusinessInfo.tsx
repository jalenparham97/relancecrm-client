import { Box, Paper, SimpleGrid, Text, TextInput, Title } from '@mantine/core';
import { isEmpty } from 'lodash';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useYupResolver } from '@/hooks';
import { User, UserBusinessInfo } from '@/types';
import Button from '@/components/shared/Button';

const schema = yup.object().shape({
  businessName: yup.string().trim(),
  website: yup.string().trim(),
  address: yup.string().trim(),
});

interface Props {
  user?: User;
  submit?: (data: User) => Promise<void | User>;
}

export default function AccountBusinessInfo({ submit, user }: Props) {
  const resolver = useYupResolver(schema);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UserBusinessInfo>({ resolver });

  const onSubmit = async (data: UserBusinessInfo) => {
    try {
      const businessInfo = {
        businessName: data.businessName || user?.businessInfo?.businessName,
        website: data.website || user?.businessInfo?.website,
        address: data.address || user?.businessInfo?.address,
      };
      await submit({ businessInfo });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper padding="lg" shadow="sm" withBorder>
      <Title order={2}>Business info</Title>
      <Text className="mt-1">Manage your business info.</Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="mt-3 space-y-5">
          <Box className="space-y-2">
            <TextInput
              label="Business name"
              defaultValue={user?.businessInfo?.businessName}
              {...register('businessName')}
            />
            <TextInput
              label="Business address"
              defaultValue={user?.businessInfo?.address}
              {...register('address')}
            />
            <TextInput
              label="Website"
              defaultValue={user?.businessInfo?.website}
              {...register('website')}
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
