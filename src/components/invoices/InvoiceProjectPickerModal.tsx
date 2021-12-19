import { Modal, Button, Group, ModalProps, Box, TextInput, SimpleGrid } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { useUser } from '@/api/auth';
import * as yup from 'yup';
import { useYupResolver } from '@/hooks/useYupResolver';
import { Project } from '@/types';
import { useIsDarkMode, useColors } from '@/hooks';
import { useToggle } from 'react-use';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import { useState } from 'react';
// import ProjectPicker from '@/components/projects/ProjectPicker';
import { useProjects } from '@/api/projects';

interface Props extends ModalProps {
  isLoading?: boolean;
  submit?: () => Promise<void>;
  setProject: (project: Project) => void;
}

export default function InvoiceProjectPickerModal({
  opened,
  onClose,
  submit,
  isLoading,
  setProject,
}: Props) {
  const { data: projects } = useProjects();

  return (
    <Modal opened={opened} onClose={onClose} title="Add to project" size="lg">
      {/* <ProjectPicker projects={projects?.data} setProject={setProject} /> */}

      <Box mt={20}>
        <Group spacing="sm" position="right">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={isLoading} onClick={submit}>
            Save
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}
