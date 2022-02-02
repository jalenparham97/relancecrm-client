import { InputWrapper, Checkbox, InputWrapperProps, Box } from '@mantine/core';

interface Props extends InputWrapperProps {}

export default function CheckboxGroup({ children, ...otherProps }: Props) {
  return (
    <InputWrapper {...otherProps} classNames={{ description: 'mb-3' }}>
      <Box className="space-y-3 mt-1">{children}</Box>
    </InputWrapper>
  );
}
