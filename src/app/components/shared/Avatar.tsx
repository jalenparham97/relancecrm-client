import { Avatar as MantineAvatar, Box, CSSObject, MantineTheme } from '@mantine/core';

interface Props {
  children?: React.ReactNode;
  backgroundColor?: string;
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  // sx?: CSSObject | ((theme: MantineTheme) => CSSObject);
}

export default function Avatar({ children, backgroundColor, size, radius, className }: Props) {
  return (
    <MantineAvatar
      styles={{
        placeholder: {
          backgroundColor,
          color: 'white',
        },
      }}
      className={className}
      size={size}
      radius={radius}
    >
      <Box className="uppercase">{children}</Box>
    </MantineAvatar>
  );
}
