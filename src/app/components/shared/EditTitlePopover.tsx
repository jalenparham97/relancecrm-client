import React, { useState } from 'react';
import { ActionIcon, Group, Popover, TextInput } from '@mantine/core';
import { FiEdit2 } from 'react-icons/fi';
import Button from '../shared/Button';

interface Props {
  title?: string;
  ref?: any;
  opened?: boolean;
  onClose?: () => void;
  onSubmit?: (title: string) => Promise<void>;
  [x: string]: any;
}

export default function EditTitlePopover({
  title,
  ref,
  opened,
  onClose,
  onSubmit,
  ...otherProps
}: Props) {
  const [value, setValue] = useState(title);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(value);
    onClose();
  };

  return (
    <Popover
      opened={opened}
      onClose={onClose}
      position="bottom"
      placement="start"
      withArrow
      withCloseButton
      transition="pop-top-right"
      target={
        <ActionIcon variant="default" onClick={onClose} title="Edit title" {...otherProps}>
          <FiEdit2 />
        </ActionIcon>
      }
    >
      <form className="w-56" onSubmit={handleSubmit}>
        <Group direction="column" grow>
          <TextInput
            label="Edit title"
            defaultValue={title}
            onChange={(e) => setValue(e.target.value)}
          />
          <Group spacing="xs" grow>
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </Group>
        </Group>
      </form>
    </Popover>
  );
}
