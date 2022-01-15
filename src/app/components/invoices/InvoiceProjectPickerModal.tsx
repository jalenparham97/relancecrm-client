import { Modal, Button, Group, ModalProps, Box } from '@mantine/core';
import { Project } from '@/core/types';
import ProjectPicker from '@/app/components/projects/ProjectPicker';
import { useProjects } from '@/app/api/projects';

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
      <ProjectPicker projects={projects?.data} setProject={setProject} />

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
