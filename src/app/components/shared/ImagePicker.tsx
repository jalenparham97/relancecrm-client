import { useState } from 'react';
import {
  Alert,
  Modal,
  Button,
  Group,
  ModalProps,
  Box,
  TextInput,
  Text,
  Tabs as MantineTabs,
  LoadingOverlay,
  ActionIcon,
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import * as yup from 'yup';
import { useYupResolver } from '@/app/hooks';
import { IconAlertCircle, IconUpload, IconX } from '@tabler/icons';
import { useForm } from 'react-hook-form';
import { useStorage } from '@/app/api/storage';
import { useUser } from '@/app/api/auth';
import Tabs from '@/app/components/shared/Tabs';
import TabPanel from '@/app/components/shared/TabPanel';

const schema = yup.object().shape({
  url: yup
    .string()
    .url('Please enter a valid url')
    .trim()
    .required('An image link is required'),
});

interface Props extends ModalProps {
  isLoading?: boolean;
  submit?: (imageUrl: string) => void;
}

export default function ImagePicker({
  opened,
  onClose,
  submit,
  isLoading,
}: Props) {
  const user = useUser();
  const resolver = useYupResolver(schema);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const { register, handleSubmit, reset } = useForm({ resolver });

  const { uploadFile, isUploadLoading } = useStorage();

  const handleFormClose = () => {
    onClose();
    reset({ url: '' });
    setActiveTab(0);
  };

  const handleFileUpload = async (files: File[]) => {
    try {
      const url = await uploadFile(files[0], `${user?._id}/images`);
      if (url) {
        await submit(url);
        handleFormClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileRejectedErrors = (
    files: { errors: { code: string; message: string }[] }[]
  ) => {
    const error = files[0].errors[0];
    switch (error.code) {
      case 'file-too-large':
        setError('File size should not exceed 10mb');
        break;
      case 'file-invalid-type':
        setError(error.message);
        break;
    }
  };

  const handleFormSubmit = async ({ url }: { url: string }) => {
    try {
      await submit(url);
      handleFormClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleFormClose}
      withCloseButton={false}
      size="lg"
      classNames={{ modal: 'p-0', body: 'relative h-full' }}
    >
      <LoadingOverlay visible={isLoading || isUploadLoading} />
      <Tabs
        active={activeTab}
        onTabChange={setActiveTab}
        styles={{ root: { marginLeft: '20px' } }}
        height="40px"
      >
        <MantineTabs.Tab label="Upload" />
        <MantineTabs.Tab label="Link" />
      </Tabs>
      <Box className="p-[20px]">
        <TabPanel index={0} activeIndex={activeTab}>
          {error && (
            <Alert
              title="Error"
              color="red"
              className="mb-3"
              icon={<IconAlertCircle size={16} />}
              withCloseButton
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}
          <Box className="flex justify-center flex-col">
            <Dropzone
              onDrop={handleFileUpload}
              onReject={handleFileRejectedErrors}
              maxSize={1000000}
              accept={IMAGE_MIME_TYPE}
              classNames={{ root: 'h-[300px]' }}
            >
              {(status) => (
                <>
                  <Box
                    className="flex justify-center items-center h-full"
                    style={{ pointerEvents: 'none' }}
                  >
                    <Box className="text-center space-y-5">
                      <IconUpload size="50px" />
                      <Box>
                        <Text size="xl">
                          Click to choose a file or drag here
                        </Text>
                        <Text size="sm" color="dimmed" mt={7}>
                          Size limit: 10 MB
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </>
              )}
            </Dropzone>
          </Box>
        </TabPanel>
        <TabPanel index={1} activeIndex={activeTab}>
          <Box className="space-y-3">
            <TextInput
              placeholder="Paste any image link from the web"
              {...register('url')}
            />
            <Group spacing="sm" position="center">
              <Button onClick={handleSubmit(handleFormSubmit)}>Submit</Button>
            </Group>
          </Box>
        </TabPanel>
      </Box>
      <Box className="absolute top-[6px] right-2">
        <ActionIcon onClick={onClose}>
          <IconX size={16} />
        </ActionIcon>
      </Box>
      {/* <Button
        className="absolute top-[6px] right-2"
        compact
        variant="default"
        leftIcon={<IconX size={14} />}
        onClick={onClose}
      >
        Remove
      </Button> */}
    </Modal>
  );
}
