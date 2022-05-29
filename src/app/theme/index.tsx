import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from '@mantine/core';
import { useLocalStorageValue } from '@mantine/hooks';

export function ThemeProvider({ children }) {
  const [colorScheme, setColorScheme] = useLocalStorageValue({
    key: 'mantine-color-scheme',
    defaultValue: 'light' as ColorScheme,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || colorScheme === 'dark' ? 'light' : 'dark');

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withNormalizeCSS
        theme={{ colorScheme, primaryColor: 'indigo' }}
        styles={{
          Button: (theme) => ({
            root: { ':disabled': { pointerEvents: 'none' } },
          }),
          Tabs: (theme) => ({
            tabLabel: {
              fontWeight: 600,
              fontSize: '14px',
            },
          }),
          Checkbox: (theme) => ({
            input: { cursor: 'pointer' },
            label: { cursor: 'pointer' },
          }),
          Switch: (theme) => ({
            input: { cursor: 'pointer' },
            label: { cursor: 'pointer' },
          }),
          Modal: (theme) => ({
            title: { fontSize: '25px', fontWeight: 'bold' },
            root: { zIndex: 9999 },
          }),
          Text: (theme) => ({
            dimmed: { color: theme.colorScheme === 'light' ? '' : '' },
          }),
          TextInput: (theme) => ({
            input: {
              ':disabled': {
                opacity: '0.75',
              },
            },
          }),
        }}
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
