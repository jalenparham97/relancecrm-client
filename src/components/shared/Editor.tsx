import dynamic from 'next/dynamic';
import { RichTextEditorProps } from '@mantine/rte';
import { Editor as TinyEditor } from '@tinymce/tinymce-react';
import { useState } from 'react';

const RichTextEditor = dynamic(() => import('@mantine/rte'), { ssr: false });

export default function Editor(props: RichTextEditorProps) {
  return <RichTextEditor sticky stickyOffset={180} {...props} />;
}

const toolbarOptions = `undo redo | formatselect | bold italic | \
alignleft aligncenter alignright alignjustify | \
bullist numlist emoticons | link Preview | help`;

const pluginOptions = [
  'advlist autolink lists link image charmap print preview anchor',
  'searchreplace visualblocks code fullscreen',
  'insertdatetime media table paste code help wordcount emoticons',
];

export function TextEditor() {
  return (
    <TinyEditor
      apiKey="yqaj3lud4iy6w15q3z1sycz6sxywfu8oyz7o7hhl8d4gwz9m"
      initialValue={''}
      init={{
        height: 650,
        menubar: false,
        plugins: pluginOptions,
        toolbar: toolbarOptions,
        content_style: 'p,h1,h2,h3,h4,h5,h6 { margin: 0; }',
        default_link_target: '_blank',
      }}
      // onEditorChange={handleEditorChange}
    />
  );
}
