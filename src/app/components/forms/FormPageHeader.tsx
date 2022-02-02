import { useRouter } from 'next/router';
import { useForm } from '@/app/api/forms';
import { ActionIcon, Box, Group, Header, Title } from '@mantine/core';
import { FiArrowLeft, FiEdit2, FiFileText, FiSend } from 'react-icons/fi';
import Link from '../shared/Link';
import Button from '../shared/Button';
import NavButton from '../shared/NavButton';

export default function FormPageHeader() {
  const { query } = useRouter();
  const { data: form } = useForm(query.id as string);

  return (
    <Header
      height={70}
      padding="md"
      fixed
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? '' : '',
        zIndex: 200,
      })}
    >
      <Box className="flex justify-between items-center h-full">
        <Box className="flex items-center space-x-5">
          <Link to="/forms">
            <ActionIcon size="lg">
              <FiArrowLeft size="20px" />
            </ActionIcon>
          </Link>
          <Title order={2}>{form?.name}</Title>
        </Box>
        <Box className="flex items-center space-x-3">
          <NavButton to={`/forms/${query.id}/edit`} leftIcon={<FiEdit2 />}>
            Create
          </NavButton>
          <NavButton to={`/forms/${query.id}/share`} leftIcon={<FiSend />}>
            Share
          </NavButton>
          <NavButton to={`/forms/${query.id}/responses`} leftIcon={<FiFileText />}>
            Responses
          </NavButton>
        </Box>
      </Box>
    </Header>
  );
}
