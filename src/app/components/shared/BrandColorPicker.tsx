import { useState } from 'react';
import { Box, Paper, Text, ColorInput } from '@mantine/core';
import { useIsDarkMode } from '@/app/hooks';
import { MdOutlineColorLens } from 'react-icons/md';

const colors = ['#4263eb', '#18cf76', '#0eb6ff', '#ffc607'];
const textColors = ['#ffffff', '#000000'];

export default function BrandColorPicker() {
  const isDarkMode = useIsDarkMode();
  const [bgColor, setBgColor] = useState(colors[0]);
  const [textColor, setTextColor] = useState(textColors[0]);

  return (
    <Paper
      withBorder
      className={`px-3 py-3 ${
        isDarkMode ? 'border-gray-700 border-opacity-50' : 'border-gray-300'
      }`}
    >
      <Box className="space-y-2">
        <Box className="flex space-x-2">
          <Box className="pt-[2px]">
            <MdOutlineColorLens size="22px" />
          </Box>
          <Box className="space-y-2">
            <Text className="font-semibold">Brand colors</Text>
            <Box className="flex space-x-2">
              <ColorInput
                value={bgColor}
                onChange={setBgColor}
                format="hex"
                size="xs"
                swatches={colors}
                classNames={{ swatch: 'w-5 h-2' }}
              />
              <ColorInput
                value={textColor}
                onChange={setTextColor}
                format="hex"
                size="xs"
                swatches={textColors}
                classNames={{ swatch: 'w-5 h-2' }}
              />
            </Box>
            <Box className="p-2 rounded" sx={{ backgroundColor: bgColor }}>
              <Text className="text-sm font-medium text-center" sx={{ color: textColor }}>
                This is what the text will look like
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
