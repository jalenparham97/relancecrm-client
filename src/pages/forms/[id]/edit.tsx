import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Box, Container } from '@mantine/core';
import { formState, selectedElementState } from '@/app/store';
import { useForm } from '@/app/api/forms';
import { FormElement } from '@/core/types';
import FormEditSideDrawer from '@/app/components/forms/FormEditSideDrawer';
import FormEditPageContainer from '@/app/components/forms/FormEditPageContainer';
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
import EmailElement from '@/app/components/forms/elements/EmailElement';
import PhoneNumberElement from '@/app/components/forms/elements/PhoneNumberElement';

const drawerWidth = 370;

const reorder = (list: FormElement[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function edit() {
  const { query } = useRouter();
  const [form, setForm] = useRecoilState(formState);
  const setSelectedElement = useSetRecoilState(selectedElementState);
  const { isLoading, data: formData } = useForm(query.id as string);

  useEffect(() => {
    setForm(formData);
  }, [formData]);

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const content = reorder(form?.content, result.source.index, result.destination.index);
    setForm((prevForm) => ({ ...prevForm, content }));
    setSelectedElement(result.draggableId);
  };

  return (
    <FormEditPageContainer header={!isLoading && <FormPageHeader />}>
      {isLoading && <LoadingLoader height="90vh" />}
      {!isLoading && (
        <Box>
          <Box sx={{ width: `calc(100% - ${drawerWidth}px)` }}>
            <Container className="pt-[80px]" size={750}>
              <Box className="space-y-3">
                <FormHeaderSection form={form} />

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <Box
                        className="space-y-3"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {form?.content?.map((element, i) => {
                          return renderElement(element, i);
                        })}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </DragDropContext>
                <FormSubmitButtonSection />
              </Box>
            </Container>
          </Box>
          <FormEditSideDrawer drawerWidth={drawerWidth} />
        </Box>
      )}
    </FormEditPageContainer>
  );
}

function renderElement(element: FormElement, index: number) {
  const elementsMap = {
    heading: <HeadingElement element={element} index={index} key={element.id} />,
    single_line: <SingleText element={element} index={index} key={element.id} />,
    paragraph: <ParagraphText element={element} index={index} key={element.id} />,
    multiple_choice: <MultipleChoiceElement element={element} index={index} key={element.id} />,
    single_choice: <SingleChoiceElement element={element} index={index} key={element.id} />,
    number: <NumberText element={element} index={index} key={element.id} />,
    email: <EmailElement element={element} index={index} key={element.id} />,
    phone: <PhoneNumberElement element={element} index={index} key={element.id} />,
  };

  return elementsMap[element.subtype];
}
