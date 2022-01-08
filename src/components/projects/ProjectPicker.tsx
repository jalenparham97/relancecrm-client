import { forwardRef } from 'react';
import { Autocomplete, Box, Text, Group } from '@mantine/core';
import { Project } from '@/types';
import Avatar from '@/components/shared/Avatar';

interface Props {
  label?: string;
  setProject?: (project: Project) => void;
  projects?: Project[];
  project?: Project;
  isError?: boolean;
  errorMessage?: string;
}

const AutoCompleteItem = forwardRef<HTMLDivElement, Project>(
  ({ projectName, initials, backgroundColor, ...other }: Project, ref) => (
    <div ref={ref} {...other}>
      <Group noWrap spacing="xs">
        <Avatar backgroundColor={backgroundColor} radius="xl">
          {initials}
        </Avatar>

        <Box>
          <Text>{projectName}</Text>
        </Box>
      </Group>
    </div>
  )
);

export default function ProjectPicker({
  label = 'Add a project',
  setProject,
  projects,
  project,
  isError = false,
  errorMessage = 'Project is required',
}: Props) {
  const data = projects?.map((project) => ({
    id: project._id,
    value: project?.projectName,
    projectName: project?.projectName,
    initials: project?.initials,
    backgroundColor: project?.backgroundColor,
  }));

  const handleChange = (projectName: string) => {
    setProject(projects.find((project) => project.projectName === projectName));
  };

  return (
    <Autocomplete
      label={label}
      onChange={handleChange}
      defaultValue={project?.projectName || ''}
      itemComponent={AutoCompleteItem}
      data={data}
      error={isError && errorMessage}
      filter={(value, item) => item.value.toLowerCase().includes(value.toLowerCase().trim())}
    />
  );
}
