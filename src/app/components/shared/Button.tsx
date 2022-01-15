import { Button as MantineButton, SharedButtonProps } from '@mantine/core';
import Link from './Link';

interface Props extends SharedButtonProps {
  to?: string;
  children?: React.ReactNode;
  [x: string]: any;
}

export default function Button({ to, children, ...otherProps }: Props) {
  if (to) {
    return (
      <Link to={to}>
        <MantineButton {...otherProps}>{children}</MantineButton>
      </Link>
    );
  }

  return <MantineButton {...otherProps}>{children}</MantineButton>;
}
