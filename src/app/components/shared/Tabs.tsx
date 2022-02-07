import { Tabs as MantineTabs, Divider, TabsProps, Box } from '@mantine/core';
import { useIsDarkMode, useColors } from '@/app/hooks';

interface Props extends TabsProps {
  height?: string;
}

export default function Tabs({ children, styles, height = '50px', ...otherProps }: Props) {
  const isDarkMode = useIsDarkMode();
  const colors = useColors();

  return (
    <>
      <MantineTabs
        variant="unstyled"
        styles={(theme) => ({
          tabControl: {
            borderBottom: `2px solid transparent`,
            height,
            color: theme.colorScheme === 'dark' ? '#b5b6b9' : '',
          },
          tabActive: {
            color: theme.colorScheme === 'dark' ? theme.colors.indigo[4] : theme.colors.indigo[6],
            borderBottom: `2px solid ${
              theme.colorScheme === 'dark' ? theme.colors.indigo[4] : theme.colors.indigo[6]
            }`,
            transition: 'all',
            transitionDuration: '150ms',
          },
          ...styles,
        })}
        {...otherProps}
      >
        {children}
      </MantineTabs>
      <Divider className={`-mt-[2px] border-t-2 ${isDarkMode && 'border-dark-400'}`} />
    </>
  );
}
