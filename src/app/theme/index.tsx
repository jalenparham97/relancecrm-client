import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { useLocalStorageValue } from '@mantine/hooks';

export function ThemeProvider({ children }) {
  const [colorScheme, setColorScheme] = useLocalStorageValue({
    key: 'mantine-color-scheme',
    defaultValue: 'light' as ColorScheme,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || colorScheme === 'dark' ? 'light' : 'dark');

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        withNormalizeCSS
        theme={{ colorScheme, primaryColor: 'indigo' }}
        styles={{
          Button: (theme) => ({
            root: { ':disabled': { pointerEvents: 'none' } },
          }),
          Tabs: (theme) => ({
            tabLabel: { fontWeight: 'bold' },
            tabControl: { height: '50px' },
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
          }),
          Text: (theme) => ({
            dimmed: { color: theme.colorScheme === 'light' ? '' : '' },
          }),
        }}
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
