import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { Box, Text, Container, Title, Loader, Group } from '@mantine/core';
import { formState } from '@/app/store';
import { useForm } from '@/app/api/forms';
import FormEditSideDrawer from '@/app/components/forms/FormEditSideDrawer';
import FormPageContainer from '@/app/components/forms/FormPageContainer';
import FormPageHeader from '@/app/components/forms/FormPageHeader';
import SingleText from '@/app/components/forms/elements/SingleText';
import ParagraphText from '@/app/components/forms/elements/ParagraphText';
import NumberText from '@/app/components/forms/elements/NumberText';
import HeadingElement from '@/app/components/forms/elements/HeadingElement';
import SingleChoiceElement from '@/app/components/forms/elements/SingleChoiceElement';
import MultipleChoiceElement from '@/app/components/forms/elements/MultipleChoiceElement';
import FormSubmitButtonSection from '@/app/components/forms/FormSubmitButtonSection';
import FormHeaderSection from '@/app/components/forms/FormHeaderSection';
import LoadingLoader from '@/app/components/shared/LoadingLoader';
import { FormElement } from '@/core/types';

const drawerWidth = 370;

export default function edit() {
  const { query } = useRouter();
  const [form, setForm] = useRecoilState(formState);
  const { isLoading, data: formData } = useForm(query.id as string);

  useEffect(() => {
    setForm(formData);
  }, [formData]);

  return (
    <FormPageContainer header={!isLoading && <FormPageHeader />}>
      {isLoading && <LoadingLoader height="90vh" />}
      {!isLoading && (
        <Box>
          <Box sx={{ width: `calc(100% - ${drawerWidth}px)` }}>
            <Container className="pt-[80px]" size={750}>
              <Box className="space-y-3">
                <FormHeaderSection form={form} />

                {form?.content?.map((element) => {
                  return renderElement(element);
                })}

                <FormSubmitButtonSection />
              </Box>
            </Container>
          </Box>
          <FormEditSideDrawer drawerWidth={drawerWidth} />
        </Box>
      )}
    </FormPageContainer>
  );
}

function renderElement(element: FormElement) {
  const elementsMap = {
    heading: <HeadingElement element={element} key={element.id} />,
    single_line: <SingleText element={element} key={element.id} />,
    paragraph: <ParagraphText element={element} key={element.id} />,
    multiple_choice: <MultipleChoiceElement element={element} key={element.id} />,
    single_choice: <SingleChoiceElement element={element} key={element.id} />,
    number: <NumberText element={element} key={element.id} />,
  };

  return elementsMap[element.subtype];
}
