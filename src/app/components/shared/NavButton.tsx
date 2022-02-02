import { useRouter } from 'next/router';
import { Button as MantineButton, SharedButtonProps } from '@mantine/core';
import Link from './Link';
import { useColors } from '@/app/hooks';

interface Props extends SharedButtonProps {
  to?: string;
  children?: React.ReactNode;
  [x: string]: any;
}

export default function NavButton({ to, children, ...otherProps }: Props) {
  const router = useRouter();
  const colors = useColors();

  const isRouteMatch = router.asPath === to;

  return (
    <Link to={to}>
      <MantineButton variant={isRouteMatch ? 'filled' : 'default'} {...otherProps}>
        {children}
      </MantineButton>
    </Link>
  );
}
