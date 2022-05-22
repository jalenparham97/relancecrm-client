import { useCallback, useState } from 'react';
import {
  ActionIcon,
  Box,
  Menu,
  Button,
  Modal,
  TextInput,
  Group,
} from '@mantine/core';
import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconChevronDown,
  IconExternalLink,
  IconH1,
  IconH2,
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
  IconPencil,
  IconPhoto,
  IconQuote,
  IconStrikethrough,
  IconTrash,
} from '@tabler/icons';
import { capitalize } from 'lodash';
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  JSONContent,
  FloatingMenu,
} from '@tiptap/react';
import { ProposalContent } from '@/core/types';
import { useRecoilState } from 'recoil';
import { proposalState } from '@/app/store';
import { useDialog } from '@/app/hooks';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import ImagePicker from './ImagePicker';

interface Props {
  onContentUpdate?: (content: JSONContent | string) => void;
  defaultContent?: JSONContent[];
  block?: ProposalContent;
}

export default function BubbleEditor({
  onContentUpdate,
  defaultContent,
  block,
}: Props) {
  const [linkModal, openLinkModal, closeLinkModal] = useDialog();
  const [imagePickerModal, openImagePicker, closeImagePicker] = useDialog();
  const [proposal, setProposal] = useRecoilState(proposalState);
  const [textFormat, setTextFormat] = useState('paragraph');
  const [linkUrl, setLinkUrl] = useState('');
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: {
      type: 'doc',
      content: defaultContent,
    },
    onUpdate({ editor }) {
      setProposal((prevProposal) => {
        const content = [...prevProposal.content];

        const currentBlock = content.find(
          (prevBlock) => prevBlock.id === block.id
        );

        const newBlock: ProposalContent = {
          ...currentBlock,
          content: editor.getJSON().content,
        };

        const blockIndex = content.findIndex(
          (prevBlock) => prevBlock.id === block.id
        );

        content.splice(blockIndex, 1, newBlock);

        return {
          ...prevProposal,
          content,
        };
      });
    },
    onSelectionUpdate({ editor }) {
      if (editor.isActive('paragraph')) {
        setTextFormat('Paragraph');
      }
      if (editor.isActive('heading', { level: 1 })) {
        setTextFormat('Heading 1');
      }
      if (editor.isActive('heading', { level: 2 })) {
        setTextFormat('Heading 2');
      }
      if (editor.isActive('heading', { level: 3 })) {
        setTextFormat('Heading 3');
      }
      if (editor.isActive('heading', { level: 4 })) {
        setTextFormat('Heading 4');
      }
    },
  });

  const unsetLink = useCallback(
    () => editor.chain().focus().extendMarkRange('link').unsetLink().run(),
    [editor]
  );

  const setLink = () => {
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: linkUrl, target: '_blank' })
      .run();

    closeLinkModal();
  };

  const addImage = (url: string) => {
    editor.chain().focus().setImage({ src: url }).run();
  };

  const toggleAlignment = useCallback(
    (alignment: string) => {
      if (editor.isActive({ textAlign: alignment })) {
        editor.chain().focus().unsetTextAlign().run();
        return;
      }

      editor.chain().focus().setTextAlign(alignment).run();
    },
    [editor]
  );

  type Level = 1 | 2 | 3 | 4 | 5 | 6;

  const setHeading = useCallback(
    (level: Level) => {
      editor.chain().focus().setHeading({ level }).run();
      switch (level) {
        case 1:
          setTextFormat('Heading 1');
          break;
        case 2:
          setTextFormat('Heading 2');
          break;
        case 3:
          setTextFormat('Heading 3');
          break;
        case 4:
          setTextFormat('Heading 4');
          break;
        default:
          break;
      }
    },
    [editor]
  );

  const setParagraph = useCallback(() => {
    editor.chain().focus().setParagraph().run();
    setTextFormat('Paragraph');
  }, [editor]);

  const isLinkActive = editor?.isActive('link');

  return (
    <>
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100, hideOnClick: true }}
          className={`bubble-menu flex justify-between p-[5px] bg-white border border-solid border-gray-300 shadow-xl rounded ${
            isLinkActive ? 'w-[95px]' : 'w-[520px]'
          }`}
        >
          {isLinkActive && (
            <>
              <ActionIcon
                component="a"
                href={editor?.getAttributes('link').href}
                target="_blank"
                rel="noopener noreferrer"
                variant="default"
                color="indigo"
                className="border border-solid border-gray-400"
              >
                <IconExternalLink size={16} />
              </ActionIcon>
              <ActionIcon
                onClick={openLinkModal}
                variant="default"
                color="indigo"
                className="border border-solid border-gray-400"
              >
                <IconPencil size={16} />
              </ActionIcon>
              <ActionIcon
                onClick={unsetLink}
                variant="default"
                color="indigo"
                className="border border-solid border-gray-400"
              >
                <IconTrash size={16} />
              </ActionIcon>
            </>
          )}

          {!isLinkActive && (
            <>
              <Box className="flex space-x-1">
                <Menu
                  zIndex={30000}
                  shadow="xl"
                  control={
                    <Button
                      size="xs"
                      variant="default"
                      rightIcon={<IconChevronDown size={12} />}
                      className=" h-7"
                    >
                      {capitalize(textFormat)}
                    </Button>
                  }
                >
                  <Menu.Item
                    className={
                      editor.isActive('paragraph') &&
                      'bg-gray-300 bg-opacity-20'
                    }
                    onClick={setParagraph}
                  >
                    Paragraph
                  </Menu.Item>
                  <Menu.Item
                    className={
                      editor.isActive('heading', { level: 1 }) &&
                      'bg-gray-300 bg-opacity-20'
                    }
                    onClick={() => setHeading(1)}
                  >
                    <h1 className="m-0">Heading 1</h1>
                  </Menu.Item>
                  <Menu.Item
                    className={
                      editor.isActive('heading', { level: 2 }) &&
                      'bg-gray-300 bg-opacity-20'
                    }
                    onClick={() => setHeading(2)}
                  >
                    <h2 className="m-0">Heading 2</h2>
                  </Menu.Item>
                  <Menu.Item
                    className={
                      editor.isActive('heading', { level: 3 }) &&
                      'bg-gray-300 bg-opacity-20'
                    }
                    onClick={() => setHeading(3)}
                  >
                    <h3 className="m-0">Heading 3</h3>
                  </Menu.Item>
                  <Menu.Item
                    className={
                      editor.isActive('heading', { level: 4 }) &&
                      'bg-gray-300 bg-opacity-20'
                    }
                    onClick={() => setHeading(4)}
                  >
                    <h4 className="m-0">Heading 4</h4>
                  </Menu.Item>
                </Menu>
              </Box>
              <Box className="flex space-x-1">
                <ActionIcon
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  variant={editor.isActive('bold') ? 'light' : 'default'}
                  color="indigo"
                  className="border border-solid border-gray-400"
                >
                  <IconBold size={16} />
                </ActionIcon>
                <ActionIcon
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  variant={editor.isActive('italic') ? 'light' : 'default'}
                  color="indigo"
                  className="border border-solid border-gray-400"
                >
                  <IconItalic size={16} />
                </ActionIcon>
                <ActionIcon
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  variant={editor.isActive('strike') ? 'light' : 'default'}
                  color="indigo"
                  className="border border-solid border-gray-400"
                >
                  <IconStrikethrough size={16} />
                </ActionIcon>
                <ActionIcon
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                  variant={editor.isActive('blockquote') ? 'light' : 'default'}
                  color="indigo"
                  className="border border-solid border-gray-400"
                >
                  <IconQuote size={16} />
                </ActionIcon>
                <ActionIcon
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  variant={editor.isActive('bulletList') ? 'light' : 'default'}
                  color="indigo"
                  className="border border-solid border-gray-400"
                >
                  <IconList size={16} />
                </ActionIcon>
                <ActionIcon
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  variant={editor.isActive('orderedList') ? 'light' : 'default'}
                  color="indigo"
                  className="border border-solid border-gray-400"
                >
                  <IconListNumbers size={16} />
                </ActionIcon>
              </Box>
              <Box className="flex space-x-1">
                <ActionIcon
                  onClick={() => toggleAlignment('left')}
                  variant={
                    editor.isActive({ textAlign: 'left' }) ? 'light' : 'default'
                  }
                  color="indigo"
                  className="border border-solid border-gray-400"
                >
                  <IconAlignLeft size={16} />
                </ActionIcon>
                <ActionIcon
                  onClick={() => toggleAlignment('center')}
                  variant={
                    editor.isActive({ textAlign: 'center' })
                      ? 'light'
                      : 'default'
                  }
                  color="indigo"
                  className="border border-solid border-gray-400"
                >
                  <IconAlignCenter size={16} />
                </ActionIcon>
                <ActionIcon
                  onClick={() => toggleAlignment('right')}
                  variant={
                    editor.isActive({ textAlign: 'right' })
                      ? 'light'
                      : 'default'
                  }
                  color="indigo"
                  className="border border-solid border-gray-400"
                >
                  <IconAlignRight size={16} />
                </ActionIcon>
                <ActionIcon
                  onClick={() => toggleAlignment('justify')}
                  variant={
                    editor.isActive({ textAlign: 'justify' })
                      ? 'light'
                      : 'default'
                  }
                  color="indigo"
                  className="border border-solid border-gray-400"
                >
                  <IconAlignJustified size={16} />
                </ActionIcon>
              </Box>
              <Box className="flex space-x-1">
                <ActionIcon
                  onClick={openLinkModal}
                  variant={editor.isActive('link') ? 'light' : 'default'}
                  color="indigo"
                  className="border border-solid border-gray-400"
                >
                  <IconLink size={16} />
                </ActionIcon>
                <ActionIcon
                  onClick={openImagePicker}
                  variant="default"
                  color="indigo"
                  className="border border-solid border-gray-400"
                >
                  <IconPhoto size={16} />
                </ActionIcon>
              </Box>
            </>
          )}
        </BubbleMenu>
      )}
      {editor && (
        <FloatingMenu
          tippyOptions={{ duration: 100 }}
          editor={editor}
          className={`floating-menu flex space-x-1 p-[5px] bg-white border border-solid border-gray-300 shadow-xl rounded w-[156px]`}
        >
          <ActionIcon
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            variant={
              editor.isActive('heading', { level: 1 }) ? 'light' : 'default'
            }
            color="indigo"
            className="border border-solid border-gray-400"
          >
            <IconH1 size={16} />
          </ActionIcon>
          <ActionIcon
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            variant={
              editor.isActive('heading', { level: 2 }) ? 'light' : 'default'
            }
            color="indigo"
            className="border border-solid border-gray-400"
          >
            <IconH2 size={16} />
          </ActionIcon>
          <ActionIcon
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            variant={editor.isActive('bulletList') ? 'light' : 'default'}
            color="indigo"
            className="border border-solid border-gray-400"
          >
            <IconList size={16} />
          </ActionIcon>
          <ActionIcon
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            variant={editor.isActive('orderedList') ? 'light' : 'default'}
            color="indigo"
            className="border border-solid border-gray-400"
          >
            <IconListNumbers size={16} />
          </ActionIcon>
          <ActionIcon
            onClick={openImagePicker}
            variant="default"
            color="indigo"
            className="border border-solid border-gray-400"
          >
            <IconPhoto size={16} />
          </ActionIcon>
        </FloatingMenu>
      )}
      <EditorContent editor={editor} />

      <Modal
        zIndex={100000}
        opened={linkModal}
        onClose={closeLinkModal}
        title="Insert link"
      >
        <TextInput
          label="URL to link"
          defaultValue={editor?.getAttributes('link').href}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://example.com"
        />

        <Box mt={20}>
          <Group spacing="sm" position="right">
            <Button variant="default" onClick={closeLinkModal}>
              Cancel
            </Button>
            <Button onClick={setLink}>Insert</Button>
          </Group>
        </Box>
      </Modal>

      <ImagePicker
        opened={imagePickerModal}
        onClose={closeImagePicker}
        submit={addImage}
      />
    </>
  );
}
