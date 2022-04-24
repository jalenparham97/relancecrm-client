import { Modal, Button, Group, ModalProps, Box } from '@mantine/core';
import { Project } from '@/core/types';
import { useProjects } from '@/app/api/projects';
import ProjectPicker from '@/app/components/projects/ProjectPicker';

interface Props extends ModalProps {
  isLoading?: boolean;
  submit?: () => Promise<void>;
  setProject: (project: Project) => void;
}

export default function ProjectPickerModal({
  opened,
  onClose,
  submit,
  isLoading,
  setProject,
}: Props) {
  const { data: projects } = useProjects();

  return (
    <Modal opened={opened} onClose={onClose} title="Add to project">
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
