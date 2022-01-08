import NextLink from 'next/link';
import { Anchor, AnchorProps } from '@mantine/core';

interface Props {
  to?: string;
  href?: string;
  children?: React.ReactNode;
  className?: string;
  underline?: boolean;
  [x: string]: any;
}

export default function Link({
  to,
  href,
  children,
  className,
  underline = false,
  sx,
  ...otherProps
}: Props) {
  if (to) {
    return (
      <Anchor component={NextLink} sx={sx} href={to} {...otherProps}>
        <a className={`${className} ${underline ? 'hover:underline' : 'no-underline'}`}>
          {children}
        </a>
      </Anchor>
    );
  }

  return (
    <Anchor
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...otherProps}
    >
      {children}
    </Anchor>
  );
}
