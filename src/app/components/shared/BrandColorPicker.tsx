import { useState } from 'react';
import { Box, Paper, Text, ColorInput } from '@mantine/core';
import { useIsDarkMode } from '@/app/hooks';
import { MdOutlineColorLens } from 'react-icons/md';

const colors = ['#4263eb', '#18cf76', '#0eb6ff', '#ffc607'];
const textColors = ['#ffffff', '#000000'];

interface Props {
  bgColor: string;
  textColor: string;
  setBgColor: (color: string) => void;
  setTextColor: (color: string) => void;
}

export default function BrandColorPicker({ bgColor, textColor, setBgColor, setTextColor }: Props) {
  const isDarkMode = useIsDarkMode();

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
                swatchesPerRow={7}
              />
              <ColorInput
                value={textColor}
                onChange={setTextColor}
                format="hex"
                size="xs"
                swatches={textColors}
                swatchesPerRow={7}
              />
            </Box>
            <Box className="p-2 rounded" sx={{ backgroundColor: bgColor || colors[0] }}>
              <Text
                className="text-sm font-medium text-center"
                sx={{ color: textColor || textColors[0] }}
              >
                This is what the text will look like
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
